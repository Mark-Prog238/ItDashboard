import { Suspense } from "react";
import { connection } from "next/server";
import { valkireDbConnect } from "@/lib/VALKIRE/connector";
import { Card } from "@/components/ui/card";
import UsersTable from "@/components/pos-users/table";

// 1. Move the database query into its own async component
async function TableData() {
    // CRITICAL: Since TableData is wrapped in <Suspense> below, awaiting connection() here
    // safely tells Next.js to stop during `npm run build` and only run the query at runtime.
    await connection();

    const pool = await valkireDbConnect;
    const result = await pool.request().query('SELECT * FROM ValkirePosUser');
    const data = result.recordset;

    return <UsersTable data={data} />;
}

// 2. The main Page component stays synchronous
export default function Page() {
    return (
        <div className="flex w-full min-h-screen">
            <div className="w-full flex flex-col">

                {/* QUICK DATA CARDS (Prerendered into the static shell at build time) */}
                <div className="w-full flex flex-row gap-4 p-4">
                    <Card className="flex-1 flex items-center justify-center py-6">card 1</Card>
                    <Card className="flex-1 flex items-center justify-center py-6">card 2</Card>
                    <Card className="flex-1 flex items-center justify-center py-6">card 3</Card>
                </div>

                {/* DATA TABLE (Streams dynamically at request time) */}
                <Suspense fallback={<div className="p-4 text-sm text-gray-500">Loading devices...</div>}>
                    <TableData />
                </Suspense>

            </div>
        </div>
    );
}
