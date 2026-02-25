import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { staffService } from '../../services/staffService';
import { LoadingSpinner } from '../common/LoadingSpinner';

export const StaffView = () => {
  const [selectedStaff, setSelectedStaff] = useState(null);

  const { data: staffList = [], isLoading, error } = useQuery({
    queryKey: ['staff'],
    queryFn: () => staffService.getAllStaff(),
  });

  // Helper — works whether API returns name, firstName+lastName, or neither
  const getDisplayName = (staff) => {
    if (staff.name) return staff.name;
    if (staff.firstName || staff.lastName) {
      return `${staff.firstName ?? ''} ${staff.lastName ?? ''}`.trim();
    }
    return staff.email ?? `User #${staff.id}`;
  };

  const getInitials = (staff) => {
    const name = getDisplayName(staff);
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-3xl font-bold text-gray-900">Staff Management</h1>
        <p className="text-gray-500 text-sm mt-1">
          {staffList.length} staff member{staffList.length !== 1 ? 's' : ''}
        </p>
      </div>

      {isLoading && <LoadingSpinner message="Loading staff..." />}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          Failed to load staff. Please try again.
        </div>
      )}

      {!isLoading && !error && (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Skills</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {staffList.map((staff) => (
                  <tr
                    key={staff.id}
                    onClick={() => setSelectedStaff(staff)}
                    className="hover:bg-gray-50 cursor-pointer transition"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0">
                          {getInitials(staff)}
                        </div>
                        <p className="font-medium text-gray-900">{getDisplayName(staff)}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{staff.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 capitalize">
                        {staff.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1 flex-wrap">
                        {(staff.skills ?? []).map((skill) => (
                          <span key={skill} className="inline-flex px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                            {skill}
                          </span>
                        ))}
                        {(!staff.skills || staff.skills.length === 0) && (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${
                        staff.isActive !== false
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {staff.isActive !== false ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {staffList.length === 0 && (
            <div className="text-center py-12 text-gray-400">No staff members found</div>
          )}
        </div>
      )}
    </div>
  );
};