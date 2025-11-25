import { LucideIcon } from 'lucide-react';
import { REQUEST_STATUS, AssetCategory, AssetStatus, DivisionStatus } from "./enums";

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
  role_assignments: Array<{
    id: number;
    name: string | null;
    scope_type: string;
    scope_id: number | null;
  }>;
  remaining_leave_days: number;
  assigned_devices: unknown[];
  annual_leave_quota?: number;
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
  organization: {
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
    } | null;
  };
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
  role_assignments: Array<{
    id: number;
    name: string | null;
    scope_type: string;
    scope_id: number | null;
  }>;
  division?: {
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
  organization: {
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
  roles: string[];
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
  status: DivisionStatus | string;
  createdAt: string;
}

export interface Asset {
  id: number | string;
  asset_code: string;
  name: string;
  description?: string;
  status: AssetStatus | string;
  category: AssetCategory | string;
  serial_number?: string;
  purchase_date?: string;
  purchase_price?: string | number;
  warranty_end_date?: string;
  location?: string;
  notes?: string;
  assigned_to?: number;
  assigned_date?: string;
  assigned_user?: {
    id: number;
    email: string;
    user_information: {
      name: string;
    };
  };
  createdAt?: string;
  updatedAt?: string;
  // Legacy fields for backward compatibility
  code?: string;
  price?: number;
  warehouse?: string;
  importDate?: string;
  user?: {
    id: string | number;
    name: string;
    avatar?: string;
  };
}

export interface AssetStatistics {
  assets: {
    total: number;
    available: number;
    assigned: number;
    maintenance: number;
    utilization_rate: number;
  };
  requests: {
    pending: number;
    approved: number;
  };
  categories: Array<{
    category: string;
    count: number;
  }>;
}

export interface AssetRequest {
  id: string | number;
  user_id: number;
  asset_id: number | string | null;
  request_type: "REQUEST" | "RETURN" | "MAINTENANCE";
  category: string;
  description: string;
  justification: string;
  expected_date: string;
  status: REQUEST_STATUS | string;
  approved_by: number | null;
  approved_at: string | null;
  rejection_reason: string | null;
  fulfilled_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  user?: {
    id: number;
    email: string;
    user_information: {
      name: string;
    };
  };
  asset?: {
    id: number;
    name: string;
    asset_code: string;
    status: string;
  } | null;
  approver?: {
    id: number;
    email: string;
    user_information: {
      name: string;
    };
  } | null;
  // Legacy fields for backward compatibility
  assetId?: string;
  userId?: string;
  userName?: string;
  userAvatar?: string;
  reason?: string;
  requestedAt?: string;
  reviewedAt?: string;
  reviewedBy?: string;
}