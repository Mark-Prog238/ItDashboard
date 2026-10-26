import { Client } from "ldapts";
import { readFileSync } from "node:fs";

export interface LdapUser {
    username: string;
    displayName: string;
    email: string;
    groups: string[]
}

// Dovoljeni znaki v sAMAccountName (prepreči LDAP injection)
const USERNAME_REGEX = /^[a-zA-Z0-9._-]{1,64}$/;

// RFC 4515 escape za vrednosti v LDAP filtrih
function escapeLdapFilter(value: string): string {
    return value.replace(/[\\*()\0]/g, (c) => "\\" + c.charCodeAt(0).toString(16).padStart(2, "0"));
}

function buildTlsOptions() {
    const caPath = process.env.LDAP_CA_CERT_PATH;
    if (caPath) {
        return { ca: [readFileSync(caPath)], rejectUnauthorized: true };
    }
    return { rejectUnauthorized: false };
}

export async function verifyLdapCredentials(
    inputUsername: string,
    password: string
): Promise<LdapUser | null> {
    if (!inputUsername?.trim() || !password) return null;

    let username = inputUsername.trim();
    if (username.includes("\\")) username = username.split("\\").pop()!;
    if (username.includes("@")) username = username.split("@")[0];

    if (!USERNAME_REGEX.test(username)) return null;

    // Privzete vrednosti omogočajo delovanje tudi v Docker kontejnerju, če .env ni posredovan prek env_file
    const netbiosDomain = process.env.LDAP_NETBIOS_DOMAIN || "SHVE";
    const ldapUrl = process.env.LDAP_URL || "ldaps://10.180.251.4:636";
    const baseDn = process.env.LDAP_BASE_DN || "OU=Users,OU=SI-BP,DC=shvenergy,DC=corp";

    const client = new Client({
        url: ldapUrl,
        timeout: 5000,
        connectTimeout: 5000,
        tlsOptions: buildTlsOptions(),
    });

    try {
        // Bind v NetBIOS obliki (SHVE\mark.salamon)
        await client.bind(`${netbiosDomain}\\${username}`, password);

        const { searchEntries } = await client.search(baseDn, {
            scope: "sub",
            filter: `(&(objectClass=user)(sAMAccountName=${escapeLdapFilter(username)}))`,
            attributes: ["displayName", "mail", "userPrincipalName", "memberOf"],
            sizeLimit: 1,
        });

        const entry = searchEntries[0];
        let rawGroups: string[] = [];

        if (entry?.memberOf) {
            rawGroups = Array.isArray(entry.memberOf)
                ? (entry.memberOf as string[])
                : [entry.memberOf as string];
        }
        // 3. Izlušči samo čisto ime skupine (iz "CN=IT_Admins,OU=Groups,DC=..." vzamemo "IT_Admins")
        const groups = rawGroups.map((dn) => {
            const match = dn.match(/^CN=([^,]+)/i);
            return match ? match[1] : dn;
        });

        return {
            username,
            displayName: (entry?.displayName as string) || username,
            email: (entry?.mail as string) || (entry?.userPrincipalName as string) || `${username}@butanplin.si`,
            groups, // 👈 vrnemo npr. ["IT_Admins", "Domain Users", "MobilePOS_Managers"]
        };
    } catch (error) {
        console.error("LDAP napaka pri prijavi:", error);
        return null;
    } finally {
        await client.unbind().catch(() => {});
    }
}

// TODO add checks for users group to see if he is authorized to view pages and if