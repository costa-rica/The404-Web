// src/app/api/auth/verify/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
	try {
		const cookieStore = await cookies();
		const token = cookieStore.get("auth-token");

		if (!token?.value) {
			return NextResponse.json(
				{ success: false, error: "No token found" },
				{ status: 401 }
			);
		}

		// Optional: Verify token with backend
		// For now, we just check if it exists
		// You could add a backend API call here to validate the token

		return NextResponse.json({ success: true, hasToken: true });
	} catch (error) {
		console.error("Verify API route error:", error);
		return NextResponse.json(
			{ success: false, error: "Internal server error" },
			{ status: 500 }
		);
	}
}
