import {createColumnHelper} from "@tanstack/react-table";
import {features} from "@/lib/table-features";
import {Devices} from "../types"
import {Button} from "@/components/ui/button";
import {Pencil, Activity} from "lucide-react";
import * as React from "react";
import {TableCheckbox} from "@/lib/table-features";
import {pingDevice} from "@/features/pos-devices/functions/pos-devices-functions-pingVnc";
import {useDeviceDialog} from "@/features/pos-devices/stores/use-device-dialog";


const columnHelper = createColumnHelper<typeof features, Devices>()

// 1. Remove columnHelper.columns() and just use a standard array
export const columns = columnHelper.columns([
    // 1. SELECT / CHECKBOX STOLPEC
    columnHelper.display({
        id: "select",
        header: ({ table }) => (
            <div className="flex items-center justify-center px-1">
                <TableCheckbox
                    checked={table.getIsAllPageRowsSelected()}
                    indeterminate={table.getIsSomePageRowsSelected()}
                    onChange={table.getToggleAllPageRowsSelectedHandler()}
                    aria-label="Izberi vse vrstice"
                />
            </div>
        ),

        cell: ({ row }) => (
            <div className="flex items-center justify-center px-1">
                <TableCheckbox
                    checked={row.getIsSelected()}
                    disabled={!row.getCanSelect()}
                    indeterminate={row.getIsSomeSelected()}
                    onChange={row.getToggleSelectedHandler()}
                    aria-label="Izberi vrstico"
                />
            </div>
        ),
        enableSorting: false,
    }),
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
    // PING button
    columnHelper.display({
        id: "ping",
        header: () =><span className="sr-only">Ping</span>,
        cell: ({ row }) => {
            const device = row.original;

            return (
                <div className="flex items-center justify-end">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-muted-foreground hover:text-foreground"
                       onClick={() => {pingDevice(device.PosCurrentIPV4 as string)}}>
                        <Activity className="size-4" />
                        <span className="sr-only">Ping {device.PosCurrentIPV4}</span>
                    </Button>
                </div>
            );
        },
        enableSorting: false,
    }),

    // 2. ACTIONS / EDIT (PEN) STOLPEC
    columnHelper.display({
        id: "actions",
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row, table }) => {
            const device = row.original;

            return (
                <div className="flex items-center justify-end">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-muted-foreground hover:text-foreground"
                        onClick={() => useDeviceDialog.getState().openEdit(device)}>
                        <Pencil className="size-4" />
                        <span className="sr-only">Uredi {device.ValkirePosUnitID}</span>
                    </Button>
                </div>
            );
        },
        enableSorting: false,
    }),
])