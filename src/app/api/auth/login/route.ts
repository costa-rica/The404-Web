// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
	try {
		const { email, password } = await request.json();

		// Call the backend API (internal route from server)
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_INTERNAL_API_BASE_URL}/users/login`,
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password }),
			}
		);

		const contentType = response.headers.get("Content-Type");
		let resJson = null;

		if (contentType?.includes("application/json")) {
			resJson = await response.json();
		}

		if (response.ok && resJson?.token) {
			// Set HTTP-only cookie with the token (for middleware protection)
			const cookieStore = await cookies();
			cookieStore.set("auth-token", resJson.token, {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "lax",
				maxAge: 60 * 60 * 24 * 7, // 7 days
				path: "/",
			});

			// Return token AND user data (hybrid approach: cookie + Redux)
			return NextResponse.json({
				success: true,
				token: resJson.token, // Also return token for client-side API calls
				user: {
					username: resJson.user?.username || "unknown",
					email: email,
					isAdmin: resJson.user?.isAdmin || false,
				},
			});
		} else {
			// Login failed
			return NextResponse.json(
				{
					success: false,
					error: resJson?.error || `Server error: ${response.status}`,
				},
				{ status: response.status }
			);
		}
	} catch (error) {
		console.error("Login API route error:", error);
		return NextResponse.json(
			{ success: false, error: "Internal server error" },
			{ status: 500 }
		);
	}
}
