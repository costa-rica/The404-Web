"use client";
import React, { useState } from "react";
import { Metadata } from "next";
import TableMachines from "@/components/tables/TableMachines";
import { mockMachinesData } from "@/data/mockMachines";
import { Modal } from "@/components/ui/modal";
import { ModalAddMachine } from "@/components/ui/modal/ModalAddMachine";

// Note: Metadata export doesn't work in client components
// Will need to move to a server component or use next/head if needed

export default function MachinesPage() {
	const [isModalOpen, setIsModalOpen] = useState(false);

	const handleAddMachine = async (machineData: {
		urlFor404Api: string;
		userHomeDir: string;
		nginxStoragePathOptions: string[];
	}) => {
		// TODO: Replace with actual API call
		console.log("Adding machine:", machineData);

		// const response = await fetch(
		// 	`${process.env.NEXT_PUBLIC_API_BASE_URL}/machines`,
		// 	{
		// 		method: "POST",
		// 		headers: {
		// 			"Content-Type": "application/json",
		// 			Authorization: `Bearer ${token}`,
		// 		},
		// 		body: JSON.stringify(machineData),
		// 	}
		// );

		// For now, just close the modal
		setIsModalOpen(false);
		alert("Machine added successfully! (Mock)");
	};

	return (
		<div className="space-y-6">
			{/* Page Header */}
			<div className="flex items-start justify-between">
				<div>
					<h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
						Machines
					</h1>
					<p className="mt-2 text-gray-600 dark:text-gray-400">
						Manage and connect to your Ubuntu servers
					</p>
				</div>
				<button
					onClick={() => setIsModalOpen(true)}
					className="px-4 py-2 bg-brand-500 hover:bg-brand-600 dark:bg-brand-400 dark:hover:bg-brand-500 text-white rounded-lg font-medium transition-colors"
				>
					Add machine
				</button>
			</div>

			{/* Machines Table */}
			<TableMachines data={mockMachinesData.existingMachines} />

			{/* Add Machine Modal */}
			<Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
				<ModalAddMachine
					onClose={() => setIsModalOpen(false)}
					onSubmit={handleAddMachine}
				/>
			</Modal>
		</div>
	);
}
