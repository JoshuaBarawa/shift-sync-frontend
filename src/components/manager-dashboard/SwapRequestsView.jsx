import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { swapsService } from '../../services/swapsService';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { toastManager } from '../common/Toast';
import { formatDate } from '../../utils/dates';
import { Check, X } from 'lucide-react';

export const SwapRequestsView = () => {
  const queryClient = useQueryClient();
  const [filterStatus, setFilterStatus] = useState('all');
  const [rejectingSwapId, setRejectingSwapId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  const { data: swaps = [], isLoading, error } = useQuery({
  queryKey: ['swaps'],
  queryFn: () => swapsService.getAllSwaps(),
});


const filteredSwaps = useMemo(() => {
  if (filterStatus === 'all') return swaps;

  const map = {
    pending: 'pending_acceptance',
    open: 'open',
    'pending approval': 'pending_approval',
    approved: 'approved',
    rejected: 'rejected',
    cancelled: 'cancelled',
    expired: 'expired',
  };

  const backendStatus = map[filterStatus] || filterStatus;

  return swaps.filter((swap) => swap.status === backendStatus);
}, [swaps, filterStatus]);

  const approveMutation = useMutation({
    mutationFn: (id) => swapsService.approveSwap(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['swaps'] });
      toastManager.success('Swap request approved!');
    },
    onError: (error) => {
      toastManager.error(error.response?.data?.message || 'Failed to approve swap');
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (id) => swapsService.rejectSwap(id, rejectReason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['swaps'] });
      toastManager.success('Swap request rejected!');
      setShowRejectDialog(false);
      setRejectReason('');
      setRejectingSwapId(null);
    },
    onError: (error) => {
      toastManager.error(error.response?.data?.message || 'Failed to reject swap');
    },
  });

  const handleRejectClick = (swapId) => {
    setRejectingSwapId(swapId);
    setShowRejectDialog(true);
  };

  const handleRejectConfirm = () => {
    if (rejectingSwapId) {
      rejectMutation.mutate(rejectingSwapId);
    }
  };

  const handleFilterSwaps = (status) => {
    const map = {
      "pending": 'pending_acceptance',
      'open': 'open',
      "pending approval": 'pending_approval',
      'approved': 'approved',
      'rejected': 'rejected',
      'cancelled': 'cancelled',
      'expired': 'expired'
    }


  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-3xl font-bold text-gray-900">Swap Requests</h1>
        <p className="text-gray-600 text-sm mt-1">
          Manage staff shift swap and drop requests
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        {['all',
          'pending',
          'open',
          'pending approval',
          'approved',
          'rejected',
          'cancelled',
          'expired',
        ].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filterStatus === status
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {isLoading && <LoadingSpinner message="Loading swap requests..." />}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          Failed to load swap requests. Please try again.
        </div>
      )}

      {!isLoading && !error && (
        <div className="space-y-4">
          {filteredSwaps.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center text-gray-500">
              No swap requests found
            </div>
          ) : (
            filteredSwaps.map((swap) => (
              <div key={swap.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">
                        {swap.type === 'swap' ? 'Swap Request' : 'Drop Request'}
                      </h3>
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded ${
                          swap.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : swap.status === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {swap.status}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 mb-3">
                      Requested by: <span className="font-medium">{swap.requester.name}</span>
                    </p>

                    {swap.type === 'swap' && (
                      <p className="text-sm text-gray-600 mb-3">
                        Swap with: <span className="font-medium">{swap.requestee.name}</span>
                      </p>
                    )}

                    {swap.reason && (
                      <div className="bg-gray-50 p-3 rounded text-sm text-gray-700 mb-3">
                        <p className="font-medium mb-1">Reason:</p>
                        <p>{swap.reason}</p>
                      </div>
                    )}

                    <p className="text-xs text-gray-500">
                      Requested on: {formatDate(swap.createdAt, 'MMM dd, yyyy HH:mm')}
                    </p>
                  </div>

                  {/* Actions */}
                  {swap.status === 'pending_approval' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => approveMutation.mutate(swap.id)}
                        disabled={approveMutation.isPending}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                      >
                        <Check size={18} />
                        Approve
                      </button>
                      <button
                        onClick={() => handleRejectClick(swap.id)}
                        disabled={rejectMutation.isPending}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                      >
                        <X size={18} />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Reject Reason Dialog */}
      <ConfirmDialog
        isOpen={showRejectDialog}
        title="Reject Swap Request"
        message="Provide a reason for rejecting this request (optional):"
        confirmText="Reject"
        cancelText="Cancel"
        isDangerous
        isLoading={rejectMutation.isPending}
        onConfirm={handleRejectConfirm}
        onCancel={() => {
          setShowRejectDialog(false);
          setRejectReason('');
          setRejectingSwapId(null);
        }}
      />

      {/* Inline Reason Input */}
      {showRejectDialog && (
        <div className="fixed inset-0 z-40" onClick={() => setShowRejectDialog(false)}>
          <textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Enter reason for rejection..."
            className="hidden"
          />
        </div>
      )}
    </div>
  );
};
