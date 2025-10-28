import { LucideIcon } from 'lucide-react';
import { REQUEST_STATUS } from "./enums";

export interface Module {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  color: string;
  path: string;
  allowedRoles?: string[];
}

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  user_information?: {
    id: number;
    user_id: number;
    email: string;
    personal_email: string;
    nationality: string;
    name: string;
    code: string;
    avatar: string;
    gender: string;
    marital: string;
    birthday: string;
    position_id: number;
    office_id: number;
    address: string;
    temp_address: string;
    phone: string;
    tax_code: string;
    role_id: number;
    status: string;
    description: string;
    level_id: number;
    note: string;
    overview: string;
    expertise: string;
    technique: string;
    main_task: string;
    language_id: number;
    position?: {
      id: number;
      name: string;
    };
    role?: {
      id: number;
      name: string;
    };
    level?: {
      id: number;
      name: string;
    };
    language?: {
      id: number;
      name: string;
    };
  } | null;
  join_date: string | null;
  today_attendance: {
    checkin: string | null;
    checkout: string | null;
    total_work_time: number;
    status: string | null;
    late_time: number;
    early_time: number;
    is_complete: boolean;
    has_attendance: boolean;
  };
  remaining_leave_days: number;
  assigned_devices: unknown[];
  annual_leave_quota?: number;
}

export interface UserInformation {
  id: number;
  user_id: number;
  information_type: string;
  information_value: string;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: number;
  email: string;
  name: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  user_information?: {
    id: number;
    user_id: number;
    email: string;
    personal_email: string;
    nationality: string;
    name: string;
    code: string;
    avatar: string;
    gender: string;
    marital: string;
    birthday: string;
    position_id: number;
    office_id: number;
    address: string;
    temp_address: string;
    phone: string;
    tax_code: string;
    role_id: number;
    status: string;
    description: string;
    level_id: number;
    note: string;
    overview: string;
    expertise: string;
    technique: string;
    main_task: string;
    language_id: number;
    position?: {
      id: number;
      name: string;
    };
    role?: {
      id: number;
      name: string;
    };
    level?: {
      id: number;
      name: string;
    };
    language?: {
      id: number;
      name: string;
    };
  } | null;
  education?: Array<{
    id: number;
    user_id: number;
    name: string;
    major: string;
    start_date: string;
    end_date: string;
  }>;
  experience?: Array<{
    id: number;
    user_id: number;
    company: string;
    job_title: string;
    start_date: string;
    end_date: string;
  }>;
  user_certificates?: Array<{
    id: number;
    user_id: number;
    certificate_id: number;
    issued_at: string;
    start_date: string;
  }>;
  user_skills?: Array<{
    id: number;
    user_id: number;
    skill_id: number;
    experience: number;
    months_experience: number;
    is_main: boolean;
    skill: {
      id: number;
      name: string;
      position?: {
        id: number;
        name: string;
      };
    };
  }>;
  assigned_devices?: Array<{
    id: number;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
  }>;
  annual_leave_quota?: number;
  remaining_leave_days?: number;
  join_date?: string;
  today_attendance?: {
    checkin: string | null;
    checkout: string | null;
    total_work_time: number;
    status: string | null;
    late_time: number;
    early_time: number;
    is_complete: boolean;
    has_attendance: boolean;
  };
}

export interface Account {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
  avatar?: string;
  phone?: string;
  department?: string;
  position?: string;
  joinDate?: string;
}

export interface Division {
  id: string;
  name: string;
  description: string;
  employeeCount: number;
  manager?: string;
  status: "active" | "inactive";
  createdAt: string;
}

export interface Asset {
  id: string;
  code: string;
  name: string;
  description?: string;
  status: "available" | "in_use" | "maintenance" | "disposed";
  category?: string;
  price?: number;
  warehouse?: string;
  importDate?: string;
  user?: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface AssetRequest {
  id: string;
  assetId: string;
  asset?: Asset;
  userId: string;
  userName?: string;
  userAvatar?: string;
  reason: string;
  status: REQUEST_STATUS;
  requestedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}