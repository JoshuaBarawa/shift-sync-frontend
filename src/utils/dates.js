import { format, startOfWeek, endOfWeek, addWeeks, subWeeks, parseISO } from 'date-fns';

export const formatDate = (date, formatStr = 'MMM dd, yyyy') => {
  return format(new Date(date), formatStr);
};

export const formatTime = (time) => {
  if (!time) return '';
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours, 10);
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${period}`;
};

export const formatDateTime = (date, time) => {
  return `${formatDate(date, 'MMM dd')} at ${formatTime(time)}`;
};

export const getWeekDays = (date) => {
  const start = startOfWeek(new Date(date), { weekStartsOn: 1 });
  const days = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(start);
    day.setDate(day.getDate() + i);
    days.push(day);
  }
  return days;
};

export const getWeekRange = (date) => {
  const start = startOfWeek(new Date(date), { weekStartsOn: 1 });
  const end = endOfWeek(new Date(date), { weekStartsOn: 1 });
  return { start, end };
};

export const getNextWeek = (date) => {
  return addWeeks(new Date(date), 1);
};

export const getPreviousWeek = (date) => {
  return subWeeks(new Date(date), 1);
};

export const formatDateForAPI = (date) => {
  return format(new Date(date), 'yyyy-MM-dd');
};

export const formatTimeForAPI = (time) => {
  return time; // Assuming time is already in HH:mm format
};

export const getShortDayName = (date) => {
  return format(new Date(date), 'EEE');
};

export const getShortMonthDay = (date) => {
  return format(new Date(date), 'MMM dd');
};

export const isSameDay = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return d1.toDateString() === d2.toDateString();
};

export const isToday = (date) => {
  return isSameDay(date, new Date());
};

export const isPast = (date) => {
  return new Date(date) < new Date();
};

export const isFuture = (date) => {
  return new Date(date) > new Date();
};

export const getDayOfWeek = (date) => {
  return format(new Date(date), 'EEEE');
};

export const formatDuration = (startTime, endTime) => {
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);
  
  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;
  
  let duration = endMinutes - startMinutes;
  if (duration < 0) duration += 24 * 60; // Handle overnight shifts
  
  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;
  
  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
};
