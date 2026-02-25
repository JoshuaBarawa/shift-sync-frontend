import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { staffService } from '../../services/staffService';
import { useAuth } from '../../hooks/useAuth';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { toastManager } from '../common/Toast';
import { DAYS_OF_WEEK, DAYS_OF_WEEK_SHORT } from '../../utils/constants';

export const MyAvailabilityView = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [availability, setAvailability] = useState({});

  const { data: currentAvailability = {}, isLoading } = useQuery({
    queryKey: ['myAvailability', user?.id],
    queryFn: () => staffService.getAvailability(user.id),
    onSuccess: (data) => {
      setAvailability(data || {});
    },
    enabled: !!user?.id,
  });

  const updateMutation = useMutation({
    mutationFn: (data) => staffService.setAvailability(user.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myAvailability'] });
      toastManager.success('Availability updated successfully!');
      setIsEditing(false);
    },
    onError: (error) => {
      toastManager.error(error.response?.data?.message || 'Failed to update availability');
    },
  });

  const toggleAvailability = (day, time) => {
    const key = `${day}_${time}`;
    setAvailability((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = () => {
    // Transform availability object into array format for backend
    const availabilityArray = [];
    
    Object.entries(availability).forEach(([key, isAvailable]) => {
      if (isAvailable) {
        const [dayStr, time] = key.split('_');
        const dayOfWeek = parseInt(dayStr);
        
        // Calculate start and end time (1 hour slots)
        const [hour] = time.split(':');
        const startTime = time;
        const endHour = parseInt(hour) + 1;
        const endTime = `${endHour.toString().padStart(2, '0')}:00`;
        
        availabilityArray.push({
          dayOfWeek,
          startTime,
          endTime,
        });
      }
    });
    
    updateMutation.mutate(availabilityArray);
  };

  const handleCancel = () => {
    setAvailability(currentAvailability || {});
    setIsEditing(false);
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading availability..." />;
  }

  const hours = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Availability</h1>
          <p className="text-gray-600 text-sm mt-1">
            Set your weekly availability for shift assignments
          </p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition"
          >
            Edit Availability
          </button>
        )}
      </div>

      {/* Availability Grid */}
      <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                Time
              </th>
              {DAYS_OF_WEEK.map((day, idx) => (
                <th
                  key={day}
                  className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase"
                >
                  {DAYS_OF_WEEK_SHORT[idx]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {hours.map((time) => (
              <tr key={time} className="border-b border-gray-200">
                <td className="px-4 py-3 font-medium text-gray-900 text-sm">{time}</td>
                {DAYS_OF_WEEK.map((day, idx) => {
                  const key = `${idx}_${time}`;
                  const isAvailable = availability[key] || currentAvailability[key];

                  return (
                    <td key={key} className="px-4 py-3 text-center">
                      {isEditing ? (
                        <button
                          onClick={() => toggleAvailability(idx, time)}
                          className={`w-8 h-8 rounded-lg transition ${
                            isAvailable
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-200 text-gray-400'
                          }`}
                        >
                          ✓
                        </button>
                      ) : (
                        <div
                          className={`w-8 h-8 rounded-lg mx-auto ${
                            isAvailable ? 'bg-green-500' : 'bg-gray-200'
                          }`}
                        />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Actions */}
      {isEditing && (
        <div className="flex gap-3 justify-end">
          <button
            onClick={handleCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={updateMutation.isPending}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition disabled:opacity-50"
          >
            {updateMutation.isPending ? 'Saving...' : 'Save Availability'}
          </button>
        </div>
      )}

      {/* Legend */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm font-medium text-blue-900 mb-2">Legend:</p>
        <div className="flex items-center gap-4 text-sm text-blue-800">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded" />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-200 rounded" />
            <span>Not Available</span>
          </div>
        </div>
      </div>
    </div>
  );
};
