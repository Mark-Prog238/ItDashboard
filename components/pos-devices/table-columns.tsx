import {createColumnHelper} from "@tanstack/react-table";
import * as React from "react";

export type Devices = {
    ValkirePosUnitID: number
    Vehicle: string
    PosCurrentIPV4: string
    FiscBusinessPremiseID: string
    FiscElectronicDeviceID: string
}

export const columnHelper = createColumnHelper<typeof features, Devices>()
// 4. Define the columns for your table.
export const columns = columnHelper.columns([
    columnHelper.accessor('ValkirePosUnitID', {
        header: 'ValkirePosUnitID',
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor((row) => row.Vehicle, {
        id: 'Vehicle',
        header: 'Vehicle',
        cell: (info) => <i>{info.getValue<string>()}</i>,
    }),
    columnHelper.accessor((row) => String(row.PosCurrentIPV4), {
        id: 'PosCurrentIPV4',
        header: 'PosCurrentIPV4',
        cell: (info) => <i>{info.getValue<string>()}</i>,
    }),
    columnHelper.accessor('FiscBusinessPremiseID', {
        header: 'FiscBusinessPremiseID',
    }),
    columnHelper.accessor('FiscElectronicDeviceID', {
        header: 'FiscElectronicDeviceID',
    }),
])