import {createColumnHelper} from "@tanstack/react-table";
import {features} from "@/components/pos-devices/table-features";
export type Devices = {
    ValkirePosUnitID: string
    Vehicle: string
    PosCurrentIPV4: string
    FiscBusinessPremiseID: string
    FiscElectronicDeviceID: string
    PosConnectStartLast: string
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
        header: 'Last connection'
    })
]