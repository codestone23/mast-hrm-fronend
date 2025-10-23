import axiosInstance from "@/lib/axios";

export interface PresignedUrlRequest {
  file_type: string;
  folder?: string;
}

export interface PresignedUrlResponse {
  upload_url: string;
  public_id: string;
  signature: string;
  timestamp: number;
  api_key: string;
  folder: string;
  transformation: string|undefined;
  expires_at: string;
}

export interface CloudinaryUploadResponse {
  public_id: string;
  version: number;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: string[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  access_mode: string;
  original_filename: string;
}

class UploadService {
  /**
   * Lấy presigned URL từ backend
   */
  async getPresignedUrl(request: PresignedUrlRequest): Promise<PresignedUrlResponse> {
    const response = await axiosInstance.post('upload/presigned-url', request);
    return response.data;
  }

  /**
   * Upload file lên Cloudinary sử dụng presigned URL
   */
  async uploadToCloudinary(
    file: File,
    presignedData: PresignedUrlResponse
  ): Promise<CloudinaryUploadResponse> {
    const formData = new FormData();
    
    // Thêm các thông tin cần thiết cho Cloudinary
    formData.append('file', file);
    formData.append('public_id', presignedData.public_id);
    formData.append('signature', presignedData.signature);
    formData.append('timestamp', presignedData.timestamp.toString());
    formData.append('api_key', presignedData.api_key);
    formData.append('folder', presignedData.folder);
    if (presignedData.transformation) {
      formData.append('transformation', presignedData.transformation as string);
    }
    
    // Upload trực tiếp lên Cloudinary
    const response = await fetch(presignedData.upload_url, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Upload failed: ${response.status} - ${errorText}`);
    }

    return await response.json();
  }

  /**
   * Upload ảnh avatar hoàn chỉnh (lấy presigned URL + upload + trả về URL)
   */
  async uploadAvatar(file: File): Promise<string> {
    try {
      // Kiểm tra loại file
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Loại file không được hỗ trợ. Chỉ chấp nhận: JPEG, JPG, PNG, WEBP');
      }

      // Kiểm tra kích thước file (tối đa 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        throw new Error('Kích thước file quá lớn. Tối đa 5MB');
      }

      // 1. Lấy presigned URL
      const presignedData = await this.getPresignedUrl({
        file_type: file.type,
        folder: 'avatars',
      });

      // 2. Upload lên Cloudinary
      const uploadResult = await this.uploadToCloudinary(file, presignedData);

      // 3. Trả về secure URL
      return uploadResult.secure_url;
    } catch (error) {
      console.error('Lỗi upload avatar:', error);
      throw error;
    }
  }

  /**
   * Upload ảnh chung (có thể chọn folder)
   */
  async uploadImage(file: File, folder: string = 'images'): Promise<string> {
    try {
      // Kiểm tra loại file
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Loại file không được hỗ trợ. Chỉ chấp nhận: JPEG, JPG, PNG, WEBP');
      }

      // Kiểm tra kích thước file (tối đa 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        throw new Error('Kích thước file quá lớn. Tối đa 10MB');
      }

      // 1. Lấy presigned URL
      const presignedData = await this.getPresignedUrl({
        file_type: file.type,
        folder,
      });

      // 2. Upload lên Cloudinary
      const uploadResult = await this.uploadToCloudinary(file, presignedData);

      // 3. Trả về secure URL
      return uploadResult.secure_url;
    } catch (error) {
      console.error('Lỗi upload ảnh:', error);
      throw error;
    }
  }

  /**
   * Validate file trước khi upload
   */
  validateImageFile(file: File): { isValid: boolean; error?: string } {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: 'Loại file không được hỗ trợ. Chỉ chấp nhận: JPEG, JPG, PNG, WEBP',
      };
    }

    if (file.size > maxSize) {
      return {
        isValid: false,
        error: 'Kích thước file quá lớn. Tối đa 10MB',
      };
    }

    return { isValid: true };
  }
}

export const uploadService = new UploadService();
export default uploadService;
