import {
    columnFilteringFeature, createFilteredRowModel, createPaginatedRowModel, createSortedRowModel,
    filterFn_includesString,
    globalFilteringFeature,
    rowSelectionFeature,
    rowPaginationFeature,
    rowSortingFeature, sortFn_alphanumeric, sortFn_text,
    tableFeatures
} from "@tanstack/react-table";
import * as React from "react";

export const features = tableFeatures({
    rowSortingFeature,
    rowPaginationFeature,
    columnFilteringFeature,
    globalFilteringFeature,
    rowSelectionFeature,
    sortedRowModel: createSortedRowModel(),
    paginatedRowModel: createPaginatedRowModel(),
    filteredRowModel: createFilteredRowModel(),
    sortFns: {
        alphanumeric: sortFn_alphanumeric,
        text: sortFn_text,
    },
    filterFns: {
        includesString: filterFn_includesString,
    },
})


export function TableCheckbox({
                           indeterminate,
                           className = "",
                           ...rest
                       }: { indeterminate?: boolean } & React.InputHTMLAttributes<HTMLInputElement>) {
    const ref = React.useRef<HTMLInputElement>(null!);

    React.useEffect(() => {
        if (typeof indeterminate === "boolean") {
            ref.current.indeterminate = !rest.checked && indeterminate;
        }
    }, [indeterminate, rest.checked]);

    return (
        <input
            type="checkbox"
            ref={ref}
            className={`size-4 rounded border-input text-primary accent-primary cursor-pointer transition-all ${className}`}
            {...rest}
        />
    );
}

interface ExportableTable<TData> {
    getSelectedRowModel: () => { rows: Array<{ original: TData }> };
    getPrePaginatedRowModel: () => { rows: Array<{ original: TData }> };
}

export function exportToCsv<TData extends Record<string, unknown>>(
    table: ExportableTable<TData>,
    filename = "export.csv"
) {
    // 1. Get selected rows; if none selected, export all rows
    const selectedRows = table.getSelectedRowModel().rows;
    const rowsToExport = selectedRows.length > 0
        ? selectedRows
        : table.getPrePaginatedRowModel().rows;

    if (rowsToExport.length === 0) {
        alert("Ni podatkov za izvoz.");
        return;
    }

    // 2. Extract column headers from the first object
    const dataObjects = rowsToExport.map((row) => row.original);
    const headers = Object.keys(dataObjects[0]);

    // 3. Format rows into CSV (escaping quotes, commas, and newlines)
    const csvContent = [
        headers.join(";"), // Use semicolon (;) for European Excel compatibility
        ...dataObjects.map((row) =>
            headers
                .map((header) => {
                    const value = row[header] ?? "";
                    const stringValue = String(value).replace(/"/g, '""');
                    return `"${stringValue}"`;
                })
                .join(";")
        ),
    ].join("\r\n");

    // 4. Create Blob with UTF-8 BOM (\uFEFF) so Excel handles special characters
    const blob = new Blob(["\uFEFF" + csvContent], {
        type: "text/csv;charset=utf-8;",
    });

    // 5. Trigger download in the browser
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
