import { Bell, LogOut, User, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { NotificationsPanel } from '../common/NotificationsPanel';
import api from '../../services/api';

export const Header = ({ toggleSidebar, isSidebarOpen }) => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Fetch unread count directly — no hook dependency needed
  const { data: unreadData } = useQuery({
    queryKey: ['notifications-unread'],
    queryFn: () => api.get('/notifications/unread-count').then(r => r.data),
    refetchInterval: 30000, // poll every 30s
  });
  const unreadCount = unreadData?.count ?? 0;

  // Handle name — API returns single "name" field
  const displayName = user?.name ?? `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim() ?? 'User';
  const initials = displayName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-3 sm:px-6">

          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition"
            >
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h1 className="text-2xl font-bold text-primary">ShiftSync</h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">

            {/* Notifications Bell */}
            <button
              onClick={() => setNotificationsOpen(true)}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition"
              aria-label="Notifications"
            >
              <Bell size={20} className="text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold text-white bg-red-500 rounded-full px-1">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(prev => !prev)}
                className="flex items-center gap-2 p-1.5 hover:bg-gray-100 rounded-lg transition"
              >
                <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                  {initials}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-gray-900 leading-tight">{displayName}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                </div>
              </button>

              {showUserMenu && (
                <>
                  {/* Click outside to close */}
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setShowUserMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-40">
                    <div className="px-4 py-2 border-b border-gray-100 mb-1">
                      <p className="text-sm font-medium text-gray-900">{displayName}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition">
                      <User size={15} />
                      Profile
                    </button>
                    <hr className="my-1" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                    >
                      <LogOut size={15} />
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* Notifications slide-in panel */}
      <NotificationsPanel
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />
    </>
  );
};