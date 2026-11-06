import {createColumnHelper} from "@tanstack/react-table";
import {features} from "@/lib/table-features";
import {Oprema} from "@/features/popis-opreme/types";
import {Button} from "@/components/ui/button";
import {Trash} from "lucide-react";
import * as React from "react";


const columnHelper = createColumnHelper<typeof features, Oprema>()

export const columns = columnHelper.columns([

    columnHelper.accessor('Id', {
        header: 'Zap Št',
    }),

    columnHelper.accessor('Vrsta', {
        header: 'Vrsta Opreme',
    }),

    columnHelper.accessor('Model', {
        header: 'Znamka / Model',
    }),

    columnHelper.accessor('Serial', {
        header: 'Serijska številka',
    }),

    columnHelper.accessor('Opr', {
        header: 'OPR',
    }),

    columnHelper.accessor('Stanje', {
        header: 'Stanje',
    }),

    // 2. ACTIONS / Delete row
    columnHelper.display({
        id: "delete",
        header: () => <span className="sr-only">delete</span>,
        cell: ({ row, table }) => {
            const oprema = row.original;

            return (
                <div className="flex items-center justify-end">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-muted-foreground hover:text-foreground">
                        <Trash className="size-4" />
                        <span className="sr-only">Uredi {oprema.Id}</span>
                    </Button>
                </div>
            );
        },
        enableSorting: false,
    }),
])