"use client";
import React, { useState, useEffect } from "react";
import TableMachines from "@/components/tables/TableMachines";
import { mockMachinesData } from "@/data/mockMachines";
import { Modal } from "@/components/ui/modal";
import { ModalAddMachine } from "@/components/ui/modal/ModalAddMachine";
import { Machine } from "@/types/machine";
import { useAppSelector } from "@/store/hooks";

export default function MachinesPage() {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [machines, setMachines] = useState<Machine[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const token = useAppSelector((state) => state.user.token);

	useEffect(() => {
		const fetchMachines = async () => {
			setLoading(true);
			setError(null);

			try {
				// Check if we're in mock data mode
				if (process.env.NEXT_PUBLIC_MODE === "mock_data") {
					// Use mock data
					setMachines(mockMachinesData.existingMachines);
					setLoading(false);
				} else {
					// Fetch from API
					const response = await fetch(
						`${process.env.NEXT_PUBLIC_API_BASE_URL}/machines`,
						{
							method: "GET",
							headers: {
								"Content-Type": "application/json",
								Authorization: `Bearer ${token}`,
							},
						}
					);

					if (!response.ok) {
						throw new Error(
							`Failed to fetch machines: ${response.status} ${response.statusText}`
						);
					}

					const data = await response.json();

					if (data.result && Array.isArray(data.existingMachines)) {
						setMachines(data.existingMachines);
					} else {
						throw new Error("Invalid response format from API");
					}

					setLoading(false);
				}
			} catch (err) {
				setError(
					err instanceof Error ? err.message : "Failed to fetch machines"
				);
				setLoading(false);
			}
		};

		fetchMachines();
	}, []);

	const handleAddMachine = async (machineData: {
		urlFor404Api: string;
		userHomeDir: string;
		nginxStoragePathOptions: string[];
	}) => {
		// TODO: Replace with actual API call
		console.log("Adding machine:", machineData);

		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_BASE_URL}/machines`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(machineData),
			}
		);

		console.log("Received response:", response.status);

		let resJson = null;
		const contentType = response.headers.get("Content-Type");

		if (contentType?.includes("application/json")) {
			resJson = await response.json();
		}

		if (response.ok) {
			// if (resJson.user.isAdminForKvManagerWebsite) {
			console.log(resJson);
			// resJson.email = email;
			try {
				// TODO: Add dispatch for adding machine
				const newMachine = {
					_id: resJson._id,
					machineName: resJson.machineName,
					urlFor404Api: machineData.urlFor404Api,
					localIpAddress: resJson.localIpAddress,
					userHomeDir: machineData.userHomeDir,
					nginxStoragePathOptions: machineData.nginxStoragePathOptions,
					dateCreated: resJson.dateCreated,
					dateLastModified: resJson.dateLastModified,
					__v: resJson.__v,
				};
				setMachines((prevMachines) => [...prevMachines, newMachine]);
			} catch (error) {
				console.error("Error adding machine:", error);
				alert("Error adding machine");
			}
		} else {
			const errorMessage =
				resJson?.error || `There was a server error: ${response.status}`;
			alert(errorMessage);
		}

		// For now, just close the modal
		setIsModalOpen(false);
		// alert("Machine added successfully! (Mock)");
	};

	const handleDeleteMachine = async (machineId: string) => {
		// TODO: Replace with actual API call
		console.log("Deleting machine:", machineId);

		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_BASE_URL}/machines/${machineId}`,
			{
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			}
		);

		console.log("Received response:", response.status);

		let resJson = null;
		const contentType = response.headers.get("Content-Type");

		if (contentType?.includes("application/json")) {
			resJson = await response.json();
		}

		if (response.ok) {
			console.log(resJson);
			try {
				// TODO: Add dispatch for deleting machine
				setMachines((prevMachines) =>
					prevMachines.filter((machine) => machine._id !== machineId)
				);
			} catch (error) {
				console.error("Error deleting machine:", error);
				alert("Error deleting machine");
			}
		} else {
			const errorMessage =
				resJson?.error || `There was a server error: ${response.status}`;
			alert(errorMessage);
		}
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

			{/* Loading State */}
			{loading && (
				<div className="text-center py-12">
					<p className="text-gray-500 dark:text-gray-400">
						Loading machines...
					</p>
				</div>
			)}

			{/* Error State */}
			{error && !loading && (
				<div className="bg-error-50 dark:bg-error-900/20 border border-error-500 rounded-lg p-4">
					<p className="text-error-700 dark:text-error-400">{error}</p>
				</div>
			)}

			{/* Machines Table */}
			{!loading && !error && (
				<TableMachines
					data={machines}
					handleDeleteMachine={handleDeleteMachine}
				/>
			)}

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
