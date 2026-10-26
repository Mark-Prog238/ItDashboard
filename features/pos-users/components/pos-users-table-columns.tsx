import {createColumnHelper} from "@tanstack/react-table";
import {Users} from "../types"
import {features} from "@/lib/table-features";
export const columnHelper = createColumnHelper<typeof features, Users>()

// 1. Remove columnHelper.columns() and just use a standard array
export const columns: any[] = [
    columnHelper.accessor('ValkirePosUserID', {
        header: 'USER ID',
    }),

    columnHelper.accessor('FirstName', {
        header: 'First Name',
    }),

    columnHelper.accessor('LastName', {
        header: 'Last Name',
    }),

    columnHelper.accessor('Username', {
        header: 'Username',
    }),

    columnHelper.accessor('VAT', {
        header: 'VAT',
    }),
]