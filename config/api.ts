// API Configuration
export const API_CONFIG = {
  // Base URLs
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  
  VERSION: 'v1',

  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      LOGOUT: '/auth/logout',
      REFRESH: '/auth/refresh',
      FORGOT_PASSWORD: '/auth/forgot-password',
      RESET_PASSWORD: '/auth/reset-password',
      VERIFY_OTP: '/auth/verify-otp',
      RESEND_OTP: '/auth/resend-otp',
      ME: '/auth/me',
      CHANGE_PASSWORD: '/auth/change-password',
      VERIFY_EMAIL: '/auth/verify-email',
    },
    
    // User endpoints
    USERS: {
      BASE: '/users',
      SEARCH: '/users/search',
      BY_DEPARTMENT: (departmentId: string) => `/users/department/${departmentId}`,
      BY_ID: (userId: string) => `/users/${userId}`,
      ME: '/users/me',
      AVATAR: (userId: string) => `/users/${userId}/avatar`,
      TOGGLE_STATUS: (userId: string) => `/users/${userId}/toggle-status`,
      ROLE: (userId: string) => `/users/${userId}/role`,
    },
    
    // Timekeeping endpoints
    TIMEKEEPING: {
      TIMESHEETS: '/timekeeping/timesheets',
      TIMESHEET_BY_ID: (timesheetId: string) => `/timekeeping/timesheets/${timesheetId}`,
      TIMESHEET_BY_DATE: (date: string) => `/timekeeping/timesheets/date/${date}`,
      CHECK_IN: '/timekeeping/check-in',
      CHECK_OUT: '/timekeeping/check-out',
      STATS: '/timekeeping/stats',
      LEAVE_REQUESTS: '/timekeeping/leave-requests',
      LEAVE_REQUEST_BY_ID: (requestId: string) => `/timekeeping/leave-requests/${requestId}`,
      PENDING_LEAVE_REQUESTS: '/timekeeping/leave-requests/pending',
      REVIEW_LEAVE_REQUEST: (requestId: string) => `/timekeeping/leave-requests/${requestId}/review`,
      CANCEL_LEAVE_REQUEST: (requestId: string) => `/timekeeping/leave-requests/${requestId}/cancel`,
      LEAVE_REQUEST_STATS: '/timekeeping/leave-requests/stats',
    },
    
    // Project endpoints
    PROJECTS: {
      BASE: '/projects',
      BY_ID: (projectId: string) => `/projects/${projectId}`,
      MY_PROJECTS: '/projects/my-projects',
      MEMBERS: (projectId: string) => `/projects/${projectId}/members`,
      MEMBER_BY_ID: (projectId: string, userId: string) => `/projects/${projectId}/members/${userId}`,
      TASKS: (projectId: string) => `/projects/${projectId}/tasks`,
      STATS: (projectId: string) => `/projects/${projectId}/stats`,
    },
    
    // Task endpoints
    TASKS: {
      BY_ID: (taskId: string) => `/tasks/${taskId}`,
      MY_TASKS: '/tasks/my-tasks',
      STATUS: (taskId: string) => `/tasks/${taskId}/status`,
      MY_STATS: '/tasks/my-stats',
    },
    
    // Company endpoints
    COMPANY: {
      INFO: '/company/info',
      LOGO: '/company/logo',
      STATS: '/company/stats',
      ORG_CHART: '/company/org-chart',
      DEPARTMENTS: '/company/departments',
      DEPARTMENT_BY_ID: (departmentId: string) => `/company/departments/${departmentId}`,
      DEPARTMENT_EMPLOYEES: (departmentId: string) => `/company/departments/${departmentId}/employees`,
      DEPARTMENT_STATS: (departmentId: string) => `/company/departments/${departmentId}/stats`,
      EMPLOYEES: '/company/employees',
      EMPLOYEE_BY_ID: (employeeId: string) => `/company/employees/${employeeId}`,
      EMPLOYEE_SEARCH: '/company/employees/search',
      TOGGLE_EMPLOYEE_STATUS: (employeeId: string) => `/company/employees/${employeeId}/toggle-status`,
      TRANSFER_EMPLOYEE: (employeeId: string) => `/company/employees/${employeeId}/transfer`,
    },
  },
  
  // Request timeouts
  TIMEOUTS: {
    DEFAULT: 10000, // 10 seconds
    UPLOAD: 30000,  // 30 seconds
    DOWNLOAD: 60000, // 60 seconds
  },
  
  // Retry configuration
  RETRY: {
    MAX_ATTEMPTS: 3,
    DELAY: 1000, // 1 second
  },
  
  // Pagination defaults
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100,
  },
};

// Helper function to build full API URL
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function to build paginated query params
export const buildPaginationParams = (page: number = 1, limit: number = 10, additionalParams: Record<string, string | number | boolean> = {}) => {
  const params = new URLSearchParams({
    page: Math.max(1, page).toString(),
    limit: Math.min(Math.max(1, limit), API_CONFIG.PAGINATION.MAX_LIMIT).toString(),
    ...additionalParams,
  });
  
  return params.toString();
};

export default API_CONFIG;
