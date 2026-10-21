import {createColumnHelper} from "@tanstack/react-table";
import {features} from "@/components/pos-devices/table-features";
export type Devices = {
    ValkirePosUnitID: string,
    Vehicle: string
    PosCurrentIPV4: string
    FiscBusinessPremiseID: string
    FiscElectronicDeviceID: string
    PosConnectStartLast: Date | null
}
export const columnHelper = createColumnHelper<typeof features, Devices>()

// 1. Remove columnHelper.columns() and just use a standard array
export const columns: any[] = [
    columnHelper.accessor('ValkirePosUnitID', {
        header: 'ValkirePosUnitID',
    }),

    columnHelper.accessor('Vehicle', {
        header: 'Vehicle',
    }),

    columnHelper.accessor('PosCurrentIPV4', {
        header: 'PosCurrentIPV4',
    }),

    columnHelper.accessor('FiscBusinessPremiseID', {
        header: 'FiscBusinessPremiseID',
    }),

    columnHelper.accessor('FiscElectronicDeviceID', {
        header: 'FiscElectronicDeviceID',
    }),
    columnHelper.accessor('PosConnectStartLast', {
        header: 'Last Connection',
        cell: (info) => {
            const rawDate = info.getValue();

            // Handle null/empty values gracefully
            if (!rawDate) return "N/A";

            // Formats to: 26. 09. 2018, 18:41 (Standard European/Slovenian format)
            return new Intl.DateTimeFormat('sl-SI', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            }).format(new Date(rawDate));
        }
    }),
]