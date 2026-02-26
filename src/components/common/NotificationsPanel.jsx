import { X, Bell, Check, CheckCheck } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import api from '../../services/api';
const TYPE_STYLES = {
  shift_assigned:    'bg-blue-50 border-blue-200',
  shift_unassigned:  'bg-orange-50 border-orange-200',
  shift_published:   'bg-green-50 border-green-200',
  shift_edited:      'bg-yellow-50 border-yellow-200',
  shift_cancelled:   'bg-red-50 border-red-200',
  swap_requested:    'bg-purple-50 border-purple-200',
  swap_accepted:     'bg-green-50 border-green-200',
  swap_declined:     'bg-red-50 border-red-200',
  swap_approved:     'bg-emerald-50 border-emerald-200',
  swap_rejected:     'bg-red-50 border-red-200',
  swap_cancelled:    'bg-gray-50 border-gray-200',
  drop_picked_up:    'bg-blue-50 border-blue-200',
  overtime_warning:  'bg-amber-50 border-amber-200',
};

const notificationsService = {
  getAll:       () => api.get('/notifications').then(r => r.data),
  getUnreadCount: () => api.get('/notifications/unread-count').then(r => r.data),
  markRead:     (id) => api.patch(`/notifications/${id}/read`).then(r => r.data),
  markAllRead:  () => api.patch('/notifications/read-all').then(r => r.data),
};

export const NotificationsPanel = ({ isOpen, onClose }) => {
  const queryClient = useQueryClient();

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: notificationsService.getAll,
    enabled: isOpen,
    refetchInterval: isOpen ? 15000 : false, // poll every 15s while open
  });

  const markReadMutation = useMutation({
    mutationFn: notificationsService.markRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications-unread'] });
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: notificationsService.markAllRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications-unread'] });
    },
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black bg-opacity-20"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl z-50 flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Bell size={20} className="text-gray-700" />
            <h2 className="font-semibold text-gray-900">Notifications</h2>
            {unreadCount > 0 && (
              <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold text-white bg-red-500 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={() => markAllReadMutation.mutate()}
                disabled={markAllReadMutation.isPending}
                className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium px-2 py-1 rounded hover:bg-blue-50 transition"
              >
                <CheckCheck size={14} />
                Mark all read
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {isLoading && (
            <div className="space-y-3 p-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
              ))}
            </div>
          )}

          {!isLoading && notifications.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <Bell size={40} className="mb-3 opacity-30" />
              <p className="text-sm">No notifications yet</p>
            </div>
          )}

          {!isLoading && notifications.length > 0 && (
            <div className="divide-y divide-gray-100">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => {
                    if (!notification.isRead) {
                      markReadMutation.mutate(notification.id);
                    }
                  }}
                  className={`px-5 py-4 cursor-pointer hover:bg-gray-50 transition relative ${
                    !notification.isRead ? 'bg-blue-50/40' : ''
                  }`}
                >
                  {/* Unread dot */}
                  {!notification.isRead && (
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-blue-500 rounded-full" />
                  )}

                  <div className={`rounded-lg border p-3 ${TYPE_STYLES[notification.type] ?? 'bg-gray-50 border-gray-200'}`}>
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-sm font-semibold ${notification.isRead ? 'text-gray-700' : 'text-gray-900'}`}>
                        {notification.title}
                      </p>
                      {notification.isRead && (
                        <Check size={14} className="text-gray-400 flex-shrink-0 mt-0.5" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-0.5 leading-snug">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-1.5">
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};