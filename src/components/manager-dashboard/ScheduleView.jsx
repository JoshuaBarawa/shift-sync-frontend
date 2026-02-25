import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { shiftsService } from '../../services/shiftsService';
import { locationsService } from '../../services/locationsService';
import {
  getWeekDays,
  getWeekRange,
  getNextWeek,
  getPreviousWeek,
  formatDateForAPI,
  getShortMonthDay,
} from '../../utils/dates';
import { ShiftCard } from './ShiftCard';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { CreateShiftModal } from './modals/CreateShiftModal';
import { ShiftDetailModal } from './modals/ShiftDetailModal';

export const ScheduleView = () => {
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    // Start on Monday of the current week
    const today = new Date();
    const day = today.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    const monday = new Date(today);
    monday.setDate(today.getDate() + diff);
    monday.setHours(0, 0, 0, 0);
    return monday;
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedShift, setSelectedShift] = useState(null);
  const [selectedLocationId, setSelectedLocationId] = useState('all');

  const { start, end } = getWeekRange(currentWeekStart);

  // Load real locations for the filter dropdown
  const { data: locations = [] } = useQuery({
    queryKey: ['locations'],
    queryFn: () => locationsService.getAll(),
  });

  // Fetch shifts — pass locationId only when a specific one is selected
  const { data: shifts = [], isLoading, error, refetch } = useQuery({
    queryKey: ['shifts', selectedLocationId],
    queryFn: () =>
      shiftsService.getAll(
        selectedLocationId === 'all' ? undefined : Number(selectedLocationId)
      ),
  });

  const weekDays = getWeekDays(currentWeekStart);

  // Group shifts by date string e.g. "2026-03-02"
  const shiftsByDay = {};
  weekDays.forEach((day) => {
    const dayStr = formatDateForAPI(day);
    shiftsByDay[dayStr] = shifts.filter((s) => {
      // shift.date may come as "2026-03-02" or "2026-03-02T00:00:00.000Z"
      const shiftDate = s.date?.split('T')[0];
      return shiftDate === dayStr;
    });
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Schedule</h1>
            <p className="text-gray-500 text-sm mt-1">
              {getShortMonthDay(start)} – {getShortMonthDay(end)}
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition text-sm font-medium"
          >
            <Plus size={18} />
            New Shift
          </button>
        </div>

        {/* Week nav + location filter */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentWeekStart(getPreviousWeek(currentWeekStart))}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-sm font-medium text-gray-700 px-2 min-w-[160px] text-center">
              {getShortMonthDay(start)} – {getShortMonthDay(end)}
            </span>
            <button
              onClick={() => setCurrentWeekStart(getNextWeek(currentWeekStart))}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Location filter — real data from API */}
          <select
            value={selectedLocationId}
            onChange={(e) => setSelectedLocationId(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="all">All Locations</option>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading && <LoadingSpinner message="Loading shifts..." />}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between">
          <span>Failed to load shifts.</span>
          <button onClick={() => refetch()} className="text-sm underline">
            Retry
          </button>
        </div>
      )}

      {!isLoading && !error && (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {weekDays.map((day, idx) => {
            const dayStr = formatDateForAPI(day);
            const dayShifts = shiftsByDay[dayStr] ?? [];
            const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            const isToday =
              new Date().toDateString() === day.toDateString();

            return (
              <div key={dayStr} className="flex flex-col min-h-[120px]">
                {/* Day header */}
                <div
                  className={`text-center px-2 py-2 rounded-lg mb-2 ${
                    isToday
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  <p className="text-xs font-semibold">{dayNames[idx]}</p>
                  <p className="text-sm font-bold">{day.getDate()}</p>
                </div>

                {/* Shifts for this day */}
                <div className="space-y-2 flex-1">
                  {dayShifts.length === 0 ? (
                    <div className="text-center py-6 text-gray-300 text-xs">
                      —
                    </div>
                  ) : (
                    dayShifts.map((shift) => (
                      <ShiftCard
                        key={shift.id}
                        shift={shift}
                        onClick={() => setSelectedShift(shift)}
                      />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <CreateShiftModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />

      {selectedShift && (
        <ShiftDetailModal
          isOpen={!!selectedShift}
          shift={selectedShift}
          onClose={() => setSelectedShift(null)}
        />
      )}
    </div>
  );
};