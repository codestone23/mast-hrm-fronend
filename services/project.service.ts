import { ROLE_NAMES, ProjectAccessType } from "@/constants/enums";
import axiosInstance from "@/lib/axios";

export interface ProjectMember {
  id: number;
  name: string;
  email: string;
  role: ROLE_NAMES;
}

export interface Project {
  id: number;
  name: string;
  code: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'PENDING' | 'CLOSED';
  division_id: number | null;
  team_id: number | null;
  project_type: 'CUSTOMER' | 'IN_HOUSE' | 'START_UP' | 'INTERNAL';
  project_access_type?: string;
  industry: 'IT' | 'FINANCE' | 'MANUFACTURING' | 'OTHER';
  progress: number | null;
  scope: string;
  description: string;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  division: { id: number; name: string } | null;
  team: { id: number; name: string } | null;
  member_count: number;
  members?: ProjectMember[];
}

export interface ProjectCreateRequest {
  name: string;
  code: string;
  status?: 'OPEN' | 'IN_PROGRESS' | 'PENDING' | 'CLOSED';
  division_id?: number;
  team_id?: number;
  manager_id?: number;
  project_type?: 'CUSTOMER' | 'IN_HOUSE' | 'START_UP' | 'INTERNAL';
  project_access_type?: 'COMPANY' | 'RESTRICTED';
  industry?: 'IT' | 'FINANCE' | 'MANUFACTURING' | 'OTHER';
  description: string;
  start_date: string;
  end_date: string;
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
    total_pages: number;
    has_next_page: boolean;
    has_prev_page: boolean;
  };
}

export interface ProjectMemberResponse {
  data: ProjectMember[];
}

class ProjectService {
  // Lấy danh sách projects (admin)
  async getProjectsAdmin(
    page: number = 1, 
    search?: string, 
    division_id?: number,
    project_access_type?: string
  ): Promise<ProjectResponse> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    if (search) {
      params.append('search', search);
    }
    if (division_id) {
      params.append('division_id', division_id.toString());
    }
    if (project_access_type) {
      params.append('project_access_type', project_access_type);
    }
    const response = await axiosInstance.get(`/projects?${params.toString()}`);
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
    const response = await axiosInstance.patch(`/projects/${id}`, data);
    return response.data;
  }

  // Xóa project
  async deleteProject(id: string): Promise<void> {
    await axiosInstance.delete(`/projects/${id}`);
  }

  async getMyProjects(
    page: number = 1, 
    search?: string, 
    division_id?: number,
    project_access_type: string = ProjectAccessType.RESTRICTED
  ): Promise<ProjectResponse> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    if (search) {
      params.append('search', search);
    }
    if (division_id) {
      params.append('division_id', division_id.toString());
    }
    if (project_access_type) {
      params.append('project_access_type', project_access_type);
    }
    const response = await axiosInstance.get(`/projects/my?${params.toString()}`);
    return response.data;
  }

  async getProjectsMembers(projectId: string): Promise<ProjectMemberResponse> {
    const response = await axiosInstance.get(`/projects/${projectId}/members`);
    return response.data;
  }
}

const projectService = new ProjectService();
export default projectService;