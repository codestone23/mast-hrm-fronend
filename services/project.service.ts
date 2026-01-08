import { ROLE_NAMES, ProjectAccessType, ProjectType, ProjectStatus, MilestoneProjectStatus, ProjectIndustry } from "@/constants/enums";
import axiosInstance from "@/lib/axios";

export interface ProjectMember {
  id: number;
  user_id?: number;
  name: string;
  email: string;
  role: ROLE_NAMES;
}

export interface ProjectMemberCreateRequest {
  user_id: number;
}

export interface AvailableMember {
  id: number;
  email: string;
  name: string;
  position: {
    id: number;
    name: string;
  };
}

export interface AvailableMembersResponse {
  projectId: number;
  teamId: number;
  availableMembers: AvailableMember[];
  totalAvailable: number;
}

export interface Project {
  id: number;
  name: string;
  code: string;
  status: ProjectStatus;
  division_id: number | null;
  team_id: number | null;
  project_type: ProjectType;
  project_access_type?: string;
  industry: ProjectIndustry;
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
  status?: ProjectStatus;
  division_id?: number;
  team_id?: number;
  manager_id?: number;
  project_type?: ProjectType;
  project_access_type?: 'COMPANY' | 'RESTRICTED';
  industry?: ProjectIndustry;
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

export interface MilestoneProject {
  id: number;
  project_id: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  progress: number;
  order: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  project?: {
    id: number;
    name: string;
    code: string;
  };
}

export interface MilestoneProjectCreateRequest {
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  status: MilestoneProjectStatus;
  progress: number;
  order: number;
}

export interface MilestoneProjectUpdateRequest {
  name?: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  status?: MilestoneProjectStatus;
  progress?: number;
  order?: number;
}

export interface ProcessMilestoneProjectUpdateRequest {
  progress: number;
}

class ProjectService {
  // Lấy danh sách projects (admin)
  async getProjectsAdmin(
    page: number = 1, 
    search?: string, 
    division_id?: number,
    project_access_type?: string,
    team_id?: number
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
    if (team_id) {
      params.append('team_id', team_id.toString());
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

  async getProjectsManager(
    page: number = 1,
    search?: string,
    project_access_type: string = ProjectAccessType.RESTRICTED
  ): Promise<ProjectResponse> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    if (search) {
      params.append('search', search);
    }
    if (project_access_type) {
      params.append('project_access_type', project_access_type);
    }
    const response = await axiosInstance.get(`/projects/managed?${params.toString()}`);
    return response.data;
  }

  async createMilestoneProject(projectId: string, data: MilestoneProjectCreateRequest): Promise<MilestoneProject> {
    const response = await axiosInstance.post(`/milestones/projects/${projectId}`, data);
    return response.data;
  }

  async getMilestoneProject(projectId: string): Promise<MilestoneProject[]> {
    const response = await axiosInstance.get(`/milestones/projects/${projectId}`);
    return response.data;
  }

  async getDetailMilestoneProject(milestoneId: string): Promise<MilestoneProject> {
    const response = await axiosInstance.get(`/milestones/${milestoneId}`);
    return response.data;
  }

  async updateMilestoneProject(milestoneId: string, data: MilestoneProjectUpdateRequest): Promise<MilestoneProject> {
    const response = await axiosInstance.patch(`/milestones/${milestoneId}`, data);
    return response.data;
  }

  async deleteMilestoneProject(milestoneId: string): Promise<void> {
    await axiosInstance.delete(`/milestones/${milestoneId}`);
  }

  async updateProcessMilestoneProject(milestoneId: string, data: ProcessMilestoneProjectUpdateRequest): Promise<MilestoneProject> {
    const response = await axiosInstance.patch(`/milestones/${milestoneId}/progress`, data);
    return response.data;
  }

  async addMemberToProject(projectId: string, data: ProjectMemberCreateRequest): Promise<ProjectMember> {
    const response = await axiosInstance.post(`/projects/${projectId}/members`, data);
    return response.data;
  }

  async removeMemberFromProject(projectId: string, userId: string): Promise<void> {
    await axiosInstance.delete(`/projects/${projectId}/members/${userId}`);
  }

  async getAvailableMembersForProject(projectId: string, search?: string): Promise<AvailableMembersResponse> {
    const params = new URLSearchParams();
    if (search) {
      params.append('search', search);
    }
    const response = await axiosInstance.get(`/projects/${projectId}/available-members?${params.toString()}`);
    return response.data;
  }
}

const projectService = new ProjectService();
export default projectService;