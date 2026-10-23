import { Client } from "ldapts";

export interface LdapUser {
    username: string;
    displayName: string;
    email: string;
}

export async function verifyLdapCredentials(
    username: string,
    password: string
): Promise<LdapUser | null> {
    if (!username || !password) return null;

    const client = new Client({
        url: process.env.LDAP_URL!,
        timeout: 5000,
        connectTimeout: 5000,
    });

    try {
        const userPrincipalName = username.includes("@")
            ? username
            : `${username}@${process.env.LDAP_DOMAIN}`;


        await client.bind(userPrincipalName, password);

        const cleanUsername = username.split("@")[0];
        const searchResult = await client.search(process.env.LDAP_BASE_DN!, {
            scope: "sub",
            filter: `(&(objectClass=user)(sAMAccountName=${cleanUsername}))`,
            attributes: ["displayName", "mail", "sAMAccountName"],
        });

        await client.unbind();

        const entry = searchResult.searchEntries[0];
        const displayName = (entry?.displayName as string) || cleanUsername;
        const email = (entry?.mail as string) || `${cleanUsername}@${process.env.LDAP_DOMAIN}`;

        return {
            username: cleanUsername,
            displayName,
            email,
        };
    } catch (error) {
        await client.unbind().catch(() => {});
        return null;
    }
}