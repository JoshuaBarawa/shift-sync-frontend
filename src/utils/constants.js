export const SHIFT_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
};

export const SWAP_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled',
};

export const SWAP_TYPE = {
  SWAP: 'swap',
  DROP: 'drop',
};

export const USER_ROLE = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  STAFF: 'staff',
};

export const NOTIFICATION_TYPE = {
  SHIFT_PUBLISHED: 'shift_published',
  SWAP_REQUEST: 'swap_request',
  SWAP_APPROVED: 'swap_approved',
  SWAP_REJECTED: 'swap_rejected',
  SHIFT_CANCELLED: 'shift_cancelled',
  STAFF_ASSIGNED: 'staff_assigned',
  SHIFT_UPDATED: 'shift_updated',
};

export const COLORS = {
  PRIMARY: '#1e2a4a',
  ACCENT: '#f59e0b',
  BG_LIGHT: '#f8fafc',
  SUCCESS: '#10b981',
  ERROR: '#ef4444',
  WARNING: '#f59e0b',
  INFO: '#3b82f6',
};

export const STATUS_COLORS = {
  draft: '#64748b',
  published: '#10b981',
  cancelled: '#ef4444',
  pending: '#f59e0b',
  approved: '#10b981',
  rejected: '#ef4444',
  premium: '#f59e0b',
};

export const AVAILABILITY_HOURS = [
  '00:00', '01:00', '02:00', '03:00', '04:00', '05:00',
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
  '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00', '21:00', '22:00', '23:00',
];

export const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export const DAYS_OF_WEEK_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const API_ENDPOINTS = {
  AUTH_LOGIN: '/auth/login',
  AUTH_ME: '/auth/me',
  SHIFTS_LIST: '/shifts',
  SHIFTS_DETAIL: '/shifts/:id',
  STAFF_LIST: '/staff',
  STAFF_DETAIL: '/staff/:id',
  SWAPS_LIST: '/swaps',
  SWAPS_DETAIL: '/swaps/:id',
  NOTIFICATIONS_LIST: '/notifications',
  AUDIT_LOG: '/audit',
};

export const EMPTY_STATES = {
  NO_SHIFTS: 'No shifts found for this week',
  NO_STAFF: 'No staff members available',
  NO_SWAPS: 'No swap requests',
  NO_NOTIFICATIONS: 'No notifications',
};

export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PASSWORD: 'Password must be at least 8 characters with uppercase, lowercase, and number',
  INVALID_TIME: 'Please enter a valid time (HH:MM)',
  INVALID_TIME_RANGE: 'End time must be after start time',
  NETWORK_ERROR: 'Network error. Please try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'You are not authorized to perform this action',
  NOT_FOUND: 'Resource not found',
  CONFLICT: 'Resource already exists or conflict detected',
};

export const SUCCESS_MESSAGES = {
  SHIFT_CREATED: 'Shift created successfully',
  SHIFT_UPDATED: 'Shift updated successfully',
  SHIFT_PUBLISHED: 'Shift published successfully',
  SHIFT_CANCELLED: 'Shift cancelled successfully',
  STAFF_ASSIGNED: 'Staff assigned successfully',
  SWAP_APPROVED: 'Swap request approved',
  SWAP_REJECTED: 'Swap request rejected',
  SWAP_CREATED: 'Swap request created',
  AVAILABILITY_UPDATED: 'Availability updated successfully',
};
