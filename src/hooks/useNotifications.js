import { useState, useCallback, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsService } from '../services/notificationsService';

export const useNotifications = () => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  // Fetch notifications
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationsService.getNotifications({ limit: 50 }),
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Fetch unread count
  const { data: unreadCount = 0 } = useQuery({
    queryKey: ['notificationsUnreadCount'],
    queryFn: async () => {
      const result = await notificationsService.getUnreadCount();
      return result.count || 0;
    },
    refetchInterval: 30000,
  });

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: (id) => notificationsService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notificationsUnreadCount'] });
    },
  });

  // Mark all as read mutation
  const markAllAsReadMutation = useMutation({
    mutationFn: () => notificationsService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notificationsUnreadCount'] });
    },
  });

  // Delete notification mutation
  const deleteNotificationMutation = useMutation({
    mutationFn: (id) => notificationsService.deleteNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const markAsRead = useCallback((id) => {
    markAsReadMutation.mutate(id);
  }, [markAsReadMutation]);

  const markAllAsRead = useCallback(() => {
    markAllAsReadMutation.mutate();
  }, [markAllAsReadMutation]);

  const deleteNotification = useCallback((id) => {
    deleteNotificationMutation.mutate(id);
  }, [deleteNotificationMutation]);

  return {
    notifications,
    unreadCount,
    isLoading,
    isOpen,
    setIsOpen,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  };
};
