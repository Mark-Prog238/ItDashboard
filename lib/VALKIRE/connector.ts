
//import { Pool } from "pg"; phg is for psotgres

import sql from "mssql";

// Initialize the pool with your SQL Server connection string
export const valkirePool = new sql.ConnectionPool(process.env.VALKIRE_DATABASE_URL as string);

// Export a promise that resolves when the connection is established
export const valkireDbConnect = valkirePool.connect();