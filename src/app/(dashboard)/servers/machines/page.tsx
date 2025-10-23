"use client";
import React from "react";
import { Metadata } from "next";
import TableMachines from "@/components/tables/TableMachines";
import { mockMachinesData } from "@/data/mockMachines";

// Note: Metadata export doesn't work in client components
// Will need to move to a server component or use next/head if needed

export default function MachinesPage() {
	return (
		<div className="space-y-6">
			{/* Page Header */}
			<div>
				<h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
					Machines
				</h1>
				<p className="mt-2 text-gray-600 dark:text-gray-400">
					Manage and connect to your Ubuntu servers
				</p>
			</div>

			{/* Machines Table */}
			<TableMachines data={mockMachinesData.existingMachines} />
		</div>
	);
}
