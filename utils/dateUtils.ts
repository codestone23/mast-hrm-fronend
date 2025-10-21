/**
 * Format a Date object to YYYY-MM-DD string using local timezone
 * This avoids timezone issues that occur with toISOString()
 */
export const formatDateForAPI = (date: Date | null): string => {
  if (!date) return '';
  
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

/**
 * Parse a YYYY-MM-DD string to Date object
 * This ensures consistent date parsing across the app
 */
export const parseDateFromAPI = (dateString: string | null | undefined): Date | null => {
  if (!dateString) return null;
  
  // Split the date string and create a new Date object
  // This avoids timezone issues
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
};
