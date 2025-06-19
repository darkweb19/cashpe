import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { formatDate } from '@/lib/time-utils';

export async function GET(request: NextRequest) {
  try {
    const today = new Date();
    const todayStr = formatDate(today);
    const dayOfWeek = today.getDay();

    // Get today's schedules
    const todaySchedules = await prisma.schedule.findMany({
      where: {
        dayOfWeek,
        isActive: true
      },
      include: {
        employee: true
      },
      orderBy: {
        startTime: 'asc'
      }
    });

    // Get today's time entries (who's punched in)
    const todayTimeEntries = await prisma.timeEntry.findMany({
      where: {
        date: new Date(todayStr),
        punchIn: { not: null },
        punchOut: null
      },
      include: {
        employee: true
      }
    });

    return NextResponse.json({
      date: todayStr,
      dayOfWeek,
      schedules: todaySchedules,
      activePunches: todayTimeEntries
    });

  } catch (error) {
    console.error('Dashboard error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}