import axiosInstance from '@/lib/axios';
import {
  ApiResponse,
  PaginatedResponse,
  Project,
  ProjectStatus,
  ProjectPriority,
  Task,
  TaskStatus,
  TaskPriority
} from '@/types/api';

class ProjectService {
  // Project APIs
  // Lấy danh sách projects
  async getProjects(page: number = 1, limit: number = 10, status?: ProjectStatus, search?: string): Promise<PaginatedResponse<Project>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(status && { status }),
      ...(search && { search })
    });
    
    const response = await axiosInstance.get(`projects?${params}`);
    return response.data;
  }

  // Lấy project theo ID
  async getProjectById(projectId: string): Promise<ApiResponse<Project>> {
    const response = await axiosInstance.get(`projects/${projectId}`);
    return response.data;
  }

  // Tạo project mới
  async createProject(projectData: {
    name: string;
    description: string;
    priority: ProjectPriority;
    startDate: string;
    endDate?: string;
    teamMembers: string[];
  }): Promise<ApiResponse<Project>> {
    const response = await axiosInstance.post('projects', projectData);
    return response.data;
  }

  // Cập nhật project
  async updateProject(projectId: string, projectData: Partial<{
    name: string;
    description: string;
    status: ProjectStatus;
    priority: ProjectPriority;
    startDate: string;
    endDate: string;
  }>): Promise<ApiResponse<Project>> {
    const response = await axiosInstance.put(`projects/${projectId}`, projectData);
    return response.data;
  }

  // Xóa project
  async deleteProject(projectId: string): Promise<ApiResponse<void>> {
    const response = await axiosInstance.delete(`projects/${projectId}`);
    return response.data;
  }

  // Lấy projects của user hiện tại
  async getMyProjects(page: number = 1, limit: number = 10, status?: ProjectStatus): Promise<PaginatedResponse<Project>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(status && { status })
    });
    
    const response = await axiosInstance.get(`projects/my-projects?${params}`);
    return response.data;
  }

  // Thêm thành viên vào project
  async addProjectMember(projectId: string, userId: string, role: string): Promise<ApiResponse<Project>> {
    const response = await axiosInstance.post(`projects/${projectId}/members`, { userId, role });
    return response.data;
  }

  // Xóa thành viên khỏi project
  async removeProjectMember(projectId: string, userId: string): Promise<ApiResponse<Project>> {
    const response = await axiosInstance.delete(`projects/${projectId}/members/${userId}`);
    return response.data;
  }

  // Cập nhật role của thành viên
  async updateProjectMemberRole(projectId: string, userId: string, role: string): Promise<ApiResponse<Project>> {
    const response = await axiosInstance.patch(`projects/${projectId}/members/${userId}`, { role });
    return response.data;
  }

  // Task APIs
  // Lấy tasks của project
  async getProjectTasks(projectId: string, page: number = 1, limit: number = 10, status?: TaskStatus, assigneeId?: string): Promise<PaginatedResponse<Task>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(status && { status }),
      ...(assigneeId && { assigneeId })
    });
    
    const response = await axiosInstance.get(`projects/${projectId}/tasks?${params}`);
    return response.data;
  }

  // Lấy task theo ID
  async getTaskById(taskId: string): Promise<ApiResponse<Task>> {
    const response = await axiosInstance.get(`tasks/${taskId}`);
    return response.data;
  }

  // Tạo task mới
  async createTask(projectId: string, taskData: {
    title: string;
    description: string;
    priority: TaskPriority;
    assigneeId: string;
    dueDate?: string;
  }): Promise<ApiResponse<Task>> {
    const response = await axiosInstance.post(`projects/${projectId}/tasks`, taskData);
    return response.data;
  }

  // Cập nhật task
  async updateTask(taskId: string, taskData: Partial<{
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    assigneeId: string;
    dueDate: string;
  }>): Promise<ApiResponse<Task>> {
    const response = await axiosInstance.put(`tasks/${taskId}`, taskData);
    return response.data;
  }

  // Xóa task
  async deleteTask(taskId: string): Promise<ApiResponse<void>> {
    const response = await axiosInstance.delete(`tasks/${taskId}`);
    return response.data;
  }

  // Lấy tasks của user hiện tại
  async getMyTasks(page: number = 1, limit: number = 10, status?: TaskStatus, projectId?: string): Promise<PaginatedResponse<Task>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(status && { status }),
      ...(projectId && { projectId })
    });
    
    const response = await axiosInstance.get(`tasks/my-tasks?${params}`);
    return response.data;
  }

  // Cập nhật trạng thái task
  async updateTaskStatus(taskId: string, status: TaskStatus): Promise<ApiResponse<Task>> {
    const response = await axiosInstance.patch(`tasks/${taskId}/status`, { status });
    return response.data;
  }

  // Lấy thống kê project
  async getProjectStats(projectId: string): Promise<ApiResponse<{
    totalTasks: number;
    completedTasks: number;
    inProgressTasks: number;
    pendingTasks: number;
    completionRate: number;
    overdueTasks: number;
  }>> {
    const response = await axiosInstance.get(`projects/${projectId}/stats`);
    return response.data;
  }

  // Lấy thống kê tasks của user
  async getMyTaskStats(): Promise<ApiResponse<{
    totalTasks: number;
    completedTasks: number;
    inProgressTasks: number;
    pendingTasks: number;
    overdueTasks: number;
  }>> {
    const response = await axiosInstance.get('tasks/my-stats');
    return response.data;
  }
}

export const projectService = new ProjectService();
export default projectService;
