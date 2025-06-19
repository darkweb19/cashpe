'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Clock, Users, UserCheck } from 'lucide-react';
import { formatTime, getDayName } from '@/lib/time-utils';

interface Employee {
  id: string;
  name: string;
  email: string;
}

interface Schedule {
  id: string;
  startTime: string;
  endTime: string;
  employee: Employee;
}

interface TimeEntry {
  id: string;
  punchIn: string;
  employee: Employee;
}

interface ScheduleDisplayProps {
  date: string;
  dayOfWeek: number;
  schedules: Schedule[];
  activePunches: TimeEntry[];
}

export function ScheduleDisplay({ date, dayOfWeek, schedules, activePunches }: ScheduleDisplayProps) {
  const dayName = getDayName(dayOfWeek);
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold">{dayName}</h1>
        <p className="text-muted-foreground">{formattedDate}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Today's Schedule
              <Badge variant="secondary">{schedules.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {schedules.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No one is scheduled to work today
              </p>
            ) : (
              <div className="space-y-3">
                {schedules.map((schedule) => (
                  <div
                    key={schedule.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {schedule.employee.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{schedule.employee.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {schedule.employee.email}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline">
                      {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Currently Punched In */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              Currently Working
              <Badge variant="secondary">{activePunches.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activePunches.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No one is currently punched in
              </p>
            ) : (
              <div className="space-y-3">
                {activePunches.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between p-3 border rounded-lg bg-green-50 border-green-200"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {entry.employee.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{entry.employee.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {entry.employee.email}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-green-600">Active</Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        Since {new Date(entry.punchIn).toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}