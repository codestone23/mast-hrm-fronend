import { UserProfile } from "@/constants/types";
import { UpdateProfileData } from "@/hooks/useProfileMutation";
import axiosInstance from "@/lib/axios";

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

export interface ImageUpdate {
  file_type: string;
  folder: string;
}

export interface PresignedUrlResponse {
  upload_url: string;
  public_id: string;
  signature: string;
  timestamp: number;
  api_key: string;
  folder: string;
  transformation?: string;
  expires_at: string;
}

export interface PositionsResponse {
  data: Position[];
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    total_pages: number;
    has_next_page: boolean;
    has_prev_page: boolean;
  };
}

class ProfileService {
  async getProfile(): Promise<UserProfile> {
    const response = await axiosInstance.get('user-profile');
    return response.data;
  }

  async updateProfile(profileData: UpdateProfileData): Promise<UserProfile> {
    const response = await axiosInstance.patch('user-profile/information', profileData);
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
  
  async getPositions(page: number = 1, search?: string): Promise<PositionsResponse> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', '5');
    if (search) {
      params.append('search', search);
    }
    
    const response = await axiosInstance.get(`user-profile/references/positions?${params.toString()}`);
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

  async getPresignedUrl(data: ImageUpdate): Promise<PresignedUrlResponse> {
    const response = await axiosInstance.post('upload/presigned-url', data);
    return response.data;
  }

  async uploadAvatarFile(file: File): Promise<string> {
    try {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Loại file không được hỗ trợ. Chỉ chấp nhận: JPEG, JPG, PNG, WEBP');
      }

      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        throw new Error('Kích thước file quá lớn. Tối đa 5MB');
      }

      const presignedData = await this.getPresignedUrl({
        file_type: file.type,
        folder: 'avatars',
      });

      const formData = new FormData();
      formData.append('file', file);
      formData.append('public_id', presignedData.public_id);
      formData.append('signature', presignedData.signature);
      formData.append('timestamp', presignedData.timestamp.toString());
      formData.append('api_key', presignedData.api_key);
      formData.append('folder', presignedData.folder);
      if (presignedData.transformation) {
        formData.append('transformation', presignedData.transformation);
      }

      const uploadResponse = await fetch(presignedData.upload_url, {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        throw new Error(`Upload thất bại: ${uploadResponse.status} - ${errorText}`);
      }

      const uploadResult = await uploadResponse.json();

      // 3. Update avatar URL
      await this.updateAvatar({ avatar_url: uploadResult.secure_url });

      return uploadResult.secure_url;
    } catch (error) {
      console.error('Lỗi upload avatar:', error);
      throw error;
    }
  }
}

export const profileService = new ProfileService();
export default profileService;