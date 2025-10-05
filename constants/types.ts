import { LucideIcon } from 'lucide-react';

export interface Module {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  color: string;
  path: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  user_information: unknown[];
  join_date: string | null;
  today_attendance: {
    checkin: string | null;
    checkout: string | null;
    total_work_time: number;
    status: string | null;
  };
  remaining_leave_days: number;
  assigned_devices: unknown[];
}

export interface UserInformation {
  id: number;
  user_id: number;
  information_type: string;
  information_value: string;
  created_at: string;
  updated_at: string;
}
