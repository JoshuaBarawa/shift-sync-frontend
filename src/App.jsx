import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuth } from './hooks/useAuth';
import { LoadingSpinner } from './components/common/LoadingSpinner';
import { Toast } from './components/common/Toast';
import { MainLayout } from './components/layout/MainLayout';
import { LoginPage } from './components/auth/LoginPage';
import { ScheduleView } from './components/manager-dashboard/ScheduleView';
import { StaffView } from './components/manager-dashboard/StaffView';
import { SwapRequestsView } from './components/manager-dashboard/SwapRequestsView';
import { AuditLogView } from './components/manager-dashboard/AuditLogView';
import { MyScheduleView } from './components/staff-dashboard/MyScheduleView';
import { MyAvailabilityView } from './components/staff-dashboard/MyAvailabilityView';
import { MySwapsView } from './components/staff-dashboard/MySwapsView';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, loading, isAuthenticated, isManager, isStaff } = useAuth();

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole === 'manager' && !isManager) {
    return <Navigate to="/my-schedule" replace />;
  }

  if (requiredRole === 'staff' && !isStaff) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default function App() {
  const { user, loading, isAuthenticated, isManager, isStaff } = useAuth();

  if (loading && isAuthenticated) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Toast />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />

          {/* Manager Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requiredRole="manager">
                <MainLayout>
                  <ScheduleView />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/staff"
            element={
              <ProtectedRoute requiredRole="manager">
                <MainLayout>
                  <StaffView />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/swaps"
            element={
              <ProtectedRoute requiredRole="manager">
                <MainLayout>
                  <SwapRequestsView />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/audit"
            element={
              <ProtectedRoute requiredRole="manager">
                <MainLayout>
                  <AuditLogView />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Staff Dashboard */}
          <Route
            path="/my-schedule"
            element={
              <ProtectedRoute requiredRole="staff">
                <MainLayout>
                  <MyScheduleView />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-schedule/availability"
            element={
              <ProtectedRoute requiredRole="staff">
                <MainLayout>
                  <MyAvailabilityView />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-schedule/swaps"
            element={
              <ProtectedRoute requiredRole="staff">
                <MainLayout>
                  <MySwapsView />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Redirect Root */}
          <Route
            path="/"
            element={
              isAuthenticated ? (
                isManager ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <Navigate to="/my-schedule" replace />
                )
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}
