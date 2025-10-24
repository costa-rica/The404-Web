"use client";
import React, { useMemo, useState } from "react";
import {
	useReactTable,
	getCoreRowModel,
	flexRender,
	ColumnDef,
	getSortedRowModel,
	getFilteredRowModel,
	SortingState,
	FilterFn,
} from "@tanstack/react-table";
import { Pm2App } from "@/types/pm2App";

interface TablePm2ManagedAppsProps {
	data: Pm2App[];
	handleToggleStatus: (appName: string, currentStatus: string) => void;
	handleViewLogs: (appName: string) => void;
}

// Custom filter function for searching apps (name, port, status)
const appFilterFn: FilterFn<Pm2App> = (row, columnId, filterValue) => {
	const searchValue = filterValue.toLowerCase();
	const app = row.original;

	return (
		app.name?.toLowerCase().includes(searchValue) ||
		app.status?.toLowerCase().includes(searchValue) ||
		(app.port !== null && app.port.toString().includes(searchValue)) ||
		false
	);
};

// Helper functions for formatting
const formatMemory = (bytes: number): string => {
	const mb = bytes / (1024 * 1024);
	return `${mb.toFixed(1)} MB`;
};

const formatUptime = (ms: number): string => {
	const seconds = Math.floor(ms / 1000);
	const minutes = Math.floor(seconds / 60);
	const hours = Math.floor(minutes / 60);
	const days = Math.floor(hours / 24);

	if (days > 0) return `${days}d ${hours % 24}h`;
	if (hours > 0) return `${hours}h ${minutes % 60}m`;
	if (minutes > 0) return `${minutes}m`;
	return `${seconds}s`;
};

export default function TablePm2ManagedApps({
	data,
	handleToggleStatus,
	handleViewLogs,
}: TablePm2ManagedAppsProps) {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState("");

	const columns = useMemo<ColumnDef<Pm2App>[]>(
		() => [
			{
				accessorKey: "name",
				header: "App",
				enableSorting: true,
				enableColumnFilter: false,
				cell: (info) => {
					const appName = info.getValue() as string;
					return (
						<div>
							<button
								onClick={() => handleViewLogs(appName)}
								className="font-medium text-brand-500 hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-500 hover:underline transition-colors text-left"
							>
								{appName}
							</button>
							<div className="text-sm text-gray-500 dark:text-gray-400">
								CPU: {info.row.original.cpu}% | Memory:{" "}
								{formatMemory(info.row.original.memory)}
							</div>
							<div className="text-sm text-gray-500 dark:text-gray-400">
								Uptime: {formatUptime(info.row.original.uptime)} | Restarts:{" "}
								{info.row.original.restarts}
							</div>
						</div>
					);
				},
			},
			{
				accessorKey: "port",
				header: "Port",
				enableSorting: true,
				enableColumnFilter: false,
				cell: (info) => {
					const port = info.getValue() as number | null;
					return (
						<div className="text-gray-900 dark:text-white">
							{port !== null ? port : "N/A"}
						</div>
					);
				},
			},
			{
				accessorKey: "status",
				header: "Status",
				enableSorting: true,
				enableColumnFilter: false,
				cell: (info) => {
					const status = info.getValue() as string;
					const appName = info.row.original.name;
					const isOnline = status === "online";

					return (
						<button
							onClick={() => handleToggleStatus(appName, status)}
							className={`px-4 py-2 rounded-lg font-medium transition-colors ${
								isOnline
									? "bg-success-500 hover:bg-success-600 text-white"
									: "bg-gray-500 hover:bg-gray-600 text-white"
							}`}
						>
							{isOnline ? "Online" : status.charAt(0).toUpperCase() + status.slice(1)}
						</button>
					);
				},
			},
		],
		[handleToggleStatus, handleViewLogs]
	);

	const table = useReactTable({
		data,
		columns,
		state: {
			sorting,
			globalFilter,
		},
		onSortingChange: setSorting,
		onGlobalFilterChange: setGlobalFilter,
		globalFilterFn: appFilterFn,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
	});

	if (data.length === 0) {
		return (
			<div className="text-center py-12">
				<p className="text-gray-500 dark:text-gray-400">
					No PM2 managed apps available
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{/* Search Input */}
			<div className="flex items-center gap-4">
				<input
					type="text"
					value={globalFilter ?? ""}
					onChange={(e) => setGlobalFilter(e.target.value)}
					placeholder="Search apps..."
					className="flex-1 px-4 py-2 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 dark:focus:ring-brand-400 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all"
				/>
			</div>

			{/* Table */}
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
										{header.isPlaceholder ? null : (
											<div
												className={`flex items-center gap-2 ${
													header.column.getCanSort()
														? "cursor-pointer select-none"
														: ""
												}`}
												onClick={header.column.getToggleSortingHandler()}
											>
												{flexRender(
													header.column.columnDef.header,
													header.getContext()
												)}
												{header.column.getCanSort() && (
													<span className="text-gray-400 dark:text-gray-500">
														{{
															asc: "↑",
															desc: "↓",
														}[header.column.getIsSorted() as string] ?? "↕"}
													</span>
												)}
											</div>
										)}
									</th>
								))}
							</tr>
						))}
					</thead>
					<tbody className="bg-white dark:bg-gray-950 divide-y divide-gray-200 dark:divide-gray-800">
						{table.getRowModel().rows.length === 0 ? (
							<tr>
								<td
									colSpan={columns.length}
									className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
								>
									No apps found
								</td>
							</tr>
						) : (
							table.getRowModel().rows.map((row) => (
								<tr
									key={row.id}
									className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
								>
									{row.getVisibleCells().map((cell) => (
										<td key={cell.id} className="px-6 py-4">
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</td>
									))}
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}
