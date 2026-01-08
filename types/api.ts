import { DivisionStatus, DivisionType, ROLE_NAMES, USER_STATUS } from "@/constants/enums";

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
    totalPages: number;
    total: number;
    limit: number;
    total_pages: number;
    current_page: number;
  };
}

// Division types
export enum DivisionTypeEnum {
  TECHNICAL = 'TECHNICAL',
  BUSINESS = 'BUSINESS',
  OPERATIONS = 'OPERATIONS',
  OTHER = 'OTHER',
}

export interface DivisionListItem {
  id: number;
  name: string;
  head_id: number | null;
  is_active_project: boolean;
  type: DivisionTypeEnum | string;
  status: DivisionStatus;
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
  status?: DivisionStatus;
}

export interface CreateDivisionRequest {
  name: string;
  type: DivisionType;
  parent_id?: number | null;
  description?: string;
  leader_id?: number | null;
}

export interface UpdateDivisionRequest extends CreateDivisionRequest {
  status?: DivisionStatus;
}

export type DivisionDetail = DivisionListItem;

export interface DivisionUserAssignmentItem {
  id: number;
  user_id: number;
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
  user_embeddings?: {
    id: number;
    image_url: string;
    public_id: string;
    embedding: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    user_id: number;
  }
  user_information?: {
    id: number;
    user_id: number;
    personal_email: string | null;
    nationality: string | null;
    name: string;
    code: string | null;
    avatar: string | null;
    gender: string | null;
    marital: string | null;
    birthday: string | null;
    position_id: number | null;
    address: string | null;
    temp_address: string | null;
    phone: string | null;
    tax_code: string | null;
    level_id: number | null;
    expertise: string | null;
    language_id: number | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
  };
  user_role_assignments?: UserRoleAssignment[];
  user_division?: {
    division: {
      id: number;
      name: string;
      description: string;
      created_at: string;
      updated_at: string;
      deleted_at: string | null;
      status: DivisionStatus;
      type: DivisionTypeEnum;
    };
    team: {
      id: number;
      name: string;
    };
  };
  status?: string;
  organization?: {
    division: {
      id: number;
      name: string;
      description: string;
      status: string;
      type: string;
      division_head: {
          id: number;
          email: string;
          name: string;
          avatar: string;
          phone: string;
      };  
    };
    team: {
        id: number;
        name: string;
        division_id: number | null;
        founding_date: string | null;
    };
  };
}

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  EMPLOYEE = 'employee',
  HR = 'hr'
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  status?: USER_STATUS;
}

// Role types
export enum ScopeType {
  COMPANY = 'COMPANY',
  DIVISION = 'DIVISION',
  TEAM = 'TEAM',
  PROJECT = 'PROJECT'
}

export interface Role {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface UserRoleAssignment {
  role: {
    id: number;
    name: ROLE_NAMES;
  };
  role_name: ROLE_NAMES;
  scope_id: number | null;
  scope_type: ScopeType;
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
  coefficient: number,
  user_role_assignments: UserRoleAssignment[]
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
  founding_date: string | null,
  created_at: string,
  updated_at: string,
  deleted_at: string | null,
  division: {
    id: number,
    name: string
  },
  member_count: number,
  project_count: number,
  members: Array<{
    assignment_id: number,
    user_id: number,
    email: string,
    name: string,
    code: string,
    avatar: string | null,
    position: {
      id: number,
      name: string
    },
    level: {
      id: number,
      name: string,
      coefficient: number
    },
    role: {
      id: number,
      name: string
    },
    joined_at: string
  }>,
  projects: Array<{
    id: number,
    name: string
  }>
}

export interface DivisionTeamCreateRequest {
  divisionId: number,
  leaderId: number, 
  name: string,
  foundingDate: string
}

export interface DivisionTeamUpdateRequest {
  leaderId: number,
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
  approved_at?: string | null;
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
  content: string;
  news_id: number | null;
  created_by: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  read_at: string | null;
  creator?: {
    id: number;
    email: string;
    user_information: {
      name: string;
    };
  };
  news?: {
    id: number;
    title: string;
  } | null;
  creatorName?: string;
  newsTitle?: string | null;
  totalRecipients?: number;
  readCount?: number;
  // Legacy fields for backward compatibility
  description?: string;
  id_new?: number | null;
}

export interface CreateNotificationRequest {
  title: string;
  content: string;
}

export interface UpdateNotificationRequest {
  title?: string;
  content?: string;
}

export interface ReadNotificationRequest {
  is_read: boolean;
}

export interface NotificationListParams {
  page?: number;
  limit?: number;
  search?: string;
}

// Meeting Room types
export interface MeetingRoom {
  id: number;
  name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface Meeting {
  id: number;
  room_id: number;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  organizer: {
    id: number;
    user_information: {
      name: string;
    };
  }
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  room?: MeetingRoom;
}

export interface MeetingParams {
  page?: number;
  limit?: number;
  room_id?: number;
  from_date?: string;
  to_date?: string;
  is_active?: boolean;
}

export interface CreateRoomPayload {
  name: string;
  is_active: boolean;
}

export interface UpdateRoomPayload {
  name?: string;
  is_active?: boolean;
}

export interface CreateMeetingPayload {
  room_id: number;
  title: string;
  description: string;
  booking_date: string;
  start_hour: string;
  end_hour: string;
}

export interface UpdateMeetingPayload {
  room_id?: number;
  title?: string;
  description?: string;
  booking_date?: string;
  start_hour?: string;
  end_hour?: string;
}

// Daily Report types
export enum DailyReportStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export interface DailyReport {
  id: number;
  user_id: number;
  project_id: number;
  title: string;
  work_date: string;
  actual_time: number;
  status: DailyReportStatus;
  approved_by: number | null;
  approved_at: string | null;
  description: string;
  rejected_reason: string | null;
  created_at: string;
  updated_at: string;
  user: {
    user_information: {
      name: string;
    };
  };
  project: {
    name: string;
  };
}

export interface DailyReportCreateRequest {
  project_id: number;
  work_date: string;
  actual_time: number;
  title: string;
  description: string;
}

export interface DailyReportUpdateRequest {
  project_id: number;
  work_date: string;
  actual_time: number;
  title: string;
  description: string;
}

export interface DailyReportListParams {
  page?: number;
  limit?: number;
  start_date?: string;
  end_date?: string;
  user_id?: number;
  project_id?: number;
  status?: DailyReportStatus;
  division_id?: number;
  users_without_division?: boolean;
  division_head_only?: boolean;
}

// Holiday types
import { HolidayType, HolidayStatus } from "@/constants/enums";

export interface Holiday {
  id: number;
  name: string;
  type: HolidayType;
  status: HolidayStatus;
  start_date: string;
  end_date: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface HolidayCreateRequest {
  name: string;
  type: HolidayType;
  status: HolidayStatus;
  start_date: string;
  end_date: string;
  description?: string;
}

export interface HolidayUpdateRequest {
  name: string;
  type: HolidayType;
  status: HolidayStatus;
  start_date: string;
  end_date: string;
  description?: string;
}

export interface HolidayListParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: HolidayType;
  status?: HolidayStatus;
}

// Attendance Statistics types
export interface AttendanceStatistics {
  overview: {
    total_records: number;
    on_time_rate: string;
    late_rate: string;
    early_leave_rate: string;
    remote_rate: string;
    total_penalties: number;
  };
  daily_stats: Array<{
    period: string;
    total_records: number;
    total_work_hours: number;
    average_work_hours: number;
    total_late_count: number;
    total_early_count: number;
    attendance_rate: number;
  }>;
  violation_stats: Array<{
    user_id: number;
    total_violations: number;
    late_count: number;
    early_leave_count: number;
    total_penalties: number;
    total_late_minutes: number;
    total_early_minutes: number;
  }>;
  leave_stats: {
    total_leave_days: number;
    paid_leave: number;
    unpaid_leave: number;
    annual_leave: number;
    sick_leave: number;
    personal_leave: number;
  };
  period: {
    start_date: string;
    end_date: string;
  };
}

// Rotation Member types
export const RotationType = {
  PERMANENT: 'PERMANENT',
  TEMPORARY: 'TEMPORARY',
} as const;

export type RotationTypeValue = typeof RotationType[keyof typeof RotationType];

export interface CreateRotationMemberRequest {
  user_id: number;
  division_id: number;
  type: RotationTypeValue;
  date_rotation: string;
}

export interface RotationMemberListParams {
  division_id: number;
  page?: number;
  limit?: number;
  type?: RotationTypeValue;
  date_from?: string;
  date_to?: string;
}

export interface RotationMember {
  id: number;
  from_id: number;
  to_id: number;
  user_id: number;
  type: RotationTypeValue;
  date_rotation: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  user: {
    id: number;
    email: string;
    user_information: {
      name: string;
    };
  };
  to_division: {
    id: number;
    name: string;
  };
  from_division: {
    id: number;
    name: string;
  };
}

// Monthly Work Summary types
export interface LeaveSession {
  date: string;
  duration: string;
  type: string;
  status: string;
  reason: string;
}

export interface MonthlyWorkSummaryItem {
  user_id: number;
  user_name: string;
  user_email: string;
  user_code: string;
  division_name: string;
  team_name: string;
  position_name: string;
  total_work_days: number;
  expected_work_days: number;
  total_work_hours: number;
  total_leave_days: number;
  paid_leave_days: number;
  unpaid_leave_days: number;
  sick_leave_days: number;
  other_leave_days: number;
  leave_sessions: LeaveSession[];
  late_count: number;
  early_leave_count: number;
  total_late_minutes: number;
  total_early_minutes: number;
  remote_work_days: number;
  overtime_hours: number;
  overtime_days: number;
  absent_days: number;
  attendance_rate: number;
  on_time_rate: number;
  total_working_sessions: number;
  deducted_sessions: number;
  final_working_sessions: number;
  is_complete: boolean;
  locked_at: string | null;
}

export interface MonthlyWorkSummaryResponse {
  data: MonthlyWorkSummaryItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
  period: {
    month: string;
    year: number;
    total_work_days: number;
    total_holidays: number;
  };
  summary: {
    total_employees: number;
    average_work_days: number;
    average_attendance_rate: number;
  };
}

export interface DailyWorkSummary {
  user_id: number;
  user_name: string;
  daily_records: Array<{
    date: string;
    check_in: string | null;
    check_out: string | null;
    work_hours: number;
    status: string;
    is_late: boolean;
    is_early_leave: boolean;
    late_minutes: number;
    early_minutes: number;
  }>;
}