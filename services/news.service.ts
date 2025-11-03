import axiosInstance from "@/lib/axios";
import { ApiResponse, PaginatedResponse, News, CreateNewsRequest, UpdateNewsRequest, ReviewNewsRequest } from "@/types/api";

class NewsService {
    async getNews(page: number = 1, limit: number = 10, search?: string, status?: string): Promise<PaginatedResponse<News>> {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
            ...(search && { search }),
            ...(status && { status })
        });
        const response = await axiosInstance.get(`news?${params.toString()}`);
        return response.data;
    }

    async getNewsById(id: string | number): Promise<News> {
        const response = await axiosInstance.get(`news/${id}`);
        return response.data;
    }

    async createNews(news: CreateNewsRequest): Promise<ApiResponse<News>> {
        const response = await axiosInstance.post(`news`, news);
        return response.data;
    }

    async updateNews(id: string | number, news: UpdateNewsRequest): Promise<ApiResponse<News>> {
        const response = await axiosInstance.patch(`news/${id}`, news);
        return response.data;
    }

    async deleteNews(id: string | number): Promise<ApiResponse<void>> {
        const response = await axiosInstance.delete(`news/${id}`);
        return response.data;
    }

    async submitNews(id: string | number): Promise<ApiResponse<News>> {
        const response = await axiosInstance.patch(`news/${id}/submit`);
        return response.data;
    }

    async reviewNews(id: string | number, payload: ReviewNewsRequest): Promise<ApiResponse<News>> {
        const response = await axiosInstance.patch(`news/${id}/review`, payload);
        return response.data;
    }
}

const newsService = new NewsService();
export default newsService;
