import { UserProfile } from "@/constants/types";
import axiosInstance from "@/lib/axios";




class ProfileService {
  async getProfile(): Promise<UserProfile> {
    const response = await axiosInstance.get('user-profile');
    return response.data;
  }
}

export const profileService = new ProfileService();
export default profileService;