import { Users, AlertCircle, Star } from 'lucide-react';
import { getStatusColor, getStatusBgColor, formatStatus } from '../../utils/formatters';
import { formatTime, formatDuration } from '../../utils/dates';

export const ShiftCard = ({ shift, onClick, isPremium = false }) => {
  const statusColor = getStatusColor(shift.status);
  const statusBgColor = getStatusBgColor(shift.status);
  const assignedCount = shift.assignments.length || 0;
  const headcount = shift.headcount || 0;
  const fillPercentage = Math.round((assignedCount / headcount) * 100);

  const hasWarnings = shift.warnings && shift.warnings.length > 0;

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg border-l-4 p-4 cursor-pointer hover:shadow-md transition mb-2"
      style={{ borderColor: statusColor, backgroundColor: statusBgColor }}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm text-gray-900">
              {shift.skill || 'Shift'}
            </h3>
            {isPremium && (
              <Star size={14} className="text-amber-500 fill-amber-500" />
            )}
          </div>
          <p className="text-xs text-gray-600 mt-1">
            {formatTime(shift.startTime)} - {formatTime(shift.endTime)}
            <span className="text-gray-500 ml-1">
              ({formatDuration(shift.startTime, shift.endTime)})
            </span>
          </p>
        </div>
        <span
          className="text-xs font-semibold px-2 py-1 rounded"
          style={{ color: statusColor }}
        >
          {formatStatus(shift.status)}
        </span>
      </div>

      {/* Staff Assignment Progress */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-gray-700">
            Staff: {assignedCount}/{headcount}
          </span>
          <span className="text-xs text-gray-500">{fillPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-emerald-500 h-2 rounded-full transition-all"
            style={{ width: `${fillPercentage}%` }}
          />
        </div>
      </div>

      {/* Warnings */}
      {hasWarnings && (
        <div className="flex items-start gap-2 text-xs text-amber-700 bg-amber-50 p-2 rounded">
          <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
          <div>
            {shift.warnings.map((warning, idx) => (
              <p key={idx}>{warning}</p>
            ))}
          </div>
        </div>
      )}

      {/* Location */}
      <p className="text-xs text-gray-500 mt-2">
        {typeof shift.location === 'object' 
          ? shift.location?.name || 'Main' 
          : shift.location || 'Main'}
      </p>
    </div>
  );
};
