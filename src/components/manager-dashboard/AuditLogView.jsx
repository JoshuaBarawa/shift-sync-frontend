import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { auditService } from '../../services/auditService';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { formatDate } from '../../utils/dates';
import { ChevronDown, ChevronUp } from 'lucide-react';

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

  const actions = Array.from(new Set(auditLog.map((entry) => entry.action)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-3xl font-bold text-gray-900">Audit Log</h1>
        <p className="text-gray-600 text-sm mt-1">
          System activity and change history
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              From Date
            </label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) =>
                setDateRange({ ...dateRange, start: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              To Date
            </label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) =>
                setDateRange({ ...dateRange, end: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Action Type
            </label>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">All Actions</option>
              {actions.map((action) => (
                <option key={action} value={action}>
                  {action}
                </option>
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
            <div className="bg-white rounded-lg shadow-sm p-12 text-center text-gray-500">
              No audit records found
            </div>
          ) : (
            auditLog.map((entry) => (
              <div key={entry.id} className="bg-white rounded-lg shadow-sm">
                <button
                  onClick={() =>
                    setExpandedId(expandedId === entry.id ? null : entry.id)
                  }
                  className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition"
                >
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded bg-primary bg-opacity-10 text-primary">
                        {entry.action}
                      </span>
                      <p className="font-medium text-gray-900">{entry.resourceType}</p>
                    </div>
                    <p className="text-sm text-gray-600">
                      By {entry.performedBy} • {formatDate(entry.timestamp, 'MMM dd, yyyy HH:mm:ss')}
                    </p>
                  </div>
                  {expandedId === entry.id ? (
                    <ChevronUp size={20} className="text-gray-400" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-400" />
                  )}
                </button>

                {expandedId === entry.id && (
                  <div className="border-t border-gray-200 px-4 py-4 bg-gray-50">
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs font-semibold text-gray-600 uppercase mb-1">
                          Summary
                        </p>
                        <p className="text-sm text-gray-900">{entry.summary}</p>
                      </div>
                      {entry.changes && (
                        <div>
                          <p className="text-xs font-semibold text-gray-600 uppercase mb-1">
                            Changes
                          </p>
                          <pre className="text-xs bg-white p-2 rounded border border-gray-200 overflow-x-auto text-gray-900">
                            {JSON.stringify(entry.changes, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
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
