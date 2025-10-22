import axiosInstance from "@/lib/axios";

export interface Project {
  id: string;
  name: string;
  description: string;
  team_size: number;
  client: string;
  manager: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProjectCreateRequest {
  name: string;
  description: string;
  team_size: number;
  client: string;
  manager: string;
}

export interface ProjectUpdateRequest {
  name?: string;
  description?: string;
  team_size?: number;
  client?: string;
  manager?: string;
}

export interface ProjectResponse {
  data: Project[];
  pagination?: {
    current_page: number;
    per_page: number;
    total: number;
    has_next_page: boolean;
  };
}

class ProjectService {
  // Lấy danh sách projects
  async getProjects(page: number = 1): Promise<ProjectResponse> {
    const response = await axiosInstance.get(`/projects?page=${page}`);
    return response.data;
  }

  // Lấy project theo ID
  async getProjectById(id: string): Promise<Project> {
    const response = await axiosInstance.get(`/projects/${id}`);
    return response.data;
  }

  // Tạo project mới
  async createProject(data: ProjectCreateRequest): Promise<Project> {
    const response = await axiosInstance.post('/projects', data);
    return response.data;
  }

  // Cập nhật project
  async updateProject(id: string, data: ProjectUpdateRequest): Promise<Project> {
    const response = await axiosInstance.put(`/projects/${id}`, data);
    return response.data;
  }

  // Xóa project
  async deleteProject(id: string): Promise<void> {
    await axiosInstance.delete(`/projects/${id}`);
  }

  // Lấy projects của user hiện tại
  async getMyProjects(page: number = 1): Promise<ProjectResponse> {
    const response = await axiosInstance.get(`/projects?page=${page}`);
    return response.data;
  }
}

const projectService = new ProjectService();
export default projectService;