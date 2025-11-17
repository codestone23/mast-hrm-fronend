import { Asset, AssetRequest, AssetStatistics } from "@/constants/types";
import axiosInstance from "@/lib/axios";
import { ApiResponse, PaginatedResponse } from "@/types/api";

export interface GetAssetsParams {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    status?: string;
}

class AssetsService {
    async getAssetsStatistics(): Promise<AssetStatistics> {    
        const response = await axiosInstance.get('/assets/statistics');
        return response.data;
    }

    async createAsset(asset: Partial<Asset>): Promise<ApiResponse<Asset>> {
        const response = await axiosInstance.post('/assets', asset);
        return response.data;
    }

    async getListAssets(params: GetAssetsParams = {}): Promise<PaginatedResponse<Asset>> {
        const response = await axiosInstance.get('/assets', {
            params: {
                page: params.page || 1,
                limit: params.limit || 10,
                ...(params.search && { search: params.search }),
                ...(params.category && { category: params.category }),
                ...(params.status && { status: params.status }),
            },
        });
        return response.data;
    }

    async updateAsset(assetId: number | string, assetData: Partial<Asset>): Promise<ApiResponse<Asset>> {
        const response = await axiosInstance.patch(`/assets/${assetId}`, assetData);
        return response.data;
    }

    async deleteAsset(assetId: number | string): Promise<ApiResponse<void>> {
        const response = await axiosInstance.delete(`/assets/${assetId}`);
        return response.data;
    }

    async getAssetById(assetId: number | string): Promise<ApiResponse<Asset>> {
        const response = await axiosInstance.get(`/assets/${assetId}`);
        return response.data;
    }

    async assignAsset(assetId: number | string, userId: number, notes?: string): Promise<ApiResponse<void>> {
        const response = await axiosInstance.post(`/assets/${assetId}/assign`, { 
            user_id: userId, 
            ...(notes && { notes }) 
        });
        return response.data;
    }

    async getMyAssets(): Promise<ApiResponse<Asset[]>> {
        const response = await axiosInstance.get('/assets/my-devices');
        return response.data;
    }

    async createRequest(data: {
        request_type: "REQUEST" | "RETURN" | "MAINTENANCE";
        category: string;
        description: string;
        justification: string;
        expected_date: string;
        asset_id?: number | string | null;
        notes?: string;
        user_id?: number;
    }): Promise<ApiResponse<void>> {
        const response = await axiosInstance.post(`/assets/requests`, data);
        return response.data;
    }

    async getRequestHr(): Promise<PaginatedResponse<AssetRequest>> {
        const response = await axiosInstance.get('/assets/requests');
        return response.data;
    }

    async getMyRequests(): Promise<PaginatedResponse<AssetRequest>> {
        const response = await axiosInstance.get('/assets/requests/my');
        return response.data;
    }

    async detailAssetRequest(requestId: number | string): Promise<ApiResponse<AssetRequest>> {
        const response = await axiosInstance.get(`/assets/requests/${requestId}`);
        return response.data;
    }

    async approveRequest(requestId: number | string, data: {
        action: "APPROVED" | "REJECTED";
        asset_id?: number | string;
        rejection_reason?: string;
        notes?: string;
    }): Promise<ApiResponse<void>> {
        const response = await axiosInstance.post(`/assets/requests/${requestId}/approve`, data);
        return response.data;
    }

    async unassignAsset(assetId: number | string): Promise<ApiResponse<void>> {
        const response = await axiosInstance.post(`/assets/${assetId}/unassign`);
        return response.data;
    }
}

export const assetsService = new AssetsService(); 
export default assetsService;