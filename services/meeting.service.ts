import axiosInstance from "@/lib/axios";
import { 
  PaginatedResponse, 
  Meeting, 
  MeetingRoom,
  MeetingParams, 
  CreateRoomPayload, 
  UpdateRoomPayload, 
  CreateMeetingPayload, 
  UpdateMeetingPayload 
} from "@/types/api";

class MeetingService {
    async getRooms(params: MeetingParams = {}): Promise<PaginatedResponse<MeetingRoom>> {
        const response = await axiosInstance.get(`/meeting-rooms/rooms`, { params });
        return response.data;
    }

    async createRoom(payload: CreateRoomPayload): Promise<void> {
        await axiosInstance.post(`/meeting-rooms/rooms`, payload);
    }

    async updateRoom(id: string, payload: UpdateRoomPayload): Promise<void> {
        await axiosInstance.patch(`/meeting-rooms/rooms/${id}`, payload);
    }

    async getRoomById(id: string): Promise<MeetingRoom> {
        const response = await axiosInstance.get(`/meeting-rooms/rooms/${id}`);
        return response.data;
    }

    async deleteRoom(id: string): Promise<void> {
        await axiosInstance.delete(`/meeting-rooms/rooms/${id}`);
    }

    async getMeetings(params: MeetingParams = {}): Promise<PaginatedResponse<Meeting>> {
        const response = await axiosInstance.get(`/meeting-rooms/bookings`, { params });
        return response.data;
    }

    async createMeeting(payload: CreateMeetingPayload): Promise<void> {
        await axiosInstance.post(`/meeting-rooms/bookings`, payload);
    }

    async getMyMeetings(params: MeetingParams = {}): Promise<PaginatedResponse<Meeting>> {
        const response = await axiosInstance.get(`/meeting-rooms/my-bookings`, { params });
        return response.data;
    }

    async getMeetingById(id: string): Promise<Meeting> {
        const response = await axiosInstance.get(`/meeting-rooms/bookings/${id}`);
        return response.data;
    }

    async updateMeeting(id: string, payload: UpdateMeetingPayload): Promise<void> {
        await axiosInstance.patch(`/meeting-rooms/bookings/${id}`, payload);
    }

    async deleteMeeting(id: string): Promise<void> {
        await axiosInstance.delete(`/meeting-rooms/bookings/${id}`);
    }
}

const meetingService = new MeetingService();
export default meetingService;