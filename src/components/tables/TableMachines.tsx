"use client";
import React, { useMemo } from "react";
import {
	useReactTable,
	getCoreRowModel,
	flexRender,
	ColumnDef,
} from "@tanstack/react-table";
import { Machine } from "@/data/mockMachines";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { connectMachine } from "@/store/features/user/userSlice";

interface TableMachinesProps {
	data: Machine[];
}

export default function TableMachines({ data }: TableMachinesProps) {
	const dispatch = useAppDispatch();
	const connectedMachineName = useAppSelector((s) => s.user.machineName);

	const handleConnect = (machine: Machine) => {
		dispatch(
			connectMachine({
				machineName: machine.machineName,
				urlFor404Api: machine.urlFor404Api,
				nginxStoragePathOptions: machine.nginxStoragePathOptions,
			})
		);
	};

	const columns = useMemo<ColumnDef<Machine>[]>(
		() => [
			{
				accessorKey: "machineName",
				header: "Machine",
				cell: (info) => (
					<div>
						<div className="font-medium text-gray-900 dark:text-white">
							{info.getValue() as string}
						</div>
						<div className="text-sm text-gray-500 dark:text-gray-400">
							{info.row.original.urlFor404Api}
						</div>
						<div className="text-sm text-gray-500 dark:text-gray-400">
							{info.row.original.localIpAddress}
						</div>
					</div>
				),
			},
			{
				id: "actions",
				header: "Actions",
				cell: (info) => {
					const isConnected =
						info.row.original.machineName === connectedMachineName;
					return (
						<button
							onClick={() => handleConnect(info.row.original)}
							disabled={isConnected}
							className={`px-4 py-2 rounded-lg font-medium transition-colors ${
								isConnected
									? "bg-success-500 text-white cursor-default"
									: "bg-brand-500 hover:bg-brand-600 dark:bg-brand-400 dark:hover:bg-brand-500 text-white"
							}`}
						>
							{isConnected ? "Connected" : "Connect Machine"}
						</button>
					);
				},
			},
		],
		[connectedMachineName]
	);

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	if (data.length === 0) {
		return (
			<div className="text-center py-12">
				<p className="text-gray-500 dark:text-gray-400">
					No machines available
				</p>
			</div>
		);
	}

	return (
		<div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
			<table className="w-full">
				<thead className="bg-gray-50 dark:bg-gray-800">
					{table.getHeaderGroups().map((headerGroup) => (
						<tr key={headerGroup.id}>
							{headerGroup.headers.map((header) => (
								<th
									key={header.id}
									className="px-6 py-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300"
								>
									{flexRender(
										header.column.columnDef.header,
										header.getContext()
									)}
								</th>
							))}
						</tr>
					))}
				</thead>
				<tbody className="bg-white dark:bg-gray-950 divide-y divide-gray-200 dark:divide-gray-800">
					{table.getRowModel().rows.map((row) => (
						<tr
							key={row.id}
							className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
						>
							{row.getVisibleCells().map((cell) => (
								<td key={cell.id} className="px-6 py-4">
									{flexRender(cell.column.columnDef.cell, cell.getContext())}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
