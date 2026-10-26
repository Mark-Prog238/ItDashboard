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
