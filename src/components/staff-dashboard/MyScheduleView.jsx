import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { shiftsService } from '../../services/shiftsService';
import { swapsService } from '../../services/swapsService';
import { useAuth } from '../../hooks/useAuth';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { formatTime, formatDate, formatDuration } from '../../utils/dates';
import { Repeat2, Trash2, MapPin, Clock, CheckCircle, AlertCircle, X } from 'lucide-react';
import { toastManager } from '../common/Toast';

const STATUS_STYLES = {
  published:  'bg-green-100 text-green-700',
  draft:      'bg-gray-100 text-gray-500',
  cancelled:  'bg-red-100 text-red-600',
};

// ── Drop request modal ────────────────────────────────────────
const DropModal = ({ shift, onClose, onSubmit, isPending }) => {
  const [reason, setReason] = useState('');
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Drop Shift</h3>
          <button onClick={onClose}><X size={20} className="text-gray-400" /></button>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-600">
          <p className="font-medium text-gray-800">{shift.requiredSkill ?? shift.skill} Shift</p>
          <p>{formatDate(shift.date, 'EEEE, MMM dd')} · {formatTime(shift.startTime)} – {formatTime(shift.endTime)}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Reason (optional)</label>
          <textarea
            value={reason}
            onChange={e => setReason(e.target.value)}
            rows={3}
            placeholder="Why are you dropping this shift?"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50">
            Cancel
          </button>
          <button
            onClick={() => onSubmit(reason)}
            disabled={isPending}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 disabled:opacity-50"
          >
            {isPending ? 'Dropping...' : 'Drop Shift'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Swap request modal ────────────────────────────────────────
const SwapModal = ({ shift, onClose, onSubmit, isPending }) => {
  const [reason, setReason] = useState('');
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Request Swap</h3>
          <button onClick={onClose}><X size={20} className="text-gray-400" /></button>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-600">
          <p className="font-medium text-gray-800">{shift.requiredSkill ?? shift.skill} Shift</p>
          <p>{formatDate(shift.date, 'EEEE, MMM dd')} · {formatTime(shift.startTime)} – {formatTime(shift.endTime)}</p>
        </div>
        <p className="text-sm text-gray-500">
          This will post your shift as open for a drop/pickup. A manager can also arrange a direct swap.
        </p>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Reason (optional)</label>
          <textarea
            value={reason}
            onChange={e => setReason(e.target.value)}
            rows={3}
            placeholder="Why do you need a swap?"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50">
            Cancel
          </button>
          <button
            onClick={() => onSubmit(reason)}
            disabled={isPending}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
          >
            {isPending ? 'Requesting...' : 'Request Swap'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Main component ────────────────────────────────────────────
export const MyScheduleView = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [dropShift, setDropShift] = useState(null);
  const [swapShift, setSwapShift] = useState(null);

  // Get ALL shifts, then filter to ones where this user is assigned
  // Backend doesn't have a /shifts?userId= filter — assignments are nested
  const { data: allShifts = [], isLoading } = useQuery({
    queryKey: ['shifts'],
    queryFn: () => shiftsService.getAll(),
    enabled: !!user?.id,
  });

  // Filter to shifts where current user is in shiftAssignments
  const myShifts = allShifts.filter(shift =>
    (shift.assignments ?? []).some(a => {
      const assignedUserId = a.userId ?? a.user?.id;
      return Number(assignedUserId) === Number(user?.id);
    })
  );

  // Sort by date ascending
  const sortedShifts = [...myShifts].sort((a, b) =>
    new Date(a.date) - new Date(b.date)
  );

  // Group by date
  const shiftsByDate = {};
  sortedShifts.forEach(shift => {
    const date = shift.date?.split('T')[0];
    if (!shiftsByDate[date]) shiftsByDate[date] = [];
    shiftsByDate[date].push(shift);
  });

  const dropMutation = useMutation({
    mutationFn: ({ shiftId, reason }) =>
      swapsService.createSwap({ type: 'drop', requesterShiftId: shiftId, reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shifts'] });
      toastManager.success('Drop request submitted — a manager will review it');
      setDropShift(null);
    },
    onError: (e) => toastManager.error(e.response?.data?.message || 'Failed to drop shift'),
  });

  const swapMutation = useMutation({
    mutationFn: ({ shiftId, reason }) =>
      swapsService.createSwap({ type: 'drop', requesterShiftId: shiftId, reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shifts'] });
      toastManager.success('Swap request submitted — posted as open for pickup');
      setSwapShift(null);
    },
    onError: (e) => toastManager.error(e.response?.data?.message || 'Failed to request swap'),
  });

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-3xl font-bold text-gray-900">My Schedule</h1>
        <p className="text-gray-500 text-sm mt-1">
          {myShifts.length} upcoming shift{myShifts.length !== 1 ? 's' : ''} assigned
        </p>
      </div>

      {isLoading && <LoadingSpinner message="Loading your schedule..." />}

      {!isLoading && sortedShifts.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <CheckCircle size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No shifts assigned yet</p>
        </div>
      )}

      {!isLoading && Object.entries(shiftsByDate).map(([date, shifts]) => (
        <div key={date} className="space-y-3">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
            {formatDate(date, 'EEEE, MMMM dd, yyyy')}
          </h2>
          <div className="space-y-2">
            {shifts.map(shift => (
              <div
                key={shift.id}
                className="bg-white rounded-lg shadow-sm p-4 flex items-start justify-between gap-4 hover:shadow-md transition"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <h3 className="font-semibold text-gray-900 capitalize">
                      {shift.requiredSkill ?? shift.skill}
                    </h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_STYLES[shift.status] ?? 'bg-gray-100 text-gray-500'}`}>
                      {shift.status}
                    </span>
                    {/* {shift.isPremium && (
                      <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full font-medium">
                        Premium
                      </span>
                    )} */}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Clock size={13} />
                      {formatTime(shift.startTime)} – {formatTime(shift.endTime)}
                      <span className="text-gray-400">({formatDuration(shift.startTime, shift.endTime)})</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={13} />
                      {shift.location?.name ?? shift.location ?? 'N/A'}
                    </span>
                  </div>
                </div>

                {/* Only allow swap/drop on published shifts */}
                {shift.status === 'published' && (
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => setSwapShift(shift)}
                      className="flex items-center gap-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      <Repeat2 size={15} />
                      Swap
                    </button>
                    <button
                      onClick={() => setDropShift(shift)}
                      className="flex items-center gap-1 px-3 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                      <Trash2 size={15} />
                      Drop
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {dropShift && (
        <DropModal
          shift={dropShift}
          onClose={() => setDropShift(null)}
          isPending={dropMutation.isPending}
          onSubmit={(reason) => dropMutation.mutate({ shiftId: dropShift.id, reason })}
        />
      )}

      {swapShift && (
        <SwapModal
          shift={swapShift}
          onClose={() => setSwapShift(null)}
          isPending={swapMutation.isPending}
          onSubmit={(reason) => swapMutation.mutate({ shiftId: swapShift.id, reason })}
        />
      )}
    </div>
  );
};