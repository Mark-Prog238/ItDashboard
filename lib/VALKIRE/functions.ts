import { valkireDbConnect } from "@/lib/VALKIRE/connector";

export const DevicesData = async() => {
    const pool = await valkireDbConnect;
    const result = await pool.request().query('SELECT * FROM ValkirePosUnit');
    const data = result.recordset;
    if(data){
        return data
    }
}
