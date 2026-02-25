import { useState } from 'react';
import { X, Plus, Trash2, AlertCircle, History } from 'lucide-react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { shiftsService } from '../../../services/shiftsService';
import { formatTime, formatDate, formatDuration } from '../../../utils/dates';
import { formatStatus } from '../../../utils/formatters';
import { ConfirmDialog } from '../../common/ConfirmDialog';
import { toastManager } from '../../common/Toast';
import { formatDistanceToNow } from 'date-fns';

// ─── Inline Audit Trail ───────────────────────────────────────
const ACTION_LABELS = {
  shift_created:     { label: 'Created',        color: 'bg-blue-100 text-blue-700' },
  shift_updated:     { label: 'Updated',        color: 'bg-yellow-100 text-yellow-700' },
  shift_published:   { label: 'Published',      color: 'bg-green-100 text-green-700' },
  shift_unpublished: { label: 'Unpublished',    color: 'bg-gray-100 text-gray-500' },
  shift_cancelled:   { label: 'Cancelled',      color: 'bg-red-100 text-red-700' },
  staff_assigned:    { label: 'Staff Assigned', color: 'bg-emerald-100 text-emerald-700' },
  staff_unassigned:  { label: 'Staff Removed',  color: 'bg-orange-100 text-orange-700' },
};

const AuditTrail = ({ shiftId }) => {
  const { data: logs = [], isLoading } = useQuery({
    queryKey: ['auditTrail', 'shift', shiftId],
    queryFn: () => shiftsService.getShiftAuditHistory(shiftId),
    enabled: !!shiftId,
  });

  if (isLoading) return (
    <div className="space-y-2 animate-pulse">
      {[1,2,3].map(i => <div key={i} className="h-10 bg-gray-100 rounded-lg" />)}
    </div>
  );

  if (logs.length === 0) return (
    <p className="text-sm text-gray-400 text-center py-4">No history yet</p>
  );

  return (
    <div className="space-y-1">
      {logs.map((log) => {
        const meta = ACTION_LABELS[log.action] ?? { label: log.action, color: 'bg-gray-100 text-gray-600' };
        const performedBy = log.performedBy?.name ?? `User #${log.performedById}`;
        const timeAgo = formatDistanceToNow(new Date(log.createdAt), { addSuffix: true });
        return (
          <div key={log.id} className="flex items-start gap-3 py-2 border-b border-gray-50 last:border-0">
            <div className="w-1.5 h-1.5 rounded-full bg-gray-300 flex-shrink-0 mt-2" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${meta.color}`}>
                  {meta.label}
                </span>
                <span className="text-xs text-gray-500">by {performedBy}</span>
                <span className="text-xs text-gray-400 ml-auto">{timeAgo}</span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">{log.summary}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
// ─────────────────────────────────────────────────────────────

export const ShiftDetailModal = ({ isOpen, shift, onClose }) => {
  const queryClient = useQueryClient();
  const [showPublishConfirm, setShowPublishConfirm] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState('');
  const [assignWarning, setAssignWarning] = useState(null);
  const [showHistory, setShowHistory] = useState(false);

  // ── KEY FIX: fetch fresh shift data so progress bar stays live ──
  const { data: freshShift } = useQuery({
    queryKey: ['shift', shift?.id],
    queryFn: () => shiftsService.getOne(shift.id),
    enabled: isOpen && !!shift?.id,
  });
  // Always use freshShift when available — falls back to prop on first render
  const liveShift = freshShift ?? shift;

  // Qualified staff
  const { data: qualifiedData } = useQuery({
    queryKey: ['qualifiedStaff', shift?.id],
    queryFn: () => shiftsService.getQualifiedStaff(shift.id),
    enabled: isOpen && !!shift?.id,
  });
  const availableStaff = qualifiedData?.available ?? [];
  const unavailableStaff = qualifiedData?.unavailable ?? [];

  // ── Mutations — all invalidate ['shift', id] so liveShift refreshes ──
  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['shifts'] });
    queryClient.invalidateQueries({ queryKey: ['shift', shift?.id] });
    queryClient.invalidateQueries({ queryKey: ['auditTrail', 'shift', shift?.id] });
  };

  const publishMutation = useMutation({
    mutationFn: (id) => shiftsService.publishShift(id),
    onSuccess: () => { invalidate(); toastManager.success('Shift published!'); setShowPublishConfirm(false); },
    onError: (e) => toastManager.error(e.response?.data?.message || 'Failed to publish'),
  });

  const unpublishMutation = useMutation({
    mutationFn: (id) => shiftsService.unpublishShift(id),
    onSuccess: () => { invalidate(); toastManager.success('Shift unpublished'); setShowPublishConfirm(false); },
    onError: (e) => toastManager.error(e.response?.data?.message || 'Failed to unpublish'),
  });

  const cancelMutation = useMutation({
    mutationFn: (id) => shiftsService.cancelShift(id),
    onSuccess: () => { invalidate(); toastManager.success('Shift cancelled'); setShowCancelConfirm(false); onClose(); },
    onError: (e) => toastManager.error(e.response?.data?.message || 'Failed to cancel'),
  });

  const assignMutation = useMutation({
    mutationFn: (userId) => shiftsService.assignStaff(shift.id, userId),
    onSuccess: (data) => {
      invalidate();
      queryClient.invalidateQueries({ queryKey: ['qualifiedStaff', shift?.id] });
      if (data?.success === false) {
        toastManager.error(data.message);
      } else {
        toastManager.success('Staff assigned!');
        setSelectedStaff('');
        if (data?.warning) setAssignWarning(data.warning);
      }
    },
    onError: (e) => toastManager.error(e.response?.data?.message || 'Failed to assign'),
  });

  const unassignMutation = useMutation({
    mutationFn: (userId) => shiftsService.unassignStaff(shift.id, userId),
    onSuccess: () => {
      invalidate();
      queryClient.invalidateQueries({ queryKey: ['qualifiedStaff', shift?.id] });
      toastManager.success('Staff unassigned');
    },
    onError: (e) => toastManager.error(e.response?.data?.message || 'Failed to unassign'),
  });

  if (!isOpen || !liveShift) return null;

  // Read from liveShift — this is the key: not the stale prop
  const assignments = liveShift.assignments ?? liveShift.assignments ?? [];
  const assignedCount = assignments.length;
  console.log(assignments.length)
  const headcount = liveShift.headcount || 0;
  const fillPercentage = headcount > 0 ? Math.round((assignedCount / headcount) * 100) : 0;
  const canPublish = liveShift.status === 'draft' && assignedCount >= headcount;

  const getStaffName = (s) => {
    if (!s) return 'Unknown';
    if (s.name) return s.name;
    if (s.firstName || s.lastName) return `${s.firstName ?? ''} ${s.lastName ?? ''}`.trim();
    return `User #${s.id}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 capitalize">
              {liveShift.requiredSkill ?? liveShift.skill} Shift
              {liveShift.isPremium && (
                <span className="ml-2 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                  Premium
                </span>
              )}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {formatDate(liveShift.date, 'EEEE, MMM dd, yyyy')}
            </p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">

          {/* Overtime warning */}
          {assignWarning && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-2">
              <AlertCircle size={18} className="text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-yellow-800">Overtime Warning</p>
                <p className="text-sm text-yellow-700 mt-0.5">{assignWarning}</p>
              </div>
              <button onClick={() => setAssignWarning(null)} className="text-yellow-400 hover:text-yellow-600">
                <X size={16} />
              </button>
            </div>
          )}

          {/* Shift details */}
          <section className="space-y-3">
            <h3 className="font-semibold text-gray-900">Shift Details</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Time</p>
                <p className="font-semibold text-gray-900 text-sm">
                  {formatTime(liveShift.startTime)} – {formatTime(liveShift.endTime)}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{formatDuration(liveShift.startTime, liveShift.endTime)}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Location</p>
                <p className="font-semibold text-gray-900 text-sm">
                  {liveShift.location?.name ?? liveShift.location ?? 'N/A'}
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Status</p>
                <p className="font-semibold text-gray-900 text-sm capitalize">{formatStatus(liveShift.status)}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Headcount</p>
                <p className="font-semibold text-gray-900 text-sm">{headcount} needed</p>
              </div>
            </div>
            {liveShift.notes && (
              <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg">
                <p className="text-xs text-blue-600 font-semibold mb-1">Notes</p>
                <p className="text-sm text-blue-700">{liveShift.notes}</p>
              </div>
            )}
          </section>

          {/* Staff assignment */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Staff Assignment</h3>
              <span className="text-sm text-gray-500">{assignedCount}/{headcount} filled</span>
            </div>

            {/* Progress bar — driven by liveShift, updates on every fetch */}
            <div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full transition-all duration-500 ${
                    fillPercentage >= 100 ? 'bg-emerald-500' : 'bg-amber-400'
                  }`}
                  style={{ width: `${Math.min(fillPercentage, 100)}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">{fillPercentage}% filled</p>
            </div>

            {/* Assigned list */}
            {assignments.length > 0 && (
              <div className="space-y-2">
                {assignments.map((assignment) => {
                  const staff = assignment.user ?? assignment;
                  return (
                    <div key={assignment.id} className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{getStaffName(staff)}</p>
                        <p className="text-xs text-gray-400">{staff.email ?? ''}</p>
                      </div>
                      {liveShift.status === 'draft' && (
                        <button
                          onClick={() => unassignMutation.mutate(staff.id)}
                          disabled={unassignMutation.isPending}
                          className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Assign picker */}
            {liveShift.status === 'draft' && assignedCount < headcount && (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <select
                    value={selectedStaff}
                    onChange={(e) => setSelectedStaff(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select available staff...</option>
                    {availableStaff.map((s) => (
                      <option key={s.id} value={s.id}>{getStaffName(s)}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => selectedStaff && assignMutation.mutate(Number(selectedStaff))}
                    disabled={!selectedStaff || assignMutation.isPending}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2 text-sm"
                  >
                    <Plus size={15} />
                    {assignMutation.isPending ? 'Assigning...' : 'Assign'}
                  </button>
                </div>
                {unavailableStaff.length > 0 && (
                  <details className="text-xs text-gray-400">
                    <summary className="cursor-pointer hover:text-gray-600">
                      {unavailableStaff.length} qualified staff unavailable
                    </summary>
                    <ul className="mt-2 space-y-1 pl-2">
                      {unavailableStaff.map(({ user, reason }) => (
                        <li key={user.id}>
                          <span className="font-medium text-gray-600">{getStaffName(user)}</span>
                          <span className="text-gray-400"> — {reason}</span>
                        </li>
                      ))}
                    </ul>
                  </details>
                )}
              </div>
            )}
          </section>

        
          {/* Actions */}
          <section className="flex gap-3 pt-2 border-t border-gray-200">
            {liveShift.status === 'draft' && (
              <button
                onClick={() => setShowPublishConfirm(true)}
                disabled={!canPublish || publishMutation.isPending}
                title={!canPublish ? 'Fill all positions before publishing' : ''}
                className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
              >
                {publishMutation.isPending ? 'Publishing...' : 'Publish Shift'}
              </button>
            )}
            {liveShift.status === 'published' && (
              <button
                onClick={() => setShowPublishConfirm(true)}
                disabled={unpublishMutation.isPending}
                className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition disabled:opacity-50 text-sm font-medium"
              >
                {unpublishMutation.isPending ? 'Unpublishing...' : 'Unpublish'}
              </button>
            )}
            {liveShift.status !== 'cancelled' && (
              <button
                onClick={() => setShowCancelConfirm(true)}
                disabled={cancelMutation.isPending}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 text-sm font-medium"
              >
                {cancelMutation.isPending ? 'Cancelling...' : 'Cancel Shift'}
              </button>
            )}
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm font-medium"
            >
              Close
            </button>
          </section>

        </div>
      </div>

      <ConfirmDialog
        isOpen={showPublishConfirm}
        title={liveShift.status === 'published' ? 'Unpublish Shift?' : 'Publish Shift?'}
        message={liveShift.status === 'published'
          ? 'This shift will return to draft status.'
          : 'This shift will be published and all assigned staff will be notified.'}
        confirmText={liveShift.status === 'published' ? 'Unpublish' : 'Publish'}
        cancelText="Cancel"
        isLoading={publishMutation.isPending || unpublishMutation.isPending}
        onConfirm={() => liveShift.status === 'published'
          ? unpublishMutation.mutate(liveShift.id)
          : publishMutation.mutate(liveShift.id)
        }
        onCancel={() => setShowPublishConfirm(false)}
      />

      <ConfirmDialog
        isOpen={showCancelConfirm}
        title="Cancel Shift?"
        message="This cannot be undone. All assigned staff will be notified."
        confirmText="Cancel Shift"
        cancelText="Keep Shift"
        isDangerous
        isLoading={cancelMutation.isPending}
        onConfirm={() => cancelMutation.mutate(liveShift.id)}
        onCancel={() => setShowCancelConfirm(false)}
      />
    </div>
  );
};