import sql from "mssql";

// 1. Provide a dummy URL so it doesn't crash on 'undefined' during the Docker build
const dbUrl = process.env.VALKIRE_DATABASE_URL || "mssql://dummy:dummy@localhost:1433/dummy";

// 2. Initialize the pool safely
export const valkirePool = new sql.ConnectionPool(dbUrl);

// 3. Safely export the connection promise
export const valkireDbConnect = process.env.VALKIRE_DATABASE_URL
    ? valkirePool.connect()
    : Promise.resolve(valkirePool);