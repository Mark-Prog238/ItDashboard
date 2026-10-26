import { getDbPool} from "@/lib/db/mssql-pool";
import { connection } from "next/server";
import {Devices} from "../types";

export const allDevicesData = async (): Promise<Devices[]> => {
    await connection(); // MUST be outside try/catch
    try {
        const pool = await getDbPool();
        const result = await pool.request().query("SELECT * FROM ValkirePosUnit");
        return (result.recordset as Devices[]) ?? [];
    } catch (error) {
        console.error("Database error in AllDevicesData:", error);
        return [];
    }
};

export const ipFilteredDevices = async (): Promise<Devices[]> => {
    await connection(); // MUST be outside try/catch
    try {
        const pool = await getDbPool();
        const result = await pool.request().query(`
            SELECT 
                ValkirePosUnitID, 
                Vehicle, 
                PosCurrentIPV4, 
                FiscBusinessPremiseID, 
                FiscElectronicDeviceID,
                PosConnectStartLast
            FROM ValkirePosUnit 
            WHERE PosCurrentIPV4 IS NOT NULL AND PosCurrentIPV4 <> ''
        `);
        return (result.recordset as Devices[]) ?? [];
    } catch (error) {
        console.error("Database error in IpFilteredDevices:", error);
        return [];
    }
};

export const allDevicesCount = async (): Promise<number> => {
    await connection(); // MUST be outside try/catch
    try {
        const pool = await getDbPool();
        const result = await pool
            .request()
            .query("SELECT COUNT(ValkirePosUnitID) AS count FROM ValkirePosUnit");
        return result.recordset[0]?.count ?? 0;
    } catch (error) {
        console.error("Database error in allDevicesCount:", error);
        return 0;
    }
};

export const onlineDevicesCount = async (): Promise<number> => {
    await connection(); // MUST be outside try/catch
    try {
        const pool = await getDbPool();
        const result = await pool
            .request()
            .query("SELECT COUNT(PosCurrentIPV4) AS count FROM ValkirePosUnit WHERE PosCurrentIPV4 IS NOT NULL AND PosCurrentIPV4 <> ''");
        return result.recordset[0]?.count ?? 0;
    } catch (error) {
        console.error("Database error in onlineDevicesCount:", error);
        return 0;
    }
};
