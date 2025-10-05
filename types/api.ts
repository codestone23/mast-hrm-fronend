// Base API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

// User types
export interface User {
  created_at: string; 
  deleted_at: string | null;
  email: string;
  email_verified_at: string;
  id: number;
  name: string;
  remember_token: string | null;
  updated_at: string;
  user_information: unknown[];
}

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  EMPLOYEE = 'employee',
  HR = 'hr'
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
  department?: string;
  position?: string;
}

// Timekeeping types
export interface TimeSheet {
  id: number;
  user_id: number;
  work_date: string;
  checkin: string | null;
  checkout: string | null;
  checkin_checkout: string | null;
  day_off_id: number | null;
  late_time: number;
  late_time_approved: number | null;
  early_time: number;
  is_complete: boolean;
  fines: number;
  group_id: number | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  type: string;
  work_time_morning: number;
  work_time_afternoon: number;
  status: string;
  request_type: string;
  request_late: number | null;
  request_early: number | null;
  paid_leave: number | null;
  unpaid_leave: number | null;
  remote: string;
  total_work_time: number | null;
  break_time: number | null;
}

export enum TimeSheetStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export interface TimeSheetRequest {
  date: string;
  checkIn?: string;
  checkOut?: string;
  workHours: number;
  overtimeHours: number;
  notes?: string;
}

// Leave Request types
export interface LeaveRequest {
  id: string;
  userId: string;
  type: LeaveType;
  title: string;
  startDate: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  reason: string;
  status: RequestStatus;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  comments?: string;
}

export enum LeaveType {
  ANNUAL_LEAVE = 'annual_leave',
  SICK_LEAVE = 'sick_leave',
  PERSONAL_LEAVE = 'personal_leave',
  REMOTE_WORK = 'remote_work',
  BUSINESS_TRIP = 'business_trip',
  OVERTIME = 'overtime'
}

export enum RequestStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export interface CreateLeaveRequest {
  type: LeaveType;
  title: string;
  startDate: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  reason: string;
}

// Project types
export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  startDate: string;
  endDate?: string;
  managerId: string;
  teamMembers: ProjectMember[];
  createdAt: string;
  updatedAt: string;
}

export enum ProjectStatus {
  PLANNING = 'planning',
  IN_PROGRESS = 'in_progress',
  ON_HOLD = 'on_hold',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum ProjectPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export interface ProjectMember {
  userId: string;
  role: string;
  joinedAt: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId: string;
  dueDate?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  REVIEW = 'review',
  DONE = 'done'
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

// Company types
export interface Department {
  id: string;
  name: string;
  description?: string;
  managerId?: string;
  employeeCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Employee {
  id: string;
  userId: string;
  employeeId: string;
  departmentId: string;
  position: string;
  salary?: number;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  user: User;
  department: Department;
}

// Error types
export interface ApiError {
  message: string;
  code?: string;
  field?: string;
  details?: unknown;
}

export interface CheckInData {
  location_type: string;
  gps_latitude: string;
  gps_longitude: string;
  ip_address: string;
  device_info: string;
  note: string;
  remote: string;
  image: File;
}

export interface CheckOutData {
  location_type: string;
  gps_latitude: string;
  gps_longitude: string;
  ip_address: string;
  device_info: string;
  note: string;
  image: File;
}

export interface RegisterFaceData {
  image: File;
}