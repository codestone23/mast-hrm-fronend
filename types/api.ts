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
    current_page: number;
    total_pages: number;
    total: number;
    limit: number;
  };
}

// Division types
export enum DivisionTypeEnum {
  TECHNICAL = 'TECHNICAL',
  BUSINESS = 'BUSINESS',
  OPERATIONS = 'OPERATIONS',
  OTHER = 'OTHER',
}

export enum DivisionStatusEnum {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export interface DivisionListItem {
  id: number;
  name: string;
  head_id: number | null;
  is_active_project: boolean;
  type: DivisionTypeEnum | string;
  status: DivisionStatusEnum | string;
  level: number;
  address: string | null;
  parent_id: number | null;
  founding_at: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  parent?: {
    id: number;
    name: string;
  } | null;
  children?: Array<{ id: number; name: string }>;
  _count?: { user_division: number; projects: number };
  member_count?: number;
  project_count?: number;
}

export interface DivisionListParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: DivisionTypeEnum | string;
  status?: DivisionStatusEnum | string;
}

export interface CreateDivisionRequest {
  name: string;
  type: DivisionTypeEnum | string;
  parent_id?: number | null;
  description?: string;
}

export interface UpdateDivisionRequest extends CreateDivisionRequest {
  status?: DivisionStatusEnum | string;
}

export type DivisionDetail = DivisionListItem;

export interface DivisionUserAssignmentItem {
  id: number;
  name: string;
  email: string;
  userId: number;
  divisionId: number;
  role_id: number | null;
  teamId: number | null;
  description: string | null;
  user: {
    id: number;
    name: string;
    email: string;
    user_information: {
      name: string;
      code: string;
      avatar: string | null;
    };
  };
  division?: { id: number; name: string };
  created_at: string;
}

export interface PaginatedMeta {
  total: number;
  current_page: number;
  limit: number;
  total_pages: number;
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
  email: string;
  otp: string;
  newPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
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
  requests: {
    request_type: string;
  }[];
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

export interface WorkingEntryData {
  user_id: number;
  name: string;
  email: string;
  avatar: string;
  position: string;
  checkin_time: string;
  checkout_time: string;
  status: string;
  duration: string;
}

export interface LeaveEntryData {
  user_id: number;
  name: string;
  email: string;
  avatar: string;
  position: string;
  leave_type: string;
  reason: string;
  start_date: string;
  end_date: string;
  status: string;
  duration: string;
}

export interface LateEntryData {
  user_id: number;
  name: string;
  email: string;
  avatar: string;
  position: string;
  checkin_time: string;
  late_minutes: number;
  status: string;
  duration: string;
}

export interface WorkInfoData {
  division: {
    id: number;
    name: string;
  };
  work_date: string;
  working_info: {
    total_members: number;
    working_count: number;
    work_date: string;
    employees: WorkingEntryData[];
  };
  leave_requests: {
    paid_leave_count: number;
    unpaid_leave_count: number;
    employees: LeaveEntryData[];
  };
  late_info: {
    late_count: number;
    minutes: number;
    employees: LateEntryData[];
  };
}

export interface BirthdayEmployeeData {
  division: {
    id: number;
    name: string;
  };  
  month: number;
  employees: {
    user_id: number;
    name: string;
    email: string;
    avatar: string;
    birthday: string;
    days_until_birthday: number;
  }[];
}

export interface WorkStatisticData {
  division: {
    id: number;
    name: string;
  };
  year: number;
  attendance_stats: {
    month: number;
    late_hours: number;
    actual_late_hours: number;
    overtime_hours: number;
  }[];
}

export interface DivisionMemberData {
  user_id: number,
  code: string,
  name: string,
  email: string,
  avatar: string,
  birthday: string,
  team: string,
  team_id: number,
  join_date: string,
  months_of_service: number,
  position: string,
  position_id: number,
  skills: string,
  level: string,
  level_id: number,
  coefficient: number
}

export interface DivisionTeamData {
  id: number,
  name: string,
  division_id: number,
  manager: {
    id: number,
    name: string,
    email: string,
    avatar: string
  },
  member_count: number,
  resource_by_level: {
    additionalProp1: 0,
    additionalProp2: 0,
    additionalProp3: 0
  },
  active_projects: string,
  founding_date: string,
  created_at: string
}

export interface DivisionTeamDetailData {
  id: number,
  name: string,
  division_id: number,
  manager: {
    id: number,
    name: string,
    email: string,
    avatar: string
  },
  member_count: number,
  resource_by_level: {
    [level: string]: number
  },
  active_projects: {
    id: number,
    name: string
  }[],
  founding_date: string,
  created_at: string,
  updated_at: string
}

export interface DivisionTeamCreateRequest {
  divisionId: number,
  managerId: number,
  name: string,
  foundingDate: string
}

export interface DivisionTeamUpdateRequest {
  managerId: number,
  name: string,
  foundingDate: string
}

// News types
export enum NewsStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export interface NewsAuthor {
  id: number;
  email: string;
  user_information: {
    name: string;
    avatar: string;
  };
}

export interface News {
  id: number;
  title: string;
  content: string;
  status: NewsStatus;
  author_id: number;
  reason?: string | null;
  reviewer_id?: number | null;
  reviewed_at?: string | null;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
  author?: NewsAuthor;
  reviewer?: NewsAuthor | null;
  authorName?: string;
  reviewerName?: string | null;
}

export interface CreateNewsRequest {
  title: string;
  content: string;
}

export interface UpdateNewsRequest {
  title?: string;
  content?: string;
}

export interface ReviewNewsRequest {
  status: NewsStatus.APPROVED | NewsStatus.REJECTED;
  reason?: string;
}

// Notification types
export interface Notification {
  id: number;
  title: string;
  description: string;
  id_new?: number | null;
  created_at: string;
}