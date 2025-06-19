import { format, startOfWeek, endOfWeek, addDays, parseISO, differenceInMinutes } from 'date-fns';

export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${displayHour}:${minutes} ${ampm}`;
}

export function getCurrentWeekDates() {
  const today = new Date();
  const start = startOfWeek(today, { weekStartsOn: 0 }); // Sunday
  const end = endOfWeek(today, { weekStartsOn: 0 }); // Saturday
  
  return {
    start,
    end,
    days: Array.from({ length: 7 }, (_, i) => addDays(start, i))
  };
}

export function getDayName(dayOfWeek: number): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[dayOfWeek];
}

export function calculateHours(punchIn: Date | null, punchOut: Date | null, breakStart: Date | null, breakEnd: Date | null): number {
  if (!punchIn || !punchOut) return 0;
  
  let totalMinutes = differenceInMinutes(punchOut, punchIn);
  
  if (breakStart && breakEnd) {
    const breakMinutes = differenceInMinutes(breakEnd, breakStart);
    totalMinutes -= breakMinutes;
  }
  
  return Math.max(0, totalMinutes / 60);
}

export function formatDate(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function formatDateTime(date: Date): string {
  return format(date, 'MMM dd, yyyy h:mm a');
}