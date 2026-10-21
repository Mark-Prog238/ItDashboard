
import { valkireDbConnect } from "@/lib/VALKIRE/connector";

export const AllDevicesData = async() => {
    const pool = await valkireDbConnect;
    const result = await pool.request().query('SELECT * FROM ValkirePosUnit');
    const data = result.recordset
    return data
}


export const IpFilteredDevices = async() => {
    const pool = await valkireDbConnect;
    const result = await pool.request().query('SELECT ValkirePosUnitID, Vehicle, PosCurrentIPV4, FiscBusinessPremiseID, FiscElectronicDeviceID FROM ValkirePosUnit WHERE PosCurrentIPV4 IS NOT NULL');
    const data = result.recordset
    return data
}