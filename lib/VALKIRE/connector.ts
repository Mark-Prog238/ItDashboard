import sql from "mssql";

const dbUrl =
    process.env.VALKIRE_DATABASE_URL ||
    "Server=localhost,1433;Database=dummy;User Id=dummy;Password=dummy;Encrypt=false;TrustServerCertificate=true";

export const valkirePool = new sql.ConnectionPool(dbUrl);

export const valkireDbConnect = process.env.VALKIRE_DATABASE_URL
    ? valkirePool.connect()
    : Promise.resolve(valkirePool);