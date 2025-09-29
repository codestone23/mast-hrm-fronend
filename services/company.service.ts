import axiosInstance from '@/lib/axios';
import {
  ApiResponse,
  PaginatedResponse,
  Department,
  Employee,
  User
} from '@/types/api';

class CompanyService {
  // Department APIs
  // Lấy danh sách departments
  async getDepartments(page: number = 1, limit: number = 10, search?: string): Promise<PaginatedResponse<Department>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search })
    });
    
    const response = await axiosInstance.get(`/company/departments?${params}`);
    return response.data;
  }

  // Lấy department theo ID
  async getDepartmentById(departmentId: string): Promise<ApiResponse<Department>> {
    const response = await axiosInstance.get(`/company/departments/${departmentId}`);
    return response.data;
  }

  // Tạo department mới
  async createDepartment(departmentData: {
    name: string;
    description?: string;
    managerId?: string;
  }): Promise<ApiResponse<Department>> {
    const response = await axiosInstance.post('/company/departments', departmentData);
    return response.data;
  }

  // Cập nhật department
  async updateDepartment(departmentId: string, departmentData: Partial<{
    name: string;
    description: string;
    managerId: string;
  }>): Promise<ApiResponse<Department>> {
    const response = await axiosInstance.put(`/company/departments/${departmentId}`, departmentData);
    return response.data;
  }

  // Xóa department
  async deleteDepartment(departmentId: string): Promise<ApiResponse<void>> {
    const response = await axiosInstance.delete(`/company/departments/${departmentId}`);
    return response.data;
  }

  // Lấy employees của department
  async getDepartmentEmployees(departmentId: string, page: number = 1, limit: number = 10): Promise<PaginatedResponse<Employee>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });
    
    const response = await axiosInstance.get(`/company/departments/${departmentId}/employees?${params}`);
    return response.data;
  }

  // Employee APIs
  // Lấy danh sách employees
  async getEmployees(page: number = 1, limit: number = 10, departmentId?: string, search?: string): Promise<PaginatedResponse<Employee>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(departmentId && { departmentId }),
      ...(search && { search })
    });
    
    const response = await axiosInstance.get(`/company/employees?${params}`);
    return response.data;
  }

  // Lấy employee theo ID
  async getEmployeeById(employeeId: string): Promise<ApiResponse<Employee>> {
    const response = await axiosInstance.get(`/company/employees/${employeeId}`);
    return response.data;
  }

  // Tạo employee mới
  async createEmployee(employeeData: {
    userId: string;
    employeeId: string;
    departmentId: string;
    position: string;
    salary?: number;
    startDate: string;
  }): Promise<ApiResponse<Employee>> {
    const response = await axiosInstance.post('/company/employees', employeeData);
    return response.data;
  }

  // Cập nhật employee
  async updateEmployee(employeeId: string, employeeData: Partial<{
    departmentId: string;
    position: string;
    salary: number;
    startDate: string;
    endDate: string;
  }>): Promise<ApiResponse<Employee>> {
    const response = await axiosInstance.put(`/company/employees/${employeeId}`, employeeData);
    return response.data;
  }

  // Xóa employee
  async deleteEmployee(employeeId: string): Promise<ApiResponse<void>> {
    const response = await axiosInstance.delete(`/company/employees/${employeeId}`);
    return response.data;
  }

  // Kích hoạt/vô hiệu hóa employee
  async toggleEmployeeStatus(employeeId: string): Promise<ApiResponse<Employee>> {
    const response = await axiosInstance.patch(`/company/employees/${employeeId}/toggle-status`);
    return response.data;
  }

  // Chuyển department cho employee
  async transferEmployee(employeeId: string, newDepartmentId: string, newPosition?: string): Promise<ApiResponse<Employee>> {
    const response = await axiosInstance.patch(`/company/employees/${employeeId}/transfer`, {
      departmentId: newDepartmentId,
      position: newPosition
    });
    return response.data;
  }

  // Lấy thống kê company
  async getCompanyStats(): Promise<ApiResponse<{
    totalEmployees: number;
    totalDepartments: number;
    activeEmployees: number;
    inactiveEmployees: number;
    employeesByDepartment: Array<{
      departmentId: string;
      departmentName: string;
      employeeCount: number;
    }>;
  }>> {
    const response = await axiosInstance.get('/company/stats');
    return response.data;
  }

  // Lấy thống kê department
  async getDepartmentStats(departmentId: string): Promise<ApiResponse<{
    totalEmployees: number;
    activeEmployees: number;
    inactiveEmployees: number;
    averageSalary: number;
    positions: Array<{
      position: string;
      count: number;
    }>;
  }>> {
    const response = await axiosInstance.get(`/company/departments/${departmentId}/stats`);
    return response.data;
  }

  // Tìm kiếm employees
  async searchEmployees(query: string, page: number = 1, limit: number = 10): Promise<PaginatedResponse<Employee>> {
    const params = new URLSearchParams({
      q: query,
      page: page.toString(),
      limit: limit.toString()
    });
    
    const response = await axiosInstance.get(`/company/employees/search?${params}`);
    return response.data;
  }

  // Lấy org chart
  async getOrgChart(): Promise<ApiResponse<{
    departments: Array<{
      id: string;
      name: string;
      manager?: {
        id: string;
        name: string;
        position: string;
      };
      employees: Array<{
        id: string;
        name: string;
        position: string;
        avatar?: string;
      }>;
    }>;
  }>> {
    const response = await axiosInstance.get('/company/org-chart');
    return response.data;
  }

  // Lấy thông tin company
  async getCompanyInfo(): Promise<ApiResponse<{
    name: string;
    description?: string;
    address?: string;
    phone?: string;
    email?: string;
    website?: string;
    logo?: string;
    establishedDate?: string;
  }>> {
    const response = await axiosInstance.get('/company/info');
    return response.data;
  }

  // Cập nhật thông tin company
  async updateCompanyInfo(companyData: {
    name?: string;
    description?: string;
    address?: string;
    phone?: string;
    email?: string;
    website?: string;
    establishedDate?: string;
  }): Promise<ApiResponse<void>> {
    const response = await axiosInstance.put('/company/info', companyData);
    return response.data;
  }

  // Upload logo company
  async uploadCompanyLogo(file: File): Promise<ApiResponse<{ logoUrl: string }>> {
    const formData = new FormData();
    formData.append('logo', file);
    
    const response = await axiosInstance.post('/company/logo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
}

export const companyService = new CompanyService();
export default companyService;
