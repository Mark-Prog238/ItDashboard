import { betterAuth, type BetterAuthPlugin } from "better-auth";
import { dashboardDB} from "@/lib/db/pg-pool";
import { createAuthEndpoint, APIError } from "better-auth/api";
import { setSessionCookie } from "better-auth/cookies";
import { z } from "zod";
import { verifyLdapCredentials} from "@/features/auth/ldap";

export const ldapPlugin = (): BetterAuthPlugin => ({
    id: "ldap",
    endpoints: {
        signInLdap: createAuthEndpoint(
            "/sign-in/ldap",
            {
                method: "POST",
                body: z.object({
                    username: z.string(),
                    password: z.string(),
                }),
            },
            async (ctx) => {
                const { username, password } = ctx.body;
                const ldapUser = await verifyLdapCredentials(username, password);

                if (!ldapUser) {
                    throw new APIError("UNAUTHORIZED", {
                        message: "Napačno uporabniško ime ali geslo.",
                    });
                }

                // 1. Poišči obstoječega uporabnika ali ga ustvari
                const existing = await ctx.context.internalAdapter.findUserByEmail(
                    ldapUser.email.toLowerCase(),
                    { includeAccounts: false }
                );
                let user = existing ? existing.user : null;

                if (!user) {
                    user = await ctx.context.internalAdapter.createUser(
                        {
                            email: ldapUser.email.toLowerCase(),
                            name: ldapUser.displayName,
                            emailVerified: true,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        },
                        { method: "ldap" } as any
                    );
                }

                if (!user) {
                    throw new APIError("INTERNAL_SERVER_ERROR", {
                        message: "Napaka pri ustvarjanju uporabniškega računa.",
                    });
                }

                // 2. Ustvari sejo v bazi (privzeto 30 dni)
                const session = await ctx.context.internalAdapter.createSession(user.id);
                if (!session) {
                    throw new APIError("INTERNAL_SERVER_ERROR", {
                        message: "Napaka pri ustvarjanju seje.",
                    });
                }

                // 3. Varno nastavi HTTP-only piškotek (Session Cookie)
                await setSessionCookie(ctx, {
                    session,
                    user,
                });

                return ctx.json({
                    user,
                    session,
                });
            }
        ),
    },
});

export const auth = betterAuth({
    database: dashboardDB,
    secret: process.env.BETTER_AUTH_SECRET || "",
    trustedOrigins: [
        // HTTP
        "http://localhost:3000",
        "https://dashboard.butanplin.si",
        "http://dashboard.butanplin.si",
        "http://10.31.1.80",
        "https://10.31.1.80",
        ...(process.env.BETTER_AUTH_URL ? [process.env.BETTER_AUTH_URL] : []),
    ],
    session: {
        expiresIn: 60 * 60 * 24 * 30, // 30 dni veljavnosti
        updateAge: 60 * 60 * 24, // Osveži vsakih 24 ur aktivnosti (sliding session)
    },
    emailAndPassword: {
        enabled: true,
    },
    plugins: [ldapPlugin()],
});
