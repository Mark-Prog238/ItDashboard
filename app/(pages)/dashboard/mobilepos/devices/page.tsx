import { Suspense } from "react";
import { connection } from "next/server";
import { Card,CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import DeviceTable from "@/components/pos-devices/table";
import {AllDevicesData, IpFilteredDevices} from "@/lib/VALKIRE/functions";
import {Smartphone,CheckCircle2,AlertCircle} from 'lucide-react'


export default async function Page() {
    const ipDevices = await IpFilteredDevices()
    const allDevices = await AllDevicesData()
    const alldevicesCount = allDevices ? allDevices.length : 0;
    const onlineDevicesCount = ipDevices ? ipDevices.length : 0
    const fiscalizationDevices = alldevicesCount && onlineDevicesCount ? alldevicesCount - onlineDevicesCount : 0
    return(
        <div className="flex-1 w-full p-6 space-y-6">
                <div className="flex w-full flex-row gap-4">
                    <Card className="flex-1 min-h-36 flex flex-col justify-between">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Total Units
                            </CardTitle>
                            <Smartphone className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{alldevicesCount}</div>
                            <p className="text-xs text-muted-foreground mt-1">Configured MobilePOS terminals</p>
                        </CardContent>
                    </Card>
                    <Card className="flex-1 min-h-36 flex flex-col justify-between">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Online Devices
                            </CardTitle>
                            <CheckCircle2 className="size-4 text-emerald-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{onlineDevicesCount}</div>
                            <p className="text-xs text-muted-foreground mt-1">Active IP heartbeat</p>
                        </CardContent>
                    </Card>
                    <Card className="flex-1 min-h-36 flex flex-col justify-between">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Fiscalization Offline
                            </CardTitle>
                            <AlertCircle className="size-4 text-amber-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{fiscalizationDevices}</div>
                            <p className="text-xs text-muted-foreground mt-1">Pending sync or unreachable</p>
                        </CardContent>
                    </Card>
                </div>
                {/* DATA TABLE */}
                <div className="space-y-4">
                    <Suspense fallback={<div className="p-4 text-sm text-gray-500">Loading devices...</div>}>
                          <DeviceTable data={allDevices}/>
                    </Suspense>
                </div>
            </div>
    );
}