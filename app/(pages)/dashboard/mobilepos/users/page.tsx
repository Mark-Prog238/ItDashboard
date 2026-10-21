import { Suspense } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import {AllUsersData, onlineDevicesCount, AllUsersCount} from "@/lib/VALKIRE/functions";
import { Smartphone, CheckCircle2, AlertCircle } from "lucide-react";
import UsersTable from "@/components/pos-users/table";

// 1. Child async component performs the data fetching inside the <Suspense> boundary
async function UsersDashboard() {
    const [allUsers, all, online] = await Promise.all([
        AllUsersData(),
        AllUsersCount(),
        onlineDevicesCount(),
    ]);

    const fiscalizationDevices = Math.max(0, all - online);

    return (
        <>
            <div className="flex w-full flex-row gap-4">
                <Card className="flex-1 min-h-36 flex flex-col justify-between">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Users
                        </CardTitle>
                        <Smartphone className="size-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{all}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            All registered users
                        </p>
                    </CardContent>
                </Card>

                <Card className="flex-1 min-h-36 flex flex-col justify-between">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                {/*            Online Devices*/}
                        </CardTitle>
                        <CheckCircle2 className="size-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{/*{online}*/}</div>
                        <p className="text-xs text-muted-foreground mt-1">
          {/*                  Active IP heartbeat*/}
                        </p>
                    </CardContent>
                </Card>

                <Card className="flex-1 min-h-36 flex flex-col justify-between">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                         {/*   Fiscalization Offline*/}
                        </CardTitle>
                        <AlertCircle className="size-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{/*{fiscalizationDevices}*/}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                     {/*       Pending sync or unreachable*/}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* DATA TABLE */}
            <div className="space-y-4">
                <UsersTable data={allUsers} />
            </div>
        </>
    );
}

// 2. Main Page component stays synchronous and wraps the async component in <Suspense>
export default function Page() {
    return (
        <div className="flex-1 w-full p-6 space-y-6">
            <Suspense fallback={<div className="p-4 text-sm text-muted-foreground">Loading dashboard...</div>}>
                <UsersDashboard />
            </Suspense>
        </div>
    );
}