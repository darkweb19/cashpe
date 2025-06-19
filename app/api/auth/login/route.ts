import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { encrypt } from "@/lib/auth";

export async function POST(request: NextRequest) {
	try {
		const { email, password } = await request.json();

		if (!email || !password) {
			return NextResponse.json(
				{ error: "Email and password are required" },
				{ status: 400 }
			);
		}
		const admin = await prisma.admin.findUnique({
			where: { email },
		});

		if (!admin) {
			return NextResponse.json(
				{ error: "Invalid credentials" },
				{ status: 401 }
			);
		}

		const isValidPassword = await bcrypt.compare(password, admin.password);

		if (!isValidPassword) {
			return NextResponse.json(
				{ error: "Invalid credentials" },
				{ status: 401 }
			);
		}

		const session = await encrypt({
			adminId: admin.id,
			email: admin.email,
			name: admin.name,
		});

		const response = NextResponse.json(
			{
				message: "Login successful",
				admin: { id: admin.id, email: admin.email, name: admin.name },
			},
			{ status: 200 }
		);

		response.cookies.set("session", session, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			maxAge: 60 * 60 * 24, // 24 hours
		});

		return response;
	} catch (error) {
		console.error("Login error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
