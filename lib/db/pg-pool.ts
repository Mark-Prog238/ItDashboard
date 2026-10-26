import { Pool } from "pg";

// 1. Declare a global scope for Next.js HMR so pools aren't recreated on every save
const globalForPg = globalThis as unknown as {
    dashboardDB: Pool | undefined;
    endpointCentralDB: Pool | undefined;
};

// 2. Instantiate the pools once (or use the existing global one in dev)
export const dashboardDB =
    globalForPg.dashboardDB ??
    new Pool({
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
    });

export const endpointCentralDB =
    globalForPg.endpointCentralDB ??
    new Pool({
        host: process.env.EC_DATABASE_HOST,
        port: Number(process.env.EC_DATABASE_PORT),
        user: process.env.EC_DATABASE_USER,
        password: process.env.EC_DATABASE_PASSWORD,
        database: process.env.EC_DATABASE_NAME,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
    });

// Save to globalThis in non-production environments
if (process.env.NODE_ENV !== "production") {
    globalForPg.dashboardDB = dashboardDB;
    globalForPg.endpointCentralDB = endpointCentralDB;
}
