import { Suspense } from "react";
import { valkireDbConnect } from "@/lib/VALKIRE/connector";
import { Card } from "@/components/ui/card";
import DeviceTable from "@/components/pos-devices/table";

// 1. Move the database query into its own async component
async function TableData() {
    const pool = await valkireDbConnect;
    const result = await pool.request().query('SELECT * FROM ValkirePosUnit');
    const data = result.recordset;

    return <DeviceTable data={data} />;
}

// 2. The main Page component is NO LONGER async!
// No 'instant', no 'connection()', no 'dynamic' flags needed.
export default function Page() {
    return (
        <div className="flex min-w-screen min-h-screen">
            <div className="w-full flex flex-col">

                {/* QUICK DATA CARDS (Built instantly) */}
                <div className="w-full flex flex-row gap-4 p-4">
                    <Card className="flex-1 flex items-center justify-center py-6">card 1</Card>
                    <Card className="flex-1 flex items-center justify-center py-6">card 2</Card>
                    <Card className="flex-1 flex items-center justify-center py-6">card 3</Card>
                </div>

                {/* DATA TABLE (Waits for runtime to execute) */}
                <Suspense fallback={<div className="p-4 text-sm text-gray-500">Loading devices...</div>}>
                    <TableData />
                </Suspense>

            </div>
        </div>
    );
}