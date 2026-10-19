import { valkireDbConnect } from "@/lib/VALKIRE/connector";
import { DataTable } from "@/components/pos-devices/data-table";
import { columns } from "@/components/pos-devices/columns";

export const instant = false;

export default async function Page() {
    const pool = await valkireDbConnect;
    const result = await pool.request().query('SELECT * FROM ValkirePosUnit');
    const data = result.recordset;

    return (
        <div className="w-full">
            <h1 className="text-2xl font-bold mb-4">Valkire POS Units</h1>
            {/* Pass the data and columns to the interactive client table */}
            <DataTable columns={columns} data={data} />
        </div>
    );
}