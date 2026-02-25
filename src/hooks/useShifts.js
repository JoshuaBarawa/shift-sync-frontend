import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { shiftsService } from '../services/shiftsService';

export const useShifts = (filters = {}) => {
  const queryClient = useQueryClient();

  // Get shifts
  const { data: shifts = [], isLoading, error } = useQuery({
    queryKey: ['shifts', filters],
    queryFn: () => shiftsService.getAllShifts(filters),
  });

  // Create shift mutation
  const createShiftMutation = useMutation({
    mutationFn: (shiftData) => shiftsService.createShift(shiftData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shifts'] });
    },
  });

  // Update shift mutation
  const updateShiftMutation = useMutation({
    mutationFn: ({ id, data }) => shiftsService.updateShift(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shifts'] });
    },
  });

  // Publish shift mutation
  const publishShiftMutation = useMutation({
    mutationFn: (id) => shiftsService.publishShift(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shifts'] });
    },
  });

  // Unpublish shift mutation
  const unpublishShiftMutation = useMutation({
    mutationFn: (id) => shiftsService.unpublishShift(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shifts'] });
    },
  });

  // Cancel shift mutation
  const cancelShiftMutation = useMutation({
    mutationFn: (id) => shiftsService.cancelShift(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shifts'] });
    },
  });

  // Assign staff mutation
  const assignStaffMutation = useMutation({
    mutationFn: ({ shiftId, userId }) => shiftsService.assignStaff(shiftId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shifts'] });
    },
  });

  // Unassign staff mutation
  const unassignStaffMutation = useMutation({
    mutationFn: ({ shiftId, userId }) => shiftsService.unassignStaff(shiftId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shifts'] });
    },
  });

  // Get qualified staff mutation
  const getQualifiedStaffMutation = useMutation({
    mutationFn: (shiftId) => shiftsService.getQualifiedStaff(shiftId),
  });

  return {
    shifts,
    isLoading,
    error,
    createShift: (data) => createShiftMutation.mutateAsync(data),
    updateShift: (id, data) => updateShiftMutation.mutateAsync({ id, data }),
    publishShift: (id) => publishShiftMutation.mutateAsync(id),
    unpublishShift: (id) => unpublishShiftMutation.mutateAsync(id),
    cancelShift: (id) => cancelShiftMutation.mutateAsync(id),
    assignStaff: (shiftId, userId) => assignStaffMutation.mutateAsync({ shiftId, userId }),
    unassignStaff: (shiftId, userId) => unassignStaffMutation.mutateAsync({ shiftId, userId }),
    getQualifiedStaff: (shiftId) => getQualifiedStaffMutation.mutateAsync(shiftId),
  };
};
