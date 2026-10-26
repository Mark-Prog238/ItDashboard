import { getDbPool} from "@/lib/db/mssql-pool";
import { connection } from "next/server";
import {Users} from "../types";


/* USERS FUNCTIONS */

export const allUsersData = async (): Promise<Users[]> => {
    await connection(); // MUST be outside try/catch
    try {
        const pool = await getDbPool();
        const result = await pool.request().query("SELECT * FROM ValkirePosUser");
        return (result.recordset as Users[]) ?? [];
    } catch (error) {
        console.error("Database error in allDevicesCount:", error);
        return [];
    }
};

export const allUsersCount = async (): Promise<number> => {
    await connection(); // MUST be outside try/catch
    try {
        const pool = await getDbPool();
        const result = await pool
            .request()
            .query("SELECT COUNT(ValkirePosUserID) AS count FROM ValkirePosUser");
        return result.recordset[0]?.count ?? 0;
    } catch (error) {
        console.error("Database error in allDevicesCount:", error);
        return 0;
    }
};