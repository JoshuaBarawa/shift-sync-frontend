import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { auditService } from '../../services/auditService';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { formatDate } from '../../utils/dates';
import { ChevronDown, ChevronUp } from 'lucide-react';

const ACTION_COLORS = {
  shift_created:     'bg-blue-100 text-blue-700',
  shift_updated:     'bg-yellow-100 text-yellow-700',
  shift_published:   'bg-green-100 text-green-700',
  shift_unpublished: 'bg-gray-100 text-gray-600',
  shift_cancelled:   'bg-red-100 text-red-700',
  staff_assigned:    'bg-emerald-100 text-emerald-700',
  staff_unassigned:  'bg-orange-100 text-orange-700',
  swap_requested:    'bg-purple-100 text-purple-700',
  swap_accepted:     'bg-green-100 text-green-700',
  swap_declined:     'bg-red-100 text-red-700',
  swap_approved:     'bg-emerald-100 text-emerald-700',
  swap_rejected:     'bg-red-100 text-red-700',
  swap_cancelled:    'bg-gray-100 text-gray-600',
  drop_picked_up:    'bg-blue-100 text-blue-700',
};

const ALL_ACTIONS = [
  'shift_created', 'shift_updated', 'shift_published', 'shift_unpublished',
  'shift_cancelled', 'staff_assigned', 'staff_unassigned', 'swap_requested',
  'swap_accepted', 'swap_declined', 'swap_approved', 'swap_rejected',
  'swap_cancelled', 'drop_picked_up',
];

export const AuditLogView = () => {
  const [expandedId, setExpandedId] = useState(null);
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
  });
  const [actionFilter, setActionFilter] = useState('');

  const { data: auditLog = [], isLoading, error } = useQuery({
    queryKey: ['auditLog', dateRange, actionFilter],
    queryFn: () =>
      auditService.getAuditLogs({
        startDate: dateRange.start,
        endDate: dateRange.end,
        action: actionFilter || undefined,
      }),
  });

  // Helper — safely get performer name regardless of shape
  const getPerformerName = (entry) => {
    if (!entry.performedBy) return `User #${entry.performedById}`;
    if (typeof entry.performedBy === 'string') return entry.performedBy;
    return entry.performedBy.name ?? entry.performedBy.email ?? `User #${entry.performedById}`;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-3xl font-bold text-gray-900">Audit Log</h1>
        <p className="text-gray-500 text-sm mt-1">
          {auditLog.length} record{auditLog.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Action Type</label>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="">All Actions</option>
              {ALL_ACTIONS.map((action) => (
                <option key={action} value={action}>{action.replace(/_/g, ' ')}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {isLoading && <LoadingSpinner message="Loading audit log..." />}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          Failed to load audit log. Please try again.
        </div>
      )}

      {!isLoading && !error && (
        <div className="space-y-2">
          {auditLog.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center text-gray-400">
              No audit records found for this period
            </div>
          ) : (
            auditLog.map((entry) => (
              <div key={entry.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <button
                  onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
                  className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition text-left"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={`inline-flex px-2.5 py-0.5 text-xs font-semibold rounded-full ${ACTION_COLORS[entry.action] ?? 'bg-gray-100 text-gray-600'}`}>
                        {entry.action.replace(/_/g, ' ')}
                      </span>
                      <span className="text-xs text-gray-400 capitalize">{entry.resourceType} #{entry.resourceId}</span>
                    </div>
                    <p className="text-sm text-gray-700">{entry.summary}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {/* FIX: was entry.performedBy (object) — now entry.performedBy.name */}
                      By <span className="font-medium text-gray-600">{getPerformerName(entry)}</span>
                      {' · '}
                      {formatDate(entry.createdAt, 'MMM dd, yyyy HH:mm')}
                    </p>
                  </div>
                  {expandedId === entry.id
                    ? <ChevronUp size={18} className="text-gray-400 flex-shrink-0 ml-3" />
                    : <ChevronDown size={18} className="text-gray-400 flex-shrink-0 ml-3" />
                  }
                </button>

                {expandedId === entry.id && (
                  <div className="border-t border-gray-100 px-5 py-4 bg-gray-50 space-y-3">
                    {/* Before / After diff */}
                    {entry.before || entry.after ? (
                      <div className="grid grid-cols-2 gap-3">
                        {entry.before && (
                          <div>
                            <p className="text-xs font-semibold text-red-500 uppercase mb-1">Before</p>
                            <pre className="text-xs bg-red-50 border border-red-100 p-2 rounded overflow-x-auto text-gray-700">
                              {JSON.stringify(entry.before, null, 2)}
                            </pre>
                          </div>
                        )}
                        {entry.after && (
                          <div>
                            <p className="text-xs font-semibold text-green-600 uppercase mb-1">After</p>
                            <pre className="text-xs bg-green-50 border border-green-100 p-2 rounded overflow-x-auto text-gray-700">
                              {JSON.stringify(entry.after, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400">No state change recorded</p>
                    )}

                    {/* Performer details */}
                    {entry.performedBy && typeof entry.performedBy === 'object' && (
                      <div className="text-xs text-gray-500">
                        <span className="font-medium">Performed by:</span>{' '}
                        {entry.performedBy.name} ({entry.performedBy.email}) · {entry.performedBy.role}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};