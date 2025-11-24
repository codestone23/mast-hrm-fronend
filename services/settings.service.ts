import axiosInstance from "@/lib/axios";

// Types
export interface Skill {
  id?: number;
  name: string;
  position_id: number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  skill?: {
    id: number;
    name: string;
  };
  position?: {
    id: number;
    name: string;
  };
  _count?: {
    user_skills?: number;
    position_skills?: number;
  };
}

export interface Language {
  id?: number;
  name: string;
  code: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  _count?: {
    user_languages?: number;
  };
}

export interface Level {
  id?: number;
  name: string;
  level: number;
  description?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export interface Position {
  id?: number;
  name: string;
  level_id?: number;
  description?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  level?: {
    id: number;
    name: string;
  };
  _count?: {
    user_information?: number;
    skills?: number;
  };
}

export interface PaginationMeta {
  current_page?: number;
  page?: number;
  per_page?: number;
  limit?: number;
  total: number;
  total_pages?: number;
  has_next_page?: boolean;
  has_prev_page?: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

export interface ListParams {
  page?: number;
  limit?: number;
  per_page?: number;
  search?: string;
}

class SettingsService {
    // Skills
    async getSkills(params?: ListParams): Promise<PaginatedResponse<Skill>> {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());
        if (params?.per_page) queryParams.append('per_page', params.per_page.toString());
        if (params?.search) queryParams.append('search', params.search);
        
        const response = await axiosInstance.get(`/user-profile/skills?${queryParams.toString()}`);
        return response.data;
    }

    async getDetailSkill(skillId: string | number): Promise<{ data: Skill }> {
        const response = await axiosInstance.get(`/user-profile/skills/${skillId}`);
        return response.data;
    }

    async createSkill(skill: { name: string; position_id: number }): Promise<{ data: Skill }> {
        const response = await axiosInstance.post('/user-profile/skills', skill);
        return response.data;
    }

    async updateSkill(skillId: string | number, skill: { name: string; position_id: number }): Promise<{ data: Skill }> {
        const response = await axiosInstance.patch(`/user-profile/skills/${skillId}`, skill);
        return response.data;
    }

    async deleteSkill(skillId: string | number): Promise<void> {
        await axiosInstance.delete(`/user-profile/skills/${skillId}`);
    }

    // Languages
    async getLanguages(params?: ListParams): Promise<PaginatedResponse<Language>> {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());
        if (params?.per_page) queryParams.append('per_page', params.per_page.toString());
        if (params?.search) queryParams.append('search', params.search);
        
        const response = await axiosInstance.get(`/user-profile/languages?${queryParams.toString()}`);
        return response.data;
    }

    async getDetailLanguage(languageId: string | number): Promise<{ data: Language }> {
        const response = await axiosInstance.get(`/user-profile/languages/${languageId}`);
        return response.data;
    }

    async createLanguage(language: { name: string; code: string; description?: string }): Promise<{ data: Language }> {
        const response = await axiosInstance.post('/user-profile/languages', language);
        return response.data;
    }

    async updateLanguage(languageId: string | number, language: { name: string; code: string; description?: string }): Promise<{ data: Language }> {
        const response = await axiosInstance.patch(`/user-profile/languages/${languageId}`, language);
        return response.data;
    }

    async deleteLanguage(languageId: string | number): Promise<void> {
        await axiosInstance.delete(`/user-profile/languages/${languageId}`);
    }

    // Levels
    async getLevels(params?: ListParams): Promise<PaginatedResponse<Level>> {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());
        if (params?.per_page) queryParams.append('per_page', params.per_page.toString());
        if (params?.search) queryParams.append('search', params.search);
        
        const response = await axiosInstance.get(`/user-profile/levels?${queryParams.toString()}`);
        return response.data;
    }

    async getDetailLevel(levelId: string | number): Promise<{ data: Level }> {
        const response = await axiosInstance.get(`/user-profile/levels/${levelId}`);
        return response.data;
    }

    async createLevel(level: { name: string; level: number; description?: string }): Promise<{ data: Level }> {
        const response = await axiosInstance.post('/user-profile/levels', level);
        return response.data;
    }
    
    async updateLevel(levelId: string | number, level: { name: string; level: number; description?: string }): Promise<{ data: Level }> {
        const response = await axiosInstance.patch(`/user-profile/levels/${levelId}`, level);
        return response.data;
    }

    async deleteLevel(levelId: string | number): Promise<void> {
        await axiosInstance.delete(`/user-profile/levels/${levelId}`);
    }

    // Positions
    async getPositions(params?: ListParams): Promise<PaginatedResponse<Position>> {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());
        if (params?.per_page) queryParams.append('per_page', params.per_page.toString());
        if (params?.search) queryParams.append('search', params.search);
        
        const response = await axiosInstance.get(`/user-profile/positions?${queryParams.toString()}`);
        return response.data;
    }

    async getDetailPosition(positionId: string | number): Promise<{ data: Position }> {
        const response = await axiosInstance.get(`/user-profile/positions/${positionId}`);
        return response.data;
    }

    async createPosition(position: { name: string; level_id?: number; description?: string }): Promise<{ data: Position }> {
        const response = await axiosInstance.post('/user-profile/positions', position);
        return response.data;
    }

    async updatePosition(positionId: string | number, position: { name: string; level_id?: number; description?: string }): Promise<{ data: Position }> {
        const response = await axiosInstance.patch(`/user-profile/positions/${positionId}`, position);
        return response.data;
    }

    async deletePosition(positionId: string | number): Promise<void> {
        await axiosInstance.delete(`/user-profile/positions/${positionId}`);
    }
}

const settingsService = new SettingsService();

export default settingsService;
