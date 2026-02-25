import { useState } from 'react';
import { X } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { swapsService } from '../../../services/swapsService';
import { toastManager } from '../../common/Toast';

export const SwapRequestModal = ({ isOpen, shift, onClose }) => {
  const queryClient = useQueryClient();
  const [swapType, setSwapType] = useState('swap');
  const [targetStaffId, setTargetStaffId] = useState('');
  const [reason, setReason] = useState('');
  const [errors, setErrors] = useState({});

  const createMutation = useMutation({
    mutationFn: (data) => swapsService.createSwap(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mySchedule'] });
      queryClient.invalidateQueries({ queryKey: ['swaps'] });
      toastManager.success(`${swapType === 'swap' ? 'Swap' : 'Drop'} request submitted!`);
      handleClose();
    },
    onError: (error) => {
      toastManager.error(error.response?.data?.message || 'Failed to create request');
    },
  });

  const validateForm = () => {
    const newErrors = {};

    if (swapType === 'swap' && !targetStaffId) {
      newErrors.targetStaffId = 'Please select a staff member';
    }

    if (!reason.trim()) {
      newErrors.reason = 'Reason is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const data = {
      shiftId: shift.id,
      type: swapType,
      reason,
    };

    if (swapType === 'swap') {
      data.targetStaffId = targetStaffId;
    }

    createMutation.mutate(data);
  };

  const handleClose = () => {
    setSwapType('swap');
    setTargetStaffId('');
    setReason('');
    setErrors({});
    onClose();
  };

  if (!isOpen || !shift) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {swapType === 'swap' ? 'Request Shift Swap' : 'Drop Shift'}
          </h2>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Shift Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-xs text-gray-600 mb-1">Shift Details</p>
            <p className="font-semibold text-gray-900">{shift.skill}</p>
            <p className="text-sm text-gray-600 mt-1">{shift.location}</p>
          </div>

          {/* Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Request Type
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="type"
                  value="swap"
                  checked={swapType === 'swap'}
                  onChange={(e) => setSwapType(e.target.value)}
                  className="w-4 h-4 text-primary"
                />
                <span className="ml-2 text-sm text-gray-700">Swap with colleague</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="type"
                  value="drop"
                  checked={swapType === 'drop'}
                  onChange={(e) => setSwapType(e.target.value)}
                  className="w-4 h-4 text-primary"
                />
                <span className="ml-2 text-sm text-gray-700">Drop this shift</span>
              </label>
            </div>
          </div>

          {/* Target Staff (if swap) */}
          {swapType === 'swap' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Colleague & Shift
              </label>
              <select
                value={targetStaffId}
                onChange={(e) => setTargetStaffId(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.targetStaffId ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Choose a colleague...</option>
                <option value="staff1">John Smith (Wed 14:00)</option>
                <option value="staff2">Jane Doe (Thu 10:00)</option>
              </select>
              {errors.targetStaffId && (
                <p className="text-xs text-red-600 mt-1">{errors.targetStaffId}</p>
              )}
            </div>
          )}

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please explain why you need this swap or drop..."
              rows="4"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.reason ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.reason && (
              <p className="text-xs text-red-600 mt-1">{errors.reason}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition disabled:opacity-50"
            >
              {createMutation.isPending ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
