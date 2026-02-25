import { useNavigate, useLocation } from 'react-router-dom';
import { BarChart3, Users, Repeat2, Clock, FileText, X, Calendar } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isManager, isStaff, isAdmin } = useAuth();

  const managerMenuItems = [
    {
      label: 'Schedule',
      icon: BarChart3,
      path: '/dashboard',
    },
    {
      label: 'Staff',
      icon: Users,
      path: '/dashboard/staff',
    },
    {
      label: 'Swap Requests',
      icon: Repeat2,
      path: '/dashboard/swaps',
    },
  ];

  if (isAdmin) {
    managerMenuItems.push({
      label: 'Audit Log',
      icon: FileText,
      path: '/dashboard/audit',
    });
  }

  const staffMenuItems = [
    {
      label: 'My Schedule',
      icon: Clock,
      path: '/my-schedule',
    },
    {
      label: 'My Availability',
      icon: Calendar,
      path: '/my-schedule/availability',
    },
    {
      label: 'My Swaps',
      icon: Repeat2,
      path: '/my-schedule/swaps',
    },
  ];

  const menuItems = isStaff ? staffMenuItems : managerMenuItems;

  const isActive = (path) => location.pathname === path;

  const handleNavigate = (path) => {
    navigate(path);
    onClose?.();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-30"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-primary text-white transition-transform duration-300 z-40 pt-20 lg:static lg:translate-x-0 lg:pt-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header with close button */}
          <div className="flex items-center justify-between px-6 py-4 lg:hidden">
            <h2 className="text-lg font-semibold">Menu</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-primary-dark rounded-lg transition"
            >
              <X size={24} />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 px-3 py-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <button
                  key={item.path}
                  onClick={() => handleNavigate(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    active
                      ? 'bg-accent text-primary font-semibold'
                      : 'text-white hover:bg-opacity-20 hover:bg-white'
                  }`}
                >
                  <Icon size={20} />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Footer info */}
          <div className="px-6 py-4 border-t border-opacity-20 border-white text-xs text-opacity-70 text-white">
            <p>ShiftSync v1.0</p>
            <p className="mt-1">Coastal Eats</p>
          </div>
        </div>
      </aside>
    </>
  );
};
