"use client";
import Link from "next/link";
import React, { useState } from "react";

export default function ForgotPasswordForm() {
	const [email, setEmail] = useState("");
	const [isSubmitted, setIsSubmitted] = useState(false);

	const handleSubmit = async () => {
		console.log("Forgot password requested for:", email);

		// TODO: Implement actual forgot password API call
		// const response = await fetch(
		// 	`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/forgot-password`,
		// 	{
		// 		method: "POST",
		// 		headers: { "Content-Type": "application/json" },
		// 		body: JSON.stringify({ email }),
		// 	}
		// );

		// For now, just show success message
		setIsSubmitted(true);
	};

	if (isSubmitted) {
		return (
			<div className="flex flex-col items-center justify-center w-full min-h-screen px-6 py-8">
				{/* Terminal Logo */}
				<div className="flex items-center justify-center w-full h-1/3 min-h-[200px] mb-8">
					<h1 className="text-5xl sm:text-6xl md:text-7xl font-mono tracking-wide">
						<span className="text-gray-900 dark:text-white">$ the-</span>
						<span className="text-brand-500">404</span>
						<span className="text-gray-900 dark:text-white">&gt; _</span>
					</h1>
				</div>

				{/* Success Message */}
				<div className="w-full max-w-2xl">
					<div className="text-center space-y-6">
						<h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
							Check your email
						</h2>
						<p className="text-lg text-gray-700 dark:text-gray-400">
							If an account exists for {email}, you will receive password reset instructions.
						</p>
						<div className="mt-8">
							<Link
								href="/login"
								className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-400 transition-colors"
							>
								Back to login
							</Link>
						</div>
					</div>
				</div>
			</div>
		);
	}

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

			{/* Forgot Password Form */}
			<div className="w-full max-w-2xl">
				<form className="space-y-8">
					{/* Email Input */}
					<div>
						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="Email"
							className="w-full px-6 py-5 text-3xl bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 dark:focus:ring-brand-400 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all"
						/>
					</div>

					{/* Submit Button */}
					<div>
						<button
							type="button"
							onClick={handleSubmit}
							className="w-full px-6 py-5 text-3xl font-semibold text-white bg-brand-500 hover:bg-brand-600 dark:bg-brand-400 dark:hover:bg-brand-500 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-brand-500 dark:focus:ring-brand-400"
						>
							Reset password
						</button>
					</div>

					{/* Back to Login Link */}
					<div className="mt-6 flex justify-end">
						<Link
							href="/login"
							className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-400 transition-colors"
						>
							back to login
						</Link>
					</div>
				</form>
			</div>
		</div>
	);
}
