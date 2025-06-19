import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { formatDate, calculateHours } from '@/lib/time-utils';

export async function POST(request: NextRequest) {
  try {
    const { punchCode, action } = await request.json();

    if (!punchCode || !action) {
      return NextResponse.json(
        { error: 'Punch code and action are required' },
        { status: 400 }
      );
    }

    const employee = await prisma.employee.findUnique({
      where: { punchCode },
      include: { admin: true }
    });

    if (!employee) {
      return NextResponse.json(
        { error: 'Invalid punch code' },
        { status: 404 }
      );
    }

    const today = new Date();
    const dateStr = formatDate(today);

    let timeEntry = await prisma.timeEntry.findUnique({
      where: {
        employeeId_date: {
          employeeId: employee.id,
          date: new Date(dateStr)
        }
      }
    });

    const now = new Date();

    switch (action) {
      case 'punch-in':
        if (!timeEntry) {
          timeEntry = await prisma.timeEntry.create({
            data: {
              employeeId: employee.id,
              adminId: employee.adminId,
              date: new Date(dateStr),
              punchIn: now
            }
          });
        } else if (!timeEntry.punchIn) {
          timeEntry = await prisma.timeEntry.update({
            where: { id: timeEntry.id },
            data: { punchIn: now }
          });
        } else {
          return NextResponse.json(
            { error: 'Already punched in' },
            { status: 400 }
          );
        }
        break;

      case 'punch-out':
        if (!timeEntry || !timeEntry.punchIn) {
          return NextResponse.json(
            { error: 'Must punch in first' },
            { status: 400 }
          );
        }
        if (timeEntry.punchOut) {
          return NextResponse.json(
            { error: 'Already punched out' },
            { status: 400 }
          );
        }

        const totalHours = calculateHours(
          timeEntry.punchIn,
          now,
          timeEntry.breakStart,
          timeEntry.breakEnd
        );

        timeEntry = await prisma.timeEntry.update({
          where: { id: timeEntry.id },
          data: {
            punchOut: now,
            totalHours
          }
        });
        break;

      case 'break-start':
        if (!timeEntry || !timeEntry.punchIn || timeEntry.punchOut) {
          return NextResponse.json(
            { error: 'Must be punched in to start break' },
            { status: 400 }
          );
        }
        if (timeEntry.breakStart && !timeEntry.breakEnd) {
          return NextResponse.json(
            { error: 'Already on break' },
            { status: 400 }
          );
        }

        timeEntry = await prisma.timeEntry.update({
          where: { id: timeEntry.id },
          data: { breakStart: now }
        });
        break;

      case 'break-end':
        if (!timeEntry || !timeEntry.breakStart || timeEntry.breakEnd) {
          return NextResponse.json(
            { error: 'Must start break first' },
            { status: 400 }
          );
        }

        timeEntry = await prisma.timeEntry.update({
          where: { id: timeEntry.id },
          data: { breakEnd: now }
        });
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      message: `${action.replace('-', ' ')} successful`,
      employee: { name: employee.name },
      timeEntry
    });

  } catch (error) {
    console.error('Punch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}