"use client"
import * as React from 'react'
import {useTable} from '@tanstack/react-table'
import { useDebouncedCallback } from '@tanstack/react-pacer/debouncer'
import {columns} from "./pos-users-table-columns";
import {Users} from "../types"
import {exportToCsv, features} from "@/lib/table-features";
import {
    ArrowDown,
    ArrowUp,
    ArrowUpDown,
    Search, Sheet,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {TablePaginationFooter} from "@/features/tables/table-footer";




export default function UsersTable({ data }: { data: Users[] }) {

    const table = useTable(
        {
            debugTable: false,
            features,
            columns: columns,
            data,
            globalFilterFn: 'includesString',
        },
        (state) => state, // default selector
    )
    const onSearchChange = useDebouncedCallback(
        (val: string) => table.setGlobalFilter(val),
        { wait: 300 }
    );
    // 7. Render your table markup from the table instance APIs.
    return (
        <div className="p-4">
            <div className="justify-between flex">
                <div className="flex h-9 w-full max-w-sm items-center gap-2 rounded-full border border-input px-3 shadow-xs focus-within:ring-1 focus-within:ring-ring mb-4">
                    <Search className="size-4 shrink-0 text-muted-foreground" />
                    <Input
                        defaultValue={table.state.globalFilter ?? ""}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Search all columns..."
                        className="bg-transparent h-full border-0 p-0 shadow-none focus-visible:ring-0 dark:bg-input-none"
                    />
                </div>
                <Button onClick={() => exportToCsv(table, "pos-users.csv")}>
                    <Sheet className="size-4" />
                    <p>Export To Excel</p>
                </Button>
            </div>
            <div className="overflow-hidden rounded-xl border bg-card shadow-xs">
                <Table>
                    <TableHeader className="bg-muted/40">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    const sorted = header.column.getIsSorted()
                                    const Icon =
                                        sorted === 'asc'
                                            ? ArrowUp
                                            : sorted === 'desc'
                                                ? ArrowDown
                                                : ArrowUpDown

                                    return (
                                        <TableHead
                                            key={header.id}
                                            colSpan={header.colSpan}
                                            className="px-4 text-xs font-medium text-muted-foreground"
                                        >
                                            {header.isPlaceholder ? null : header.column.getCanSort() ? (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="-ml-3 h-8 text-xs font-medium text-muted-foreground hover:text-foreground data-[state=open]:bg-accent"
                                                    onClick={header.column.getToggleSortingHandler()}
                                                >
                                                    <table.FlexRender header={header} />
                                                    <Icon className="ml-1.5 size-3.5 text-muted-foreground" />
                                                </Button>
                                            ) : (
                                                <span className="text-xs font-medium">
                          <table.FlexRender header={header} />
                        </span>
                                            )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center text-muted-foreground"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        ) : (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} className="hover:bg-muted/40">
                                    {row.getAllCells().map((cell) => (
                                        <TableCell key={cell.id} className="px-4 py-2.5">
                                            <table.FlexRender cell={cell} />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
            <TablePaginationFooter table={table} />
        </div>
    )
}