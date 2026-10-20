import {createColumnHelper} from "@tanstack/react-table";
import {features} from "@/components/pos-devices/table-features";
export type Devices = {
    ValkirePosUnitID: number
    Vehicle: string
    PosCurrentIPV4: string
    FiscBusinessPremiseID: string
    FiscElectronicDeviceID: string
}
export const columnHelper = createColumnHelper<typeof features, Devices>()

// 1. Remove columnHelper.columns() and just use a standard array
export const columns = [
    columnHelper.accessor('ValkirePosUnitID', {
        header: 'ValkirePosUnitID',
    }),

    columnHelper.accessor(row => row.Vehicle, {
        id: 'Vehicle',
        header: 'Vehicle',
    }),

    columnHelper.accessor(row => String(row.PosCurrentIPV4), {
        id: 'PosCurrentIPV4',
        header: 'PosCurrentIPV4',
    }),

    columnHelper.accessor('FiscBusinessPremiseID', {
        header: 'FiscBusinessPremiseID',
    }),

    columnHelper.accessor('FiscElectronicDeviceID', {
        header: 'FiscElectronicDeviceID',
    }),
]