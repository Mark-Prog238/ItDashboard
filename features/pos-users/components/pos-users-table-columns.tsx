import {createColumnHelper} from "@tanstack/react-table";
import {Users} from "../types"
import {features} from "@/lib/table-features";
export const columnHelper = createColumnHelper<typeof features, Users>()
import { Button } from "@/components/ui/button";
import * as React from "react";
import { Pencil } from "lucide-react";
import {TableCheckbox} from "@/lib/table-features";

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
        // TODO kle mamo pa select in bo opcija export torej pokluku bos kere rabs pol mas pa export to excel in ti zlouda excel ali pa csv file
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
    // 2. ACTIONS / EDIT (PEN) STOLPEC
    columnHelper.display({
        id: "actions",
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => {
            const user = row.original;

            return (
                <div className="flex items-center justify-end">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-muted-foreground hover:text-foreground"
                        onClick={() => {
                            console.log("Urejanje uporabnika:", user);
                            // TODO naredi sql query ki cala po user.ValkirePosUserID in odpre formo potem jo pa fila z podatki ko editas ce das submit da uppert v db (update if changed)

                        }}
                    >
                        <Pencil className="size-4" />
                        <span className="sr-only">Uredi {user.ValkirePosUserID}</span>
                    </Button>
                </div>
            );
        },
        enableSorting: false,
    }),
])