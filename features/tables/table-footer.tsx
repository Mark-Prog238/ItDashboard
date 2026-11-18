"use client"

import type { ReactTable, RowData } from "@tanstack/react-table"
import type { features } from "@/lib/table-features"
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface TablePaginationFooterProps<TData extends RowData> {
    table: ReactTable<typeof features, TData>
}

export function TablePaginationFooter<TData extends RowData>({
                                                                 table,
                                                             }: TablePaginationFooterProps<TData>) {
    const { pageIndex, pageSize } = table.state.pagination
    const filteredCount = table.getPrePaginatedRowModel().rows.length
    const totalCount = table.options.data.length

    return (
        <div className="flex flex-wrap items-center justify-between gap-4 px-1 pt-1">
            <div className="text-sm text-muted-foreground">
                {filteredCount.toLocaleString()} of {totalCount.toLocaleString()} rows
            </div>
            <div className="flex items-center gap-6 lg:gap-8">
                <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">Rows per page</p>
                    <Select
                        value={`${pageSize}`}
                        onValueChange={(value) => table.setPageSize(Number(value))}
                    >
                        <SelectTrigger size="sm" className="w-17.5">
                            <SelectValue placeholder={`${pageSize}`} />
                        </SelectTrigger>
                        <SelectContent side="top">
                            {[10, 20, 30, 40, 50].map((size) => (
                                <SelectItem key={size} value={`${size}`}>
                                    {size}
                                </SelectItem>
                            ))}
                            <SelectItem value="Infinity">All</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex w-25 items-center justify-center text-sm font-medium">
                    Page {pageIndex + 1} of {Math.max(1, table.getPageCount())}
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        className="hidden size-8 lg:flex"
                        onClick={() => table.firstPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <span className="sr-only">Go to first page</span>
                        <ChevronsLeft />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="size-8"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <span className="sr-only">Go to previous page</span>
                        <ChevronLeft />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="size-8"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <span className="sr-only">Go to next page</span>
                        <ChevronRight />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="hidden size-8 lg:flex"
                        onClick={() => table.lastPage()}
                        disabled={!table.getCanLastPage()}
                    >
                        <span className="sr-only">Go to last page</span>
                        <ChevronsRight />
                    </Button>
                </div>
            </div>
        </div>
    )
}