export interface Machine {
	_id: string;
	machineName: string;
	urlFor404Api: string;
	localIpAddress: string;
	userHomeDir?: string;
	nginxStoragePathOptions: string[];
	dateCreated: string;
	dateLastModified: string;
	__v: number;
}

export interface MachinesResponse {
	result: boolean;
	existingMachines: Machine[];
}
