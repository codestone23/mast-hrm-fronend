import { UserProfile } from "@/constants/types";
import axiosInstance from "@/lib/axios";
import { ApiResponse } from "@/types/api";

export interface Education {
  id?: number;
  user_id?: number;
  name: string;
  major: string;
  description: string;
  start_date: string;
  end_date: string;
}

export interface Experience {
  id?: number;
  user_id?: number;
  job_title: string;
  company: string;
  start_date: string;
  end_date: string;
}

export interface Certificate {
  id?: number;
  user_id?: number;
  certificate_id: number;
  issued_at: string;
  start_date: string;
  name?: string;
  authority?: string;
  type?: string;
}

export interface Skill {
  id?: number;
  user_id?: number;
  skill_id: number;
  experience: number;
  months_experience: number;
  is_main: boolean;
  skill?: {
    id: number;
    name: string;
  };
}

export interface Position {
  id: number;
  name: string;
  is_active_project: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface AvatarUpdate {
  avatar_url: string;
}

class ProfileService {
  async getProfile(): Promise<UserProfile> {
    const response = await axiosInstance.get('user-profile');
    return response.data;
  }

  async updateProfile(profileData: UserProfile): Promise<UserProfile> {
    const response = await axiosInstance.put('user-profile/information', profileData);
    return response.data;
  }

  async addEducation(data: Education): Promise<Education> {
    const response = await axiosInstance.post('user-profile/education', data);
    return response.data;
  }

  async updateEducation(data: Education): Promise<Education> {
    const response = await axiosInstance.patch('user-profile/education', data);
    return response.data;
  }

  async deleteEducation(id: string): Promise<void> {
    const response = await axiosInstance.delete('user-profile/education/' + id);
    return response.data;
  }

  async updateEducationById(id: string, data: Education): Promise<Education> {
    const response = await axiosInstance.patch('user-profile/education/' + id, data);
    return response.data;
  }

  async addExperience(data: Experience): Promise<Experience> {
    const response = await axiosInstance.post('user-profile/experience', data);
    return response.data;
  }

  async updateExperience(data: Experience): Promise<Experience> {
    const response = await axiosInstance.patch('user-profile/experience', data);
    return response.data;
  }
  
  async deleteExperience(id: string): Promise<void> {
    const response = await axiosInstance.delete('user-profile/experience/' + id);
    return response.data;
  }

  async updateExperienceById(id: string, data: Experience): Promise<Experience> {
    const response = await axiosInstance.patch('user-profile/experience/' + id, data);
    return response.data;
  } 

  async addCertificates(data: Certificate): Promise<Certificate> {
    const response = await axiosInstance.post('user-profile/certificates', data);
    return response.data;
  }

  async updateCertificates(data: Certificate): Promise<Certificate> {
    const response = await axiosInstance.patch('user-profile/certificates', data);
    return response.data;
  }
  
  async deleteCertificates(id: string): Promise<void> {
    const response = await axiosInstance.delete('user-profile/certificates/' + id);
    return response.data;
  }

  async updateCertificatesById(id: string, data: Certificate): Promise<Certificate> {
    const response = await axiosInstance.patch('user-profile/certificates/' + id, data);
    return response.data;
  }

  async addSkills(data: Skill): Promise<Skill> {
    const response = await axiosInstance.post('user-profile/skills', data);
    return response.data;
  }

  async updateSkills(data: Skill): Promise<Skill> {
    const response = await axiosInstance.patch('user-profile/skills', data);
    return response.data;
  }

  async deleteSkills(id: string): Promise<void> {
    const response = await axiosInstance.delete('user-profile/skills/' + id);
    return response.data;
  }

  async updateSkillsById(id: string, data: Skill): Promise<Skill> {
    const response = await axiosInstance.patch('user-profile/skills/' + id, data);
    return response.data;
  }

  async getSkillByPositionId(positionId: string): Promise<Skill[]> { 
    const response = await axiosInstance.get('user-profile/skills/position/' + positionId);
    return response.data;
  }
  
  async getPositions(): Promise<ApiResponse<Position[]>> {
    const response = await axiosInstance.get('user-profile/references/positions');
    return response.data;
  }

  async getPositionPaginated(): Promise<Position[]> {
    const response = await axiosInstance.get('user-profile/references/positions/paginated');
    return response.data;
  }

  async updateAvatar(data: AvatarUpdate): Promise<AvatarUpdate> {
    const response = await axiosInstance.patch('user-profile/avatar', data);
    return response.data;
  }
}

export const profileService = new ProfileService();
export default profileService;