"use server";

import { verifyLdapCredentials } from "@/lib/ldap";

export async function testLdapLogin(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const ldapUser = await verifyLdapCredentials(email, password);


    if (!ldapUser) {
        console.log("❌ Napačno uporabniško ime ali geslo.");
        return { success: false, message: "Napačno uporabniško ime ali geslo." };
    } else {
        console.log("✅ Uspešna prijava uporabnika:", ldapUser);
        return { success: true, user: ldapUser };
    }
}