import { NextResponse } from "next/server";
import { createDemoData } from "@/lib/seed";

export async function POST() {
	try {
		await createDemoData();

		return NextResponse.json({
			message: "Demo data created successfully",
			admin: {
				email: "admin@demo.com",
				password: "password123",
			},
			employees: [
				{ name: "John Smith", punchCode: "1234" },
				{ name: "Sarah Johnson", punchCode: "5678" },
				{ name: "Mike Davis", punchCode: "9012" },
			],
		});
	} catch (error) {
		console.error("Setup error:", error);
		return NextResponse.json(
			{ error: "Failed to create demo data" },
			{ status: 500 }
		);
	}
}

export async function GET() {
	return NextResponse.json({
		message: "Setup endpoint - use POST to create demo data",
	});
}
