export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  // At least 8 characters, one uppercase, one lowercase, one number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};

export const validatePhoneNumber = (phone) => {
  const phoneRegex = /^(\+1)?[-.\s]?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}$/;
  return phoneRegex.test(phone);
};

export const validateTimeRange = (startTime, endTime) => {
  if (!startTime || !endTime) return false;
  
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);
  
  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;
  
  return endMinutes > startMinutes;
};

export const validateTimeFormat = (time) => {
  const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
};

export const validateDateFormat = (date) => {
  const dateObj = new Date(date);
  return dateObj instanceof Date && !isNaN(dateObj);
};

export const validateHeadcount = (headcount) => {
  const count = parseInt(headcount, 10);
  return !isNaN(count) && count > 0 && count <= 50;
};

export const validateFieldsNotEmpty = (fields) => {
  return Object.values(fields).every((field) => {
    if (typeof field === 'string') {
      return field.trim() !== '';
    }
    return field !== null && field !== undefined;
  });
};

export const validateFileSize = (file, maxSizeMB = 5) => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

export const validateFileType = (file, allowedTypes = ['image/jpeg', 'image/png', 'image/gif']) => {
  return allowedTypes.includes(file.type);
};

export const formatValidationError = (error) => {
  if (typeof error === 'string') return error;
  if (error?.message) return error.message;
  if (error?.response?.data?.message) return error.response.data.message;
  return 'An error occurred';
};

export const getFieldError = (errors, fieldName) => {
  const keys = fieldName.split('.');
  let error = errors;
  for (const key of keys) {
    if (error?.[key]) {
      error = error[key];
    } else {
      return null;
    }
  }
  return error?.message || error;
};

export const validateTimeWithinRange = (time, startTime, endTime) => {
  const [hour, min] = time.split(':').map(Number);
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);
  
  const timeMinutes = hour * 60 + min;
  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;
  
  return timeMinutes >= startMinutes && timeMinutes <= endMinutes;
};
