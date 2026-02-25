import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { swapsService } from '../../services/swapsService';
import { staffService } from '../../services/staffService';
import { useAuth } from '../../hooks/useAuth';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { toastManager } from '../common/Toast';
import { formatDate } from '../../utils/dates';
import { X } from 'lucide-react';

export const MySwapsView = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [filterStatus, setFilterStatus] = useState('all');

  const { data: allSwaps = [], isLoading } = useQuery({
    queryKey: ['mySwaps', user?.id],
    queryFn: () => swapsService.getAllSwaps({}),
    enabled: !!user?.id,
  });

  // Client-side filtering for user's swaps
  const swaps = allSwaps.filter(swap => {
    // Only show swaps where user is requester or requestee
    if (swap.requesterId !== user?.id && swap.requesteeId !== user?.id) {
      return false;
    }
    
    // Filter by status
    if (filterStatus === 'all') return true;
    return swap.status === filterStatus;
  });

  const acceptMutation = useMutation({
    mutationFn: (swapId) => swapsService.acceptSwap(swapId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mySwaps'] });
      toastManager.success('Swap request accepted!');
    },
    onError: (error) => {
      toastManager.error(error.response?.data?.message || 'Failed to accept swap');
    },
  });

  const declineMutation = useMutation({
    mutationFn: ({ swapId, reason }) => swapsService.declineSwap(swapId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mySwaps'] });
      toastManager.success('Swap request declined!');
    },
    onError: (error) => {
      toastManager.error(error.response?.data?.message || 'Failed to decline swap');
    },
  });

  const pickupMutation = useMutation({
    mutationFn: (swapId) => swapsService.pickupDrop(swapId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mySwaps'] });
      toastManager.success('Drop shift picked up!');
    },
    onError: (error) => {
      toastManager.error(error.response?.data?.message || 'Failed to pick up shift');
    },
  });

  const cancelMutation = useMutation({
    mutationFn: (swapId) => swapsService.cancelSwap(swapId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mySwaps'] });
      toastManager.success('Swap request cancelled!');
    },
    onError: (error) => {
      toastManager.error(error.response?.data?.message || 'Failed to cancel swap');
    },
  });

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-3xl font-bold text-gray-900">My Swap Requests</h1>
        <p className="text-gray-600 text-sm mt-1">
          Track all your shift swap and drop requests
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto">
        {['all', 'pending', 'approved', 'rejected', 'cancelled'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
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

      {!isLoading && swaps.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center text-gray-500">
          No swap requests found
        </div>
      )}

      {!isLoading && swaps.length > 0 && (
        <div className="space-y-4">
          {swaps.map((swap) => (
            <div key={swap.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900">
                      {swap.type === 'swap' ? 'Shift Swap Request' : 'Shift Drop Request'}
                    </h3>
                    <span className={`text-xs font-semibold px-2 py-1 rounded ${getStatusColor(swap.status)}`}>
                      {swap.status}
                    </span>
                  </div>

                  {swap.type === 'swap' && (
                    <div className="text-sm text-gray-600 mb-2">
                      {user?.id === swap.requesterId ? (
                        <>
                          Requesting to swap with <span className="font-medium">{swap.requestee?.name}</span>
                          <p className="text-xs text-gray-500 mt-1">
                            Your shift: {formatDate(swap.requesterShift?.date)} {swap.requesterShift?.startTime}-{swap.requesterShift?.endTime}
                          </p>
                          <p className="text-xs text-gray-500">
                            Their shift: {formatDate(swap.requesteeShift?.date)} {swap.requesteeShift?.startTime}-{swap.requesteeShift?.endTime}
                          </p>
                        </>
                      ) : (
                        <>
                          <span className="font-medium">{swap.requester?.name}</span> is requesting to swap
                          <p className="text-xs text-gray-500 mt-1">
                            Their shift: {formatDate(swap.requesterShift?.date)} {swap.requesterShift?.startTime}-{swap.requesterShift?.endTime}
                          </p>
                          <p className="text-xs text-gray-500">
                            Your shift: {formatDate(swap.requesteeShift?.date)} {swap.requesteeShift?.startTime}-{swap.requesteeShift?.endTime}
                          </p>
                        </>
                      )}
                    </div>
                  )}

                  {swap.reason && (
                    <div className="bg-gray-50 p-3 rounded text-sm text-gray-700 mb-3">
                      <p className="font-medium mb-1">Your Reason:</p>
                      <p>{swap.reason}</p>
                    </div>
                  )}

                  {swap.rejectionReason && (
                    <div className="bg-red-50 border border-red-200 p-3 rounded text-sm text-red-700 mb-3">
                      <p className="font-medium mb-1">Rejection Reason:</p>
                      <p>{swap.rejectionReason}</p>
                    </div>
                  )}

                  <div className="text-xs text-gray-500 space-y-1">
                    <p>Requested: {formatDate(swap.createdAt, 'MMM dd, yyyy HH:mm')}</p>
                    {swap.respondedAt && (
                      <p>Responded: {formatDate(swap.respondedAt, 'MMM dd, yyyy HH:mm')}</p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 flex-shrink-0">
                  {swap.status === 'pending_acceptance' && user?.id === swap.requesteeId && (
                    <>
                      <button
                        onClick={() => acceptMutation.mutate(swap.id)}
                        disabled={acceptMutation.isPending}
                        className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => {
                          const reason = prompt('Decline reason (optional):');
                          if (reason !== null) {
                            declineMutation.mutate({ swapId: swap.id, reason: reason || '' });
                          }
                        }}
                        disabled={declineMutation.isPending}
                        className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                      >
                        Decline
                      </button>
                    </>
                  )}

                  {swap.type === 'drop' && swap.status === 'pending_acceptance' && user?.id !== swap.requesterId && (
                    <button
                      onClick={() => pickupMutation.mutate(swap.id)}
                      disabled={pickupMutation.isPending}
                      className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                    >
                      Pick Up
                    </button>
                  )}

                  {swap.status === 'pending_acceptance' && user?.id === swap.requesterId && (
                    <button
                      onClick={() => cancelMutation.mutate(swap.id)}
                      disabled={cancelMutation.isPending}
                      className="flex items-center gap-2 px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                    >
                      <X size={18} />
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
