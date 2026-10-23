import sql from "mssql";

const globalForSql = globalThis as unknown as {
    mssqlPool?: sql.ConnectionPool;
};

export async function getDbPool(): Promise<sql.ConnectionPool> {
    // 1. Reuse existing active connection if healthy
    if (globalForSql.mssqlPool?.connected) {
        return globalForSql.mssqlPool;
    }

    const dbUrl = process.env.VALKIRE_DATABASE_URL;
    if (!dbUrl) {
        throw new Error("VALKIRE_DATABASE_URL is missing in .env");
    }

    // 2. Connect on demand
    const pool = new sql.ConnectionPool(dbUrl);
    await pool.connect();

    if (process.env.NODE_ENV !== "production") {
        globalForSql.mssqlPool = pool;
    }

    return pool;
}