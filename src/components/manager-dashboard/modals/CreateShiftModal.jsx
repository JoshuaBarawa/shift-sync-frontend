import { useState } from 'react';
import { X } from 'lucide-react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { shiftsService } from '../../../services/shiftsService';
import { locationsService } from '../../../services/locationsService';
import { validateTimeRange, validateHeadcount } from '../../../utils/validators';
import { toastManager } from '../../common/Toast';
import { formatDateForAPI } from '../../../utils/dates';

export const CreateShiftModal = ({ isOpen, onClose }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    date: formatDateForAPI(new Date()),
    startTime: '08:00',
    endTime: '16:00',
    requiredSkill: 'bartender',
    headcount: 1,           // always a number
    locationId: null,       // set after locations load
    notes: '',
  });
  const [errors, setErrors] = useState({});

  // Load real locations from API
  const { data: locations = [] } = useQuery({
    queryKey: ['locations'],
    queryFn: () => locationsService.getAll(),
    onSuccess: (data) => {
      // Set first location as default once loaded
      if (data.length > 0 && !formData.locationId) {
        setFormData((prev) => ({ ...prev, locationId: data[0].id }));
      }
    },
  });

  const createMutation = useMutation({
    mutationFn: (data) => shiftsService.createShift(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shifts'] });
      toastManager.success('Shift created successfully!');
      handleClose();
    },
    onError: (error) => {
      toastManager.error(error.response?.data?.message || 'Failed to create shift');
    },
  });

  const validateForm = () => {
    const newErrors = {};
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.startTime) newErrors.startTime = 'Start time is required';
    if (!formData.endTime) newErrors.endTime = 'End time is required';
    if (formData.startTime && formData.endTime) {
      if (!validateTimeRange(formData.startTime, formData.endTime)) {
        newErrors.timeRange = 'End time must be after start time';
      }
    }
    if (!formData.requiredSkill) newErrors.requiredSkill = 'Skill is required';
    if (!formData.headcount || !validateHeadcount(formData.headcount)) {
      newErrors.headcount = 'Headcount must be between 1 and 50';
    }
    if (!formData.locationId) newErrors.locationId = 'Location is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Always parse numeric fields as numbers
    let parsed = type === 'checkbox' ? checked : value;
    if (name === 'headcount') parsed = parseInt(value, 10) || 1;
    if (name === 'locationId') parsed = parseInt(value, 10);

    setFormData((prev) => ({ ...prev, [name]: parsed }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Ensure numbers are numbers before sending
    createMutation.mutate({
      ...formData,
      headcount: Number(formData.headcount),
      locationId: Number(formData.locationId),
    });
  };

  const handleClose = () => {
    setFormData({
      date: formatDateForAPI(new Date()),
      startTime: '08:00',
      endTime: '16:00',
      requiredSkill: 'bartender',
      headcount: 1,
      locationId: locations[0]?.id ?? null,
      notes: '',
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">

        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Create New Shift</h2>
          <button onClick={handleClose} className="p-1 hover:bg-gray-100 rounded-lg transition">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">

          {/* Location — real data from API */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <select
              name="locationId"
              value={formData.locationId ?? ''}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.locationId ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              {locations.length === 0 && <option value="">Loading locations...</option>}
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name}
                </option>
              ))}
            </select>
            {errors.locationId && <p className="text-xs text-red-600 mt-1">{errors.locationId}</p>}
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.date ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.date && <p className="text-xs text-red-600 mt-1">{errors.date}</p>}
          </div>

          {/* Start + End time on same row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.startTime ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.startTime && <p className="text-xs text-red-600 mt-1">{errors.startTime}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.endTime ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.endTime && <p className="text-xs text-red-600 mt-1">{errors.endTime}</p>}
            </div>
          </div>
          {errors.timeRange && <p className="text-xs text-red-600 -mt-2">{errors.timeRange}</p>}

          {/* Skill */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Skill Required</label>
            <select
              name="requiredSkill"
              value={formData.requiredSkill}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="bartender">Bartender</option>
              <option value="line_cook">Line Cook</option>
              <option value="server">Server</option>
              <option value="host">Host</option>
              <option value="busser">Busser</option>
              <option value="dishwasher">Dishwasher</option>
            </select>
            {errors.requiredSkill && <p className="text-xs text-red-600 mt-1">{errors.requiredSkill}</p>}
          </div>

          {/* Headcount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Headcount Needed</label>
            <input
              type="number"
              name="headcount"
              value={formData.headcount}
              onChange={handleChange}
              min="1"
              max="50"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.headcount ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.headcount && <p className="text-xs text-red-600 mt-1">{errors.headcount}</p>}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              placeholder="Any special instructions..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 text-sm font-medium"
            >
              {createMutation.isPending ? 'Creating...' : 'Create Shift'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};