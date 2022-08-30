import type {FilterFn, SortingFn, SortingState} from "@tanstack/table-core";
import {FC, useEffect, useState} from "react";
import {flexRender, useReactTable} from "@tanstack/react-table";
import {
    ColumnFiltersState,
    createColumnHelper,
    getCoreRowModel,
    getFacetedMinMaxValues,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getSortedRowModel,
    sortingFns
} from "@tanstack/table-core";
import {ResponseType} from "~/requests/FullScan";
import {compareItems, RankingInfo, rankItem} from "@tanstack/match-sorter-utils";
import {ArrowDownIcon, ArrowUpIcon} from "@heroicons/react/solid";

type ResultTableProps<T> = {
    rows: Record<string, T>
}

declare module '@tanstack/table-core' {
    interface FilterFns {
        fuzzy: FilterFn<unknown>
    }

    interface FilterMeta {
        itemRank: RankingInfo
    }
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
    const itemRank = rankItem(row.getValue(columnId), value)

    addMeta({itemRank})
    return itemRank.passed
}

const fuzzySort: SortingFn<any> = (rowA, rowB, columnId) => {
    let dir = 0;

    if (rowA.columnFiltersMeta[columnId]) {
        dir = compareItems(rowA.columnFiltersMeta[columnId]?.itemRank!, rowB.columnFiltersMeta[columnId]?.itemRank!)
    }
    return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir
}

const FullScanResultTable = <T extends unknown>({rows}: ResultTableProps<T>) => {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const columnHelper = createColumnHelper<ResponseType & { id: number }>()
    const columns = [columnHelper.accessor('avg_ppu', {
        header: 'Price per unit', cell: info => info.getValue()
    }), columnHelper.accessor('home_server_price', {
        header: 'Home server price', cell: info => info.getValue()
    }), columnHelper.accessor('home_update_time', {
        header: 'Last Updated At', cell: info => info.getValue()
    }), columnHelper.accessor('ppu', {
        header: 'Average Price per unit', cell: info => info.getValue()
    }), columnHelper.accessor('profit_amount', {
        id: 'profit_amount', header: 'Profit Amount', cell: info => info.getValue()
    }), columnHelper.accessor('profit_raw_percent', {
        header: 'Profit Percentage', cell: info => info.getValue()
    }), columnHelper.accessor('real_name', {
        header: 'Item Name', cell: info => info.getValue()
    }), columnHelper.accessor('sale_rates', {
        header: 'Sale Rates', cell: info => info.getValue()
    }), columnHelper.accessor('server', {
        header: 'Server', cell: info => info.getValue()
    }), columnHelper.accessor('stack_size', {
        header: 'Stack Size', cell: info => info.getValue()
    }), columnHelper.accessor('update_time', {
        header: 'Update Time', cell: info => info.getValue()
    }), columnHelper.accessor('url', {
        header: 'URL', cell: info => info.getValue()
    })]

    const table = useReactTable({
        data: rows,
        columns,
        filterFns: {
            fuzzy: fuzzyFilter
        },
        state: {
            columnFilters, globalFilter
        },
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: fuzzyFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        getFacetedMinMaxValues: getFacetedMinMaxValues(),
        debugTable: true,
        debugHeaders: true,
        debugColumns: false,
    })

    useEffect(() => {
        if (table.getState().columnFilters[0]?.id === 'profit_amount') {
            if (table.getState().sorting[0]?.id !== 'profit_amount') {
                table.setSorting([{id: 'profit_amount', desc: true}])
            }
        }
    }, [table.getState().columnFilters[0]?.id])

    return <div className={`mt-0 flex flex-col`}>
        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full align-middle md:px-6 lg:px-8">
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-gray-50">
                        {table.getHeaderGroups().map(headerGroup => (<tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => (<th scope={`col`}
                                                                    onClick={header.column.getToggleSortingHandler()}
                                                                    className={`whitespace-nowrap py-3.5 px-2 text-left text-sm font-semibold text-gray-900 hover:bg-gray-300 cursor-pointer`}
                                                                    key={header.id}>
                                <div>
                                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                </div>
                                <div className={`flex justify-center`}>
                                    {{
                                        asc: <ArrowUpIcon className={`h-4 w-4`}/>,
                                        desc: <ArrowDownIcon className={`h-4 w-4`}/>
                                    }[header.column.getIsSorted() as string] ?? null}
                                </div>
                            </th>))}
                        </tr>))}
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                        {table.getRowModel().rows.map(row => (<tr key={row.id}>
                            {row.getVisibleCells().map(cell => (
                                <td key={cell.id} className="whitespace-nowrap px-2 py-2 text-sm text-gray-900">
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>))}
                        </tr>))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
}

export default FullScanResultTable;
