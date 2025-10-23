"use client";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useRouter } from "next/navigation";
import { loginUser } from "@/store/features/user/userSlice";
import { useTheme } from "@/context/ThemeContext";

// export default function SignInForm() {
export default function LoginForm() {
	const [showPassword, setShowPassword] = useState(false);
	const [email, emailSetter] = useState(
		process.env.NEXT_PUBLIC_MODE === "workstation" ? "nrodrig1@gmail.com" : ""
	);
	const [password, passwordSetter] = useState(
		process.env.NEXT_PUBLIC_MODE === "workstation" ? "test" : ""
	);
	const dispatch = useAppDispatch();
	const router = useRouter();
	const { theme } = useTheme();
	// const userReducer = useSelector((state) => state.user);
	const userReducer = useAppSelector((s) => s.user);

	useEffect(() => {
		// Auto-redirect if user is already logged in
		if (userReducer.token) {
			router.push("/home");
			return;
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userReducer.token, router]);

	const handleClickLogin = async () => {
		console.log(
			"Login ---> API URL:",
			`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/login`
		);
		console.log("- handleClickLogin 👀");
		console.log("- email:", email);

		const bodyObj = { email, password };

		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/login`,
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(bodyObj),
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
			resJson.email = email;
			try {
				dispatch(loginUser(resJson));
				router.push("/home");
			} catch (error) {
				console.error("Error logging in:", error);
				alert("Error logging in");
			}
		} else {
			const errorMessage =
				resJson?.error || `There was a server error: ${response.status}`;
			alert(errorMessage);
		}
	};

	return (
		<div className="flex flex-col items-center justify-start w-full min-h-screen px-6 py-8">
			{/* Terminal Logo */}
			<div className="flex items-center justify-center w-full h-1/3 min-h-[200px] mb-8">
				<h1 className="text-5xl sm:text-6xl md:text-7xl font-mono tracking-wide">
					<span className="text-gray-900 dark:text-white">$ the-</span>
					<span className="text-brand-500">404</span>
					<span className="text-gray-900 dark:text-white">&gt; _</span>
				</h1>
			</div>

			{/* Login Form */}
			<div className="w-full max-w-2xl">
				<form className="space-y-8">
					{/* Email Input */}
					<div>
						<input
							type="email"
							value={email}
							onChange={(e) => emailSetter(e.target.value)}
							placeholder="Email"
							className="w-full px-6 py-5 text-3xl bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 dark:focus:ring-brand-400 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all"
						/>
					</div>

					{/* Password Input */}
					<div className="relative">
						<input
							type={showPassword ? "text" : "password"}
							value={password}
							onChange={(e) => passwordSetter(e.target.value)}
							placeholder="Password"
							className="w-full px-6 py-5 text-3xl bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 dark:focus:ring-brand-400 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all"
						/>
						<span
							onClick={() => setShowPassword(!showPassword)}
							className="absolute z-30 -translate-y-1/2 cursor-pointer right-6 top-1/2"
						>
							{showPassword ? (
								<EyeIcon className="w-8 h-8 fill-gray-500 dark:fill-gray-400" />
							) : (
								<EyeCloseIcon className="w-8 h-8 fill-gray-500 dark:fill-gray-400" />
							)}
						</span>
					</div>

					{/* Sign In Button */}
					<div>
						<button
							type="button"
							onClick={() => {
								console.log("Submitted email:", email);
								console.log("Submitted password:", password);
								handleClickLogin();
							}}
							className="w-full px-6 py-5 text-3xl font-semibold text-white bg-brand-500 hover:bg-brand-600 dark:bg-brand-400 dark:hover:bg-brand-500 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-brand-500 dark:focus:ring-brand-400"
						>
							Sign in
						</button>
					</div>

					{/* Forgot Password Link */}
					<div className="mt-6 flex justify-end">
						<Link
							href="/forgot-password"
							className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-400 transition-colors"
						>
							forgot password?
						</Link>
					</div>
				</form>
			</div>
		</div>
	);
}
