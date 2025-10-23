// src/store/features/user/userSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
	token: string | null;
	username: string | null;
	email: string | null;
	isAdmin: boolean;
	// Connected machine info
	machineName: string | null;
	urlFor404Api: string | null;
	nginxStoragePathOptions: string[];
}

const initialState: UserState = {
	token: null,
	username: null,
	email: null,
	isAdmin: false,
	// Connected machine info
	machineName: null,
	urlFor404Api: null,
	nginxStoragePathOptions: [],
};

export const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		loginUser: (
			state,
			action: PayloadAction<{
				token: string;
				user: { username: string; email: string; isAdmin?: boolean };
			}>
		) => {
			state.token = action.payload.token;
			state.username = action.payload.user.username || "some_name";
			state.email = action.payload.user.email || "some_name@mail.com";
			state.isAdmin = action.payload.user.isAdmin || false;
		},

		connectMachine: (
			state,
			action: PayloadAction<{
				machineName: string;
				urlFor404Api: string;
				nginxStoragePathOptions: string[];
			}>
		) => {
			state.machineName = action.payload.machineName;
			state.urlFor404Api = action.payload.urlFor404Api;
			state.nginxStoragePathOptions = action.payload.nginxStoragePathOptions;
		},

		disconnectMachine: (state) => {
			state.machineName = null;
			state.urlFor404Api = null;
			state.nginxStoragePathOptions = [];
		},

		logoutUser: (state) => {
			state.token = null;
			state.username = null;
			state.email = null;
		},

		logoutUserFully: (state) => {
			state.token = null;
			state.username = null;
			state.email = null;
			state.isAdmin = false;
			state.machineName = null;
			state.urlFor404Api = null;
			state.nginxStoragePathOptions = [];
			console.log("-----> Finished Super Logout !!!");
		},
	},
});

export const {
	loginUser,
	logoutUser,
	logoutUserFully,
	connectMachine,
	disconnectMachine,
} = userSlice.actions;

export default userSlice.reducer;
