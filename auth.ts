import { betterAuth } from "better-auth";
import { Pool } from "pg";

export const auth = betterAuth({

    emailAndPassword: {
        enabled: true,
    },
    database: new Pool({
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
    }),
})