import { valkireDbConnect } from "@/lib/VALKIRE/connector";
import {PosDevicesTable} from "@/components/pos-devices/pos-devices";

export const instant = false;

export default async function Page() {
    const pool = await valkireDbConnect;
    const result = await pool.request().query('SELECT * FROM ValkirePosUnit');
    const data = result.recordset;


    return (
        <div>
            <h1>Valkire POS Units</h1>
            <PosDevicesTable></PosDevicesTable>
        </div>
    );
}