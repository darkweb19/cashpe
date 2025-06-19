"use client";

import { useEffect, useState } from "react";
import { ScheduleDisplay } from "@/components/schedule-display";
import { PunchKeypad } from "@/components/punch-keypad";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
	Settings,
	Calendar,
	BarChart3,
	RefreshCw,
	Database,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface DashboardData {
	date: string;
	dayOfWeek: number;
	schedules: any[];
	activePunches: any[];
}

export default function Home() {
	const [dashboardData, setDashboardData] = useState<DashboardData | null>(
		null
	);
	const [loading, setLoading] = useState(true);

	const fetchDashboardData = async () => {
		try {
			const response = await fetch("/api/dashboard");
			if (response.ok) {
				const data = await response.json();
				setDashboardData(data);
			} else {
				toast.error("Failed to load dashboard data");
			}
		} catch (error) {
			toast.error("Network error loading dashboard");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchDashboardData();
	}, []);

	const handleRefresh = () => {
		setLoading(true);
		fetchDashboardData();
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="text-center">
					<RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
					<p className="text-muted-foreground">
						Loading dashboard...
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background">
			{/* Header */}
			<header className="border-b bg-card">
				<div className="container mx-auto px-4 py-4">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-2xl font-bold">CashPe</h1>
							<p className="text-sm text-muted-foreground">
								Employee Time Management for RUDY Yonge (Only
								for CASH GUYS)
							</p>
						</div>
						<div className="flex items-center gap-2">
							<Link href="/setup">
								<Button variant="outline" size="sm">
									<Database className="h-4 w-4 mr-2" />
									Setup
								</Button>
							</Link>
							<Button
								variant="outline"
								size="sm"
								onClick={handleRefresh}
								disabled={loading}
							>
								<RefreshCw
									className={`h-4 w-4 mr-2 ${
										loading ? "animate-spin" : ""
									}`}
								/>
								Refresh
							</Button>
							<Link href="/schedules">
								<Button variant="outline" size="sm">
									<Calendar className="h-4 w-4 mr-2" />
									View Schedules
								</Button>
							</Link>
							<Link href="/reports">
								<Button variant="outline" size="sm">
									<BarChart3 className="h-4 w-4 mr-2" />
									Reports
								</Button>
							</Link>
							<Link href="/admin">
								<Button variant="outline" size="sm">
									<Settings className="h-4 w-4 mr-2" />
									Admin
								</Button>
							</Link>
						</div>
					</div>
				</div>
			</header>

			<main className="container mx-auto px-4 py-8">
				<div className="grid lg:grid-cols-3 gap-8">
					{/* Schedule Display - Takes up 2 columns */}
					<div className="lg:col-span-2">
						{dashboardData && (
							<ScheduleDisplay
								date={dashboardData.date}
								dayOfWeek={dashboardData.dayOfWeek}
								schedules={dashboardData.schedules}
								activePunches={dashboardData.activePunches}
							/>
						)}
					</div>

					{/* Punch System - Takes up 1 column */}
					<div className="space-y-6">
						<PunchKeypad onPunchSuccess={handleRefresh} />

						{/* Quick Stats */}
						<Card>
							<CardContent className="pt-6">
								<div className="text-center space-y-4">
									<div>
										<p className="text-2xl font-bold">
											{dashboardData?.schedules.length ||
												0}
										</p>
										<p className="text-sm text-muted-foreground">
											Scheduled Today
										</p>
									</div>
									<Separator />
									<div>
										<p className="text-2xl font-bold text-green-600">
											{dashboardData?.activePunches
												.length || 0}
										</p>
										<p className="text-sm text-muted-foreground">
											Currently Working
										</p>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</main>
		</div>
	);
}
