import axiosInstance from "@/lib/axios";
import { 
    ApiResponse, 
    PaginatedResponse, 
    Notification, 
    CreateNotificationRequest,
    UpdateNotificationRequest,
    ReadNotificationRequest
} from "@/types/api";

class NotificationService {
    async getNotifications(
        page: number = 1, 
        limit: number = 10, 
        search?: string
    ): Promise<PaginatedResponse<Notification>> {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
        });
        if (search) {
            params.append('search', search);
        }
        const response = await axiosInstance.get(`notifications?${params.toString()}`);
        return response.data;
    }

    async getNotificationsAdmin(
        page: number = 1, 
        limit: number = 10, 
        search?: string
    ): Promise<PaginatedResponse<Notification>> {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
        });
        if (search) {
            params.append('search', search);
        }
        const response = await axiosInstance.get(`notifications/admin?${params.toString()}`);
        return response.data;
    }

    async createNotification(notification: CreateNotificationRequest): Promise<ApiResponse<Notification>> {
        const response = await axiosInstance.post(`notifications`, notification);
        return response.data;
    }

    async updateNotification(id: number, notification: UpdateNotificationRequest): Promise<ApiResponse<Notification>> {
        const response = await axiosInstance.patch(`notifications/admin/${id}`, notification);
        return response.data;
    }

    async getNotificationById(id: number): Promise<ApiResponse<Notification>> {
        const response = await axiosInstance.get(`notifications/admin/${id}`);
        return response.data;
    }

    async deleteNotification(id: number): Promise<ApiResponse<void>> {
        const response = await axiosInstance.delete(`notifications/admin/${id}`);
        return response.data;
    }

    async readNotification(id: number, payload: ReadNotificationRequest): Promise<ApiResponse<void>> {
        const response = await axiosInstance.patch(`notifications/${id}/read`, payload);
        return response.data;
    }
}

const notificationService = new NotificationService();
export default notificationService;

