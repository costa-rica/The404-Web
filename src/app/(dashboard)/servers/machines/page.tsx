"use client";
import React, { useState, useEffect, useCallback } from "react";
import TableMachines from "@/components/tables/TableMachines";
import { mockMachinesData } from "@/data/mockMachines";
import { Modal } from "@/components/ui/modal";
import { ModalAddMachine } from "@/components/ui/modal/ModalAddMachine";
import { ModalInformationYesOrNo } from "@/components/ui/modal/ModalInformationYesOrNo";
import { ModalInformationOk } from "@/components/ui/modal/ModalInformationOk";
import { Machine } from "@/types/machine";
import { useAppSelector } from "@/store/hooks";

export default function MachinesPage() {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const [infoModalOpen, setInfoModalOpen] = useState(false);
	const [infoModalData, setInfoModalData] = useState<{
		title: string;
		message: string;
		variant: "info" | "success" | "error" | "warning";
	}>({
		title: "",
		message: "",
		variant: "info",
	});
	const [machineToDelete, setMachineToDelete] = useState<{
		id: string;
		name: string;
	} | null>(null);
	const [machines, setMachines] = useState<Machine[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const token = useAppSelector((state) => state.user.token);

	const showInfoModal = (
		title: string,
		message: string,
		variant: "info" | "success" | "error" | "warning" = "info"
	) => {
		setInfoModalData({ title, message, variant });
		setInfoModalOpen(true);
	};

	const fetchMachines = useCallback(async () => {
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
	}, [token]);

	useEffect(() => {
		fetchMachines();
	}, [fetchMachines]);

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
			console.log("Machine added successfully:", resJson);
			setIsModalOpen(false);

			try {
				// Refetch machines to get complete server-populated data
				await fetchMachines();
				showInfoModal(
					"Machine Added",
					`Successfully added machine`,
					"success"
				);
			} catch (error) {
				console.error("Error refetching machines:", error);
				showInfoModal("Warning", "Machine added but failed to refresh list. Please refresh the page.", "warning");
			}
		} else {
			const errorMessage =
				resJson?.error || `There was a server error: ${response.status}`;
			setIsModalOpen(false);
			showInfoModal("Error", errorMessage, "error");
		}
		// alert("Machine added successfully! (Mock)");
	};

	const handleDeleteMachineClick = (machineId: string, machineName: string) => {
		setMachineToDelete({ id: machineId, name: machineName });
		setDeleteModalOpen(true);
	};

	const handleDeleteMachineConfirm = async () => {
		if (!machineToDelete) return;

		console.log("Deleting machine:", machineToDelete.id);

		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_BASE_URL}/machines/${machineToDelete.id}`,
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
				setMachines((prevMachines) =>
					prevMachines.filter((machine) => machine._id !== machineToDelete.id)
				);
				const deletedMachineName = machineToDelete.name;
				setDeleteModalOpen(false);
				setMachineToDelete(null);
				showInfoModal(
					"Machine Deleted",
					`Successfully deleted machine: ${deletedMachineName}`,
					"success"
				);
			} catch (error) {
				console.error("Error deleting machine:", error);
				setDeleteModalOpen(false);
				setMachineToDelete(null);
				showInfoModal("Error", "Error deleting machine", "error");
			}
		} else {
			const errorMessage =
				resJson?.error || `There was a server error: ${response.status}`;
			setDeleteModalOpen(false);
			setMachineToDelete(null);
			showInfoModal("Error", errorMessage, "error");
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
					handleDeleteMachine={handleDeleteMachineClick}
				/>
			)}

			{/* Add Machine Modal */}
			<Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
				<ModalAddMachine
					onClose={() => setIsModalOpen(false)}
					onSubmit={handleAddMachine}
				/>
			</Modal>

			{/* Delete Confirmation Modal */}
			<Modal
				isOpen={deleteModalOpen}
				onClose={() => {
					setDeleteModalOpen(false);
					setMachineToDelete(null);
				}}
			>
				<ModalInformationYesOrNo
					title="Delete Machine"
					message={`Are you sure you want to delete "${machineToDelete?.name}"? This action cannot be undone.`}
					onYes={handleDeleteMachineConfirm}
					onClose={() => {
						setDeleteModalOpen(false);
						setMachineToDelete(null);
					}}
					yesButtonText="Delete"
					noButtonText="Cancel"
					yesButtonStyle="danger"
				/>
			</Modal>

			{/* Information Modal */}
			<Modal
				isOpen={infoModalOpen}
				onClose={() => setInfoModalOpen(false)}
			>
				<ModalInformationOk
					title={infoModalData.title}
					message={infoModalData.message}
					variant={infoModalData.variant}
					onClose={() => setInfoModalOpen(false)}
				/>
			</Modal>
		</div>
	);
}
