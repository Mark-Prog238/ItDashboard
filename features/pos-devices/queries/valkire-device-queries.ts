import { getDbPool} from "@/lib/db/mssql-pool";
import { connection } from "next/server";
import {Devices} from "../types";
// D A T A
export const allDevicesData = async (): Promise<Devices[]> => {
    await connection(); // MUST be outside try/catch
    try {
        const pool = await getDbPool();
        const result = await pool.request().query("SELECT * FROM ValkirePosUnit ORDER BY PosConnectStartLast DESC");
        return (result.recordset as Devices[]) ?? [];
    } catch (error) {
        console.error("Database error in AllDevicesData:", error);
        return [];
    }
};
/*ValkirePosUnitID: selectedDevice?.ValkirePosUnitID ?? "",
    Vehicle: String(form.get("vehicle") ?? ""),
    FiscBusinessPremiseID: String(form.get("FiscBusinessPremiseID") ?? ""),
    FiscElectronicDeviceID: String(form.get("FiscElectronicDeviceID") ?? ""),*/
// U P D A T E    V A L U E S
export const updateDeviceData = async (data: Partial<Devices>) => {
    await connection();
    try {
        const pool = await getDbPool();
        const result = await pool
            .request()
            .input("id", data.ValkirePosUnitID)
            .input("reg", data.Vehicle)
            .input("premiseId", data.FiscBusinessPremiseID)
            .input("deviceId", data.FiscElectronicDeviceID)
            .query(`UPDATE ValkirePosUnit
            SET 
                Vehicle = @reg,
                FiscBusinessPremiseID = @premiseId,
                FiscElectronicDeviceID = @deviceId
            WHERE ValkirePosUnitID = @id`)
        return result
    } catch(error) {
        console.error("Database error in updateDeviceData:", error);
        return error;
    }
}



// C O U N T
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

