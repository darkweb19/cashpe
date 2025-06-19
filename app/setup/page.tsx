"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
	Database,
	Users,
	Calendar,
	ArrowLeft,
	CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function SetupPage() {
	const [loading, setLoading] = useState(false);
	const [setupComplete, setSetupComplete] = useState(false);
	const [demoData, setDemoData] = useState<any>(null);

	const handleSetup = async () => {
		setLoading(true);
		try {
			const response = await fetch("/api/setup", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
			});

			const data = await response.json();

			if (response.ok) {
				toast.success("Demo data created successfully!");
				setSetupComplete(true);
				setDemoData(data);
			} else {
				toast.error(data.error || "Setup failed");
			}
		} catch (error) {
			toast.error("Network error. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-background flex items-center justify-center p-4">
			<div className="w-full max-w-2xl space-y-6">
				{/* Back Button */}
				<Link href="/">
					<Button variant="ghost" className="mb-4">
						<ArrowLeft className="h-4 w-4 mr-2" />
						Back to Dashboard
					</Button>
				</Link>

				<Card>
					<CardHeader className="text-center">
						<CardTitle className="flex items-center justify-center gap-2">
							<Database className="h-5 w-5" />
							System Setup
						</CardTitle>
						<p className="text-sm text-muted-foreground">
							Initialize your TimeTracker system with demo data
						</p>
					</CardHeader>
					<CardContent className="space-y-6">
						{!setupComplete ? (
							<>
								<div className="text-center space-y-4">
									<p className="text-muted-foreground">
										Click the button below to create demo
										admin account and sample employees with
										schedules.
									</p>

									<div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
										<div className="text-center p-4 border rounded-lg">
											<Users className="h-8 w-8 mx-auto mb-2 text-blue-500" />
											<h3 className="font-medium">
												Admin Account
											</h3>
											<p className="text-sm text-muted-foreground">
												Demo admin login
											</p>
										</div>
										<div className="text-center p-4 border rounded-lg">
											<Users className="h-8 w-8 mx-auto mb-2 text-green-500" />
											<h3 className="font-medium">
												Sample Employees
											</h3>
											<p className="text-sm text-muted-foreground">
												3 demo employees
											</p>
										</div>
										<div className="text-center p-4 border rounded-lg">
											<Calendar className="h-8 w-8 mx-auto mb-2 text-purple-500" />
											<h3 className="font-medium">
												Weekly Schedules
											</h3>
											<p className="text-sm text-muted-foreground">
												Mon-Fri schedules
											</p>
										</div>
									</div>

									<Button
										onClick={handleSetup}
										disabled={loading}
										size="lg"
										className="w-full"
									>
										{loading
											? "Creating Demo Data..."
											: "Create Demo Data"}
									</Button>
								</div>
							</>
						) : (
							<div className="text-center space-y-6">
								<div className="flex items-center justify-center gap-2 text-green-600">
									<CheckCircle className="h-6 w-6" />
									<h3 className="text-lg font-semibold">
										Setup Complete!
									</h3>
								</div>

								<div className="space-y-4">
									<div className="p-4 bg-muted rounded-lg">
										<h4 className="font-medium mb-2">
											Admin Login Credentials:
										</h4>
										<div className="space-y-1 font-mono text-sm">
											<p>
												<strong>Email:</strong>{" "}
												{demoData?.admin?.email}
											</p>
											<p>
												<strong>Password:</strong>{" "}
												{demoData?.admin?.password}
											</p>
										</div>
									</div>

									<Separator />

									<div className="p-4 bg-muted rounded-lg">
										<h4 className="font-medium mb-3">
											Demo Employee Punch Codes:
										</h4>
										<div className="grid gap-2">
											{demoData?.employees?.map(
												(
													employee: any,
													index: number
												) => (
													<div
														key={index}
														className="flex justify-between items-center"
													>
														<span className="text-sm">
															{employee.name}
														</span>
														<Badge
															variant="outline"
															className="font-mono"
														>
															{employee.punchCode}
														</Badge>
													</div>
												)
											)}
										</div>
									</div>

									<div className="flex gap-3">
										<Link href="/" className="flex-1">
											<Button
												variant="outline"
												className="w-full"
											>
												Go to Dashboard
											</Button>
										</Link>
										<Link href="/admin" className="flex-1">
											<Button className="w-full">
												Admin Login
											</Button>
										</Link>
									</div>
								</div>
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
