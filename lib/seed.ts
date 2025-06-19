import { prisma } from "./db";
import bcrypt from "bcryptjs";

export async function createDemoAdmin() {
	try {
		// Check if demo admin already exists
		const existingAdmin = await prisma.admin.findUnique({
			where: { email: "yonge@rudy.com" },
		});

		if (existingAdmin) {
			console.log("Demo admin already exists");
			return existingAdmin;
		}

		// Create demo admin
		const hashedPassword = await bcrypt.hash("password123", 12);

		const demoAdmin = await prisma.admin.create({
			data: {
				email: "yonge@rudy.com",
				password: hashedPassword,
				name: "Demo Admin",
			},
		});

		console.log("Demo admin created successfully");
		return demoAdmin;
	} catch (error) {
		console.error("Error creating demo admin:", error);
		throw error;
	}
}

export async function createDemoData() {
	try {
		// Create demo admin first
		const admin = await createDemoAdmin();

		// Check if demo employees already exist
		const existingEmployees = await prisma.employee.findMany({
			where: { adminId: admin.id },
		});

		if (existingEmployees.length > 0) {
			console.log("Demo employees already exist");
			return;
		}

		// // Create demo employees
		// const employees = await prisma.employee.createMany({
		// 	data: [
		// 		{
		// 			name: "John Smith",
		// 			email: "john@demo.com",
		// 			phone: "555-0101",
		// 			punchCode: "1234",
		// 			adminId: admin.id,
		// 		},
		// 		{
		// 			name: "Sarah Johnson",
		// 			email: "sarah@demo.com",
		// 			phone: "555-0102",
		// 			punchCode: "5678",
		// 			adminId: admin.id,
		// 		},
		// 		{
		// 			name: "Mike Davis",
		// 			email: "mike@demo.com",
		// 			phone: "555-0103",
		// 			punchCode: "9012",
		// 			adminId: admin.id,
		// 		},
		// 	],
		// });

		// Get created employees for scheduling
		const createdEmployees = await prisma.employee.findMany({
			where: { adminId: admin.id },
		});

		// Create demo schedules (Monday to Friday for all employees)
		const scheduleData = [];
		for (const employee of createdEmployees) {
			// Monday to Friday (1-5)
			for (let day = 1; day <= 5; day++) {
				scheduleData.push({
					employeeId: employee.id,
					adminId: admin.id,
					dayOfWeek: day,
					startTime: "09:00",
					endTime: "17:00",
					isActive: true,
				});
			}
		}

		await prisma.schedule.createMany({
			data: scheduleData,
		});

		console.log("Demo data created successfully");
	} catch (error) {
		console.error("Error creating demo data:", error);
		throw error;
	}
}
