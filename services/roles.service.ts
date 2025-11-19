import axiosInstance from "@/lib/axios";
import { ApiResponse, ScopeType, Role } from "@/types/api";

class RolesService {
  async getRoles(): Promise<Role[]> {
    const response = await axiosInstance.get('/role-assignments/roles');
    return response.data;
  }

  async assignRole(userId: number, roleId: number, scopeType: ScopeType = ScopeType.COMPANY): Promise<ApiResponse<void>> {
    const response = await axiosInstance.post(`/role-assignments/assign`, { 
      user_id: userId, 
      role_id: roleId,
      scope_type: scopeType
    });
    return response.data;
  }

  async unassignRole(userId: number, roleId: number): Promise<ApiResponse<void>> {
    const response = await axiosInstance.delete(`/role-assignments/revoke`, { params: { user_id: userId, role_id: roleId } });
    return response.data; 
  }
}

const rolesService = new RolesService();

export default rolesService;