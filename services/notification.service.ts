import axiosInstance from "@/lib/axios";
import { ApiResponse, PaginatedResponse, Notification } from "@/types/api";

class NotificationService {
    async getNotifications(page: number = 1, limit: number = 10): Promise<PaginatedResponse<Notification>> {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
        });
        const response = await axiosInstance.get(`notifications?${params.toString()}`);
        return response.data;
    }
}

const notificationService = new NotificationService();
export default notificationService;

