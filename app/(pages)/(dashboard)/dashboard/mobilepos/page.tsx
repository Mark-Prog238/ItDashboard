import { valkireDbConnect } from "@/lib/VALKIRE/connector";
import { Card } from "@/components/ui/card";
import DeviceTable from "@/components/pos-devices/table";
import { connection } from "next/server";

export const instant = false;

export default async function Page() {
    await connection();

    const pool = await valkireDbConnect;
    const result = await pool.request().query('SELECT * FROM ValkirePosUnit');
    const data = result.recordset;

    return (
        <div className="flex min-w-screen min-h-screen">
            <div className="w-full flex flex-col">
                <div className="w-full flex flex-row gap-4 p-4">
                    {/* ADDED 'flex' HERE so items-center and justify-center actually work */}
                    <Card className="flex-1 flex items-center justify-center py-6">card 1</Card>
                    <Card className="flex-1 flex items-center justify-center py-6">card 2</Card>
                    <Card className="flex-1 flex items-center justify-center py-6">card 3</Card>
                </div>
                <DeviceTable data={data}/>
            </div>
        </div>
    );
}