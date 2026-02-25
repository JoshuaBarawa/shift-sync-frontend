# Endpoint Updates Summary

All API endpoints have been updated to match your NestJS backend specification. Here's what was changed:

## Services Updated

### 1. **authService.js**
- No changes needed - already using correct endpoints:
  - `POST /auth/login`
  - `GET /auth/me`

### 2. **shiftsService.js** 
- Changed `PUT` to `PATCH` for updateShift: `PATCH /shifts/:id`
- Changed cancelShift to use `DELETE /shifts/:id` instead of POST
- Renamed `assignStaff` parameter from `staffId` to `userId`
- Renamed `unassignStaff` to use `DELETE /shifts/:id/assign/:userId`
- Changed `getAvailableStaff` to `getQualifiedStaff`: `GET /shifts/:id/qualified-staff`
- Added `getWeeklyHours`: `GET /shifts/hours/weekly?userId=X&weekStartDate=Y`

### 3. **staffService.js**
- Changed `getAllStaff` to use `/users` endpoint
- Removed unused methods (getStaffDetails, updateStaff, getSchedule, getQualifiedStaff)
- Added `getLocations`: `GET /locations`
- Updated availability endpoints to use `/availability/users/:userId` format

### 4. **swapsService.js**
- Added `acceptSwap`: `POST /swaps/:id/accept` (staff B accepts)
- Added `declineSwap`: `POST /swaps/:id/decline` (staff B declines with reason)
- Added `pickupDrop`: `POST /swaps/:id/pickup` (staff B picks up drop)
- Kept existing: createSwap, cancelSwap, approveSwap (manager), rejectSwap (manager)

### 5. **notificationsService.js**
- Changed `getUnreadNotifications` to `getUnreadCount`: `GET /notifications/unread-count`
- Changed mark as read from `PUT` to `PATCH`: `PATCH /notifications/:id/read`
- Changed markAllAsRead endpoint: `PATCH /notifications/read-all`
- Removed deleteNotification method

### 6. **auditService.js**
- Simplified to just two methods:
  - `getAuditLogs`: `GET /audit/logs`
  - `getShiftAudit`: `GET /audit/shifts/:id`

## Components Updated

### Manager Dashboard
- **ScheduleView.jsx**: Updated to use `getAllShifts()` with `locationId` filter
- **ShiftDetailModal.jsx**: Updated to use `getQualifiedStaff()`, changed `staffId` to `userId`
- **AuditLogView.jsx**: Updated to use `getAuditLogs()` with date range params

### Staff Dashboard
- **MyScheduleView.jsx**: Updated to use `shiftsService.getAllShifts()` with `userId` filter
- **MySwapsView.jsx**: Added mutations for `acceptSwap`, `declineSwap`, `pickupDrop`
- **SwapRequestModal.jsx**: Already correct, creates swaps with proper data structure

## Hooks Updated

### useShifts.js
- Changed assignStaff/unassignStaff to use `userId` instead of `staffId`
- Added getQualifiedStaff mutation

## Important Notes

1. All `staffId` parameters have been renamed to `userId` to match backend spec
2. HTTP methods have been updated to match (PUT → PATCH, POST → DELETE where applicable)
3. Endpoint paths now match exactly with backend specification
4. Parameter names in query strings match backend requirements

## Testing Recommendations

1. Test login flow and token persistence
2. Test shift creation, publishing, and assignment
3. Test swap/drop request creation and responses (accept/decline/pickup)
4. Test manager approval/rejection of swaps
5. Test notifications and audit logs
6. Verify availability management for staff

All 404 errors should now be resolved!
