/**
 * Format a Date object to YYYY-MM-DD string using local timezone
 * This avoids timezone issues that occur with toISOString()
 */
export const formatDateForAPI = (date: Date | null): string => {
  if (!date) return "";

  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  return `${year}-${month}-${day}`;
};

/**
 * Format a Date object to DD/MM/YYYY string using local timezone
 * This is for display purposes
 */
export const formatDateForDisplay = (date: Date | null): string => {
  if (!date) return "";

  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  return `${day}/${month}/${year}`;
};

/**
 * Parse a YYYY-MM-DD string to Date object
 * This ensures consistent date parsing across the app
 */
export const parseDateFromAPI = (
  dateString: string | null | undefined
): Date | null => {
  if (!dateString) return null;

  // Split the date string and create a new Date object
  // This avoids timezone issues
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
};

/**
 * Parse a DD/MM/YYYY string to Date object
 * This is for parsing display format dates
 */
export const parseDateFromDisplay = (
  dateString: string | null | undefined
): Date | null => {
  if (!dateString) return null;

  // Split the date string and create a new Date object
  // This avoids timezone issues
  const [day, month, year] = dateString.split("/").map(Number);
  return new Date(year, month - 1, day);
};

export const formatDateForApi = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toISOString().split('T')[0]; // YYYY-MM-DD format
};

// Helper function to format datetime for API
export const formatDateTimeForApi = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toISOString(); // ISO 8601 format
};

// Helper function to parse API date
export const parseApiDate = (dateString: string): Date => {
  return new Date(dateString);
};
// Extract time from datetime string (e.g., "1970-01-01 09:01:00" -> "09:01")
export const extractTimeFromDateTime = (dateTimeString: string | null | undefined): string => {
  if (!dateTimeString) return '';
  try {
    // Handle format: "1970-01-01 09:01:00", "09:01:00", or "09:01"
    const timePart = dateTimeString.includes(' ') 
      ? dateTimeString.split(' ')[1]
      : dateTimeString;
    // Return HH:mm format
    return timePart.substring(0, 5);
  } catch (error) {
    return '';
  }
};