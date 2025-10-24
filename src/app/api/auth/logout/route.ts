// src/app/api/auth/logout/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
	try {
		// Clear the auth token cookie
		const cookieStore = await cookies();
		cookieStore.delete("auth-token");

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Logout API route error:", error);
		return NextResponse.json(
			{ success: false, error: "Internal server error" },
			{ status: 500 }
		);
	}
}
