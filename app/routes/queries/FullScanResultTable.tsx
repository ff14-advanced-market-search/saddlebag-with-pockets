import type {SortingState} from "@tanstack/table-core";
import {FC, useState} from "react";
import {flexRender, useReactTable} from "@tanstack/react-table";
import {createColumnHelper, getCoreRowModel} from "@tanstack/table-core";
import {ResponseType} from "~/requests/FullScan";

type ResultTableProps<T> = {
    rows: Record<string, T>
}


const FullScanResultTable = <T extends unknown>({rows}: ResultTableProps<T>) => {
    console.log("FullScanResultTable", rows);
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
        header: 'Profit Amount', cell: info => info.getValue()
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
        data: rows as any, columns, getCoreRowModel: getCoreRowModel(),
    })

    return <div className={`mt-0 flex flex-col`}>
        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full align-middle md:px-6 lg:px-8">
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-gray-50">
                        {table.getHeaderGroups().map(headerGroup => (<tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => (<th scope={`col`}
                                                                    className={`whitespace-nowrap py-3.5 px-2 text-left text-sm font-semibold text-gray-900`}
                                                                    key={header.id}>
                                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
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
