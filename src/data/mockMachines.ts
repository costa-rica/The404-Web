import { MachinesResponse } from "@/types/machine";

export const mockMachinesData: MachinesResponse = {
	result: true,
	existingMachines: [
		{
			_id: "6772c80b0391cbca4d643214",
			localIpAddress: "192.168.1.193",
			machineName: "Nicks-Mac-mini.local",
			__v: 0,
			dateCreated: "2024-12-30T16:19:22.843Z",
			dateLastModified: "2024-12-30T16:19:22.839Z",
			nginxStoragePathOptions: [
				"/Users/nick/Documents/_testData/DevelopmentServerNginx/conf.d",
				"/Users/nick/Documents/_testData/Machine01Nginx/sites-available",
			],
			userHomeDir:
				"/Users/nick/Documents/_testData/DevelopmentServerNginx",
			urlFor404Api: "http://localhost:3000",
		},
		{
			_id: "67fcb31d408d1b1b3a705f5a",
			localIpAddress: "192.168.100.166",
			machineName: "maestro03",
			__v: 0,
			dateCreated: "2025-04-14T07:02:53.306Z",
			dateLastModified: "2025-09-28T15:31:12.739Z",
			nginxStoragePathOptions: [
				"/home/nick",
				"/etc/nginx/conf.d",
				"/etc/nginx/sites-available",
			],
			urlFor404Api: "https://maestro03.the404api.dashanddata.com",
			userHomeDir: "/home/nick",
		},
		{
			_id: "6805ffdcaa2d0072c1a3502c",
			machineName: "nnDev",
			localIpAddress: "192.168.100.148",
			__v: 0,
			dateCreated: "2025-04-21T08:20:43.520Z",
			dateLastModified: "2025-09-28T01:07:19.540Z",
			nginxStoragePathOptions: [
				"/home/shared/",
				"/etc/nginx/conf.d",
				"/etc/nginx/sites-available",
			],
			userHomeDir: "/home/shared/",
			urlFor404Api: "https://nn-dev.the404api.dashanddata.com",
		},
		{
			_id: "68107161aa2d0072c1a3f689",
			localIpAddress: "192.168.100.149",
			machineName: "nnProd",
			__v: 0,
			dateCreated: "2025-04-29T06:27:43.893Z",
			dateLastModified: "2025-10-16T15:14:06.397Z",
			nginxStoragePathOptions: [
				"/home/shared/",
				"/etc/nginx/conf.d",
				"/etc/nginx/sites-available",
			],
			userHomeDir: "/home/shared/",
			urlFor404Api: "https://nn07.the404api.dashanddata.com",
		},
		{
			_id: "68f831b6c8a57e8067f2cf14",
			localIpAddress: "10.0.0.123",
			machineName: "Nicks-MacBook-Air-3.local",
			__v: 0,
			dateCreated: "2025-10-22T01:21:56.976Z",
			dateLastModified: "2025-10-23T21:17:36.809Z",
			nginxStoragePathOptions: [
				"/home/dashanddata_user",
				"/Users/nick/Documents/_testData/nginx-sites-confd",
				"/Users/nick/Documents/_testData/nginx-sites-available",
			],
			userHomeDir: "/home/dashanddata_user",
			urlFor404Api: "http://localhost:8000",
		},
	],
};
