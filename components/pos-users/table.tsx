"use client"
import * as React from 'react'
import {useTable} from '@tanstack/react-table'
import { useDebouncedCallback } from '@tanstack/react-pacer/debouncer'
import {Users, columns} from "@/components/pos-users/table-columns";
import {features} from "@/components/pos-users/table-features";
import {
    ArrowDown,
    ArrowUp,
    ArrowUpDown,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Search,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'




export default function UsersTable({ data }: { data: Users[] }) {

    const table = useTable(
        {
            debugTable: false,
            features,
            columns: columns as any,
            data,
            globalFilterFn: 'includesString',
        },
        (state) => state, // default selector
    )
    // 7. Render your table markup from the table instance APIs.
    return (
        <div className="p-4">
            <div className="flex h-9 w-full max-w-sm items-center gap-2 rounded-full border border-input bg-transparent px-3 shadow-xs focus-within:ring-1 focus-within:ring-ring mb-4">
                <Search className="size-4 shrink-0 text-muted-foreground" />
                <DebouncedInput
                    value={table.state.globalFilter ?? ''}
                    onChange={(value) => table.setGlobalFilter(String(value))}
                    placeholder="Search all columns..."
                    className="h-full border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
                />
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
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
                                        <TableHead key={header.id} colSpan={header.colSpan}>
                                            {header.isPlaceholder ? null : header.column.getCanSort() ? (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="-ml-3 h-8 data-[state=open]:bg-accent"
                                                    onClick={header.column.getToggleSortingHandler()}
                                                >
                                                    <table.FlexRender header={header} />
                                                    <Icon className="ml-2" />
                                                </Button>
                                            ) : (
                                                <span className="text-sm font-medium">
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
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        ) : (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getAllCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            <table.FlexRender cell={cell} />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination controls */}
            <div className="flex items-center justify-between gap-4 px-2 py-4">
                <div className="text-sm text-muted-foreground">
                    {table.getPrePaginatedRowModel().rows.length.toLocaleString()} of{' '}
                    {data.length.toLocaleString()} rows
                </div>
                <div className="flex items-center gap-6 lg:gap-8">
                    <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">Rows per page</p>
                        <Select
                            value={`${table.state.pagination.pageSize}`}
                            onValueChange={(value) => table.setPageSize(Number(value))}
                        >
                            <SelectTrigger size="sm" className="w-[70px]">
                                <SelectValue
                                    placeholder={`${table.state.pagination.pageSize}`}
                                />
                            </SelectTrigger>
                            <SelectContent side="top">
                                {[ 20, 30, 40, 50].map((pageSize) => (
                                    <SelectItem key={pageSize} value={`${pageSize}`}>
                                        {pageSize}
                                    </SelectItem>
                                ))}
                                <SelectItem value="Infinity">All</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                        Page {table.state.pagination.pageIndex + 1} of{' '}
                        {Math.max(1, table.getPageCount())}
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
        </div>
    )
}
function DebouncedInput({
                            value: initialValue,
                            onChange,
                            debounce = 300,
                            className, // 1. Explicitly extract className here
                            ...props
                        }: {
    value: string | number
    onChange: (value: string | number) => void
    debounce?: number
    className?: string // 2. Add it to the types
} & Omit<React.ComponentProps<typeof Input>, 'onChange'>) {
    const [value, setValue] = React.useState(initialValue)

    React.useEffect(() => {
        setValue(initialValue)
    }, [initialValue])

    const debouncedOnChange = useDebouncedCallback(onChange, { wait: debounce })

    return (
        <Input
            {...props}
            value={value}
            className={className} // 3. Pass it explicitly to Shadcn Input
            onChange={(e) => {
                setValue(e.target.value)
                debouncedOnChange(e.target.value)
            }}
        />
    )
}