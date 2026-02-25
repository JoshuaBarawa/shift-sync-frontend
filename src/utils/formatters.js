export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const formatStatus = (status) => {
  const statusMap = {
    draft: 'Draft',
    published: 'Published',
    cancelled: 'Cancelled',
    completed: 'Completed',
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
  };
  return statusMap[status] || status;
};

export const getStatusColor = (status) => {
  const colorMap = {
    draft: '#64748b',
    published: '#10b981',
    cancelled: '#ef4444',
    completed: '#3b82f6',
    pending: '#f59e0b',
    approved: '#10b981',
    rejected: '#ef4444',
    premium: '#f59e0b',
  };
  return colorMap[status] || '#6b7280';
};

export const getStatusBgColor = (status) => {
  const colorMap = {
    draft: '#f1f5f9',
    published: '#ecfdf5',
    cancelled: '#fef2f2',
    completed: '#eff6ff',
    pending: '#fffbeb',
    approved: '#ecfdf5',
    rejected: '#fef2f2',
    premium: '#fffbeb',
  };
  return colorMap[status] || '#f3f4f6';
};

export const formatNumber = (num, decimals = 0) => {
  return parseFloat(num).toFixed(decimals);
};

export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
};

export const formatInitials = (firstName, lastName) => {
  return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
};

export const formatStaffName = (staff) => {
  if (!staff) return 'Unknown';
  return `${staff.firstName} ${staff.lastName}`;
};

export const formatLocation = (location) => {
  if (typeof location === 'string') return location;
  if (location?.name) return location.name;
  return 'Unknown Location';
};

export const formatSkill = (skill) => {
  if (typeof skill === 'string') return skill;
  if (skill?.name) return skill.name;
  return 'Unknown Skill';
};

export const formatHours = (hours) => {
  if (hours < 1) {
    const minutes = Math.round(hours * 60);
    return `${minutes}m`;
  }
  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);
  if (minutes === 0) return `${wholeHours}h`;
  return `${wholeHours}h ${minutes}m`;
};

export const truncateText = (text, length = 50) => {
  if (!text) return '';
  return text.length > length ? `${text.slice(0, length)}...` : text;
};

export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};
