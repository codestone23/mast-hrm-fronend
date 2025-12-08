import React, { useState, useEffect } from 'react';
import { Modal, Input, Button, Select, DatePicker } from '@/components/common';
import {
  ModalContent,
  FormSection,
  FormGrid,
  ErrorMessage,
  InfoBanner
} from './requestModalStyles';
import { useToast } from '@/hooks/useToast';
import { timekeepingService } from '@/services/timekeeping.service';
import requestsService from '@/services/requests.service';
import { useQueryClient } from '@tanstack/react-query';
import LocalStorageUtil from '@/utils/LocalStorageUtil';
import { User } from "@/constants/types";
interface PaidLeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string;
  requestId?: number;
  requestType?: string;
}

const PaidLeaveModal: React.FC<PaidLeaveModalProps> = ({
  isOpen,
  onClose,
  selectedDate,
  requestId,
  requestType
}) => {
  const queryClient = useQueryClient();
  const isEdit = !!requestId && !!requestType;
  const [formData, setFormData] = useState({
    title: '',
    leaveType: 'PAID',
    duration: 'FULL_DAY',
    workDate: selectedDate,
    reason: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState('');
  const [annualLeaveQuota, setAnnualLeaveQuota] = useState(0);
  const [showInsufficientQuotaModal, setShowInsufficientQuotaModal] = useState(false);
  const { success: showSuccessToast, error: showErrorToast } = useToast();

  const leaveTypes = [
    { value: 'PAID', label: 'Nghỉ phép có lương' },
    { value: 'UNPAID', label: 'Nghỉ phép không lương' }
  ];

  const durations = [
    { value: 'FULL_DAY', label: 'Cả ngày' },
    { value: 'MORNING', label: 'Buổi sáng' },
    { value: 'AFTERNOON', label: 'Buổi chiều' }
  ];

  // Lấy thông tin user từ localStorage
  useEffect(() => {
    if (isOpen) {
      const userData = LocalStorageUtil.getUserLocalDataObject('user') as User;
      if (userData && userData.annual_leave_quota) {
        setAnnualLeaveQuota(userData.annual_leave_quota);
      }
    }
  }, [isOpen]);

  // Fetch request data when in edit mode
  useEffect(() => {
    if (isOpen && isEdit && requestId && requestType) {
      setIsFetching(true);
      requestsService.getRequestById(requestType, String(requestId))
        .then((request) => {
          setFormData({
            title: request.title || '',
            leaveType: (request as any).type || 'PAID',
            duration: request.duration || 'FULL_DAY',
            workDate: request.work_date || selectedDate,
            reason: request.reason || ''
          });
        })
        .catch((err) => {
          console.error('Error fetching request:', err);
          showErrorToast('Không thể tải thông tin đề xuất');
        })
        .finally(() => {
          setIsFetching(false);
        });
    } else if (isOpen && !isEdit) {
      // Reset form when creating new request
      setFormData({
        title: '',
        leaveType: 'PAID',
        duration: 'FULL_DAY',
        workDate: selectedDate,
        reason: ''
      });
    }
  }, [isOpen, isEdit, requestId, requestType, selectedDate, showErrorToast]);

  // Tính số giờ phép cần sử dụng
  const getRequiredLeaveHours = () => {
    switch (formData.duration) {
      case 'FULL_DAY':
        return 8;
      case 'MORNING':
      case 'AFTERNOON':
        return 4;
      default:
        return 8;
    }
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      setError('Vui lòng nhập tiêu đề');
      return;
    }

    if (!formData.reason.trim()) {
      setError('Vui lòng nhập lý do');
      return;
    }

    // Kiểm tra số giờ phép còn lại nếu là nghỉ có lương
    if (formData.leaveType === 'PAID') {
      const requiredHours = getRequiredLeaveHours();
      if (annualLeaveQuota < requiredHours) {
        setShowInsufficientQuotaModal(true);
        return;
      }
    }

    setIsLoading(true);
    setError('');

    try {
      const payload = {
        work_date: formData.workDate,
        duration: formData.duration as 'FULL_DAY' | 'MORNING' | 'AFTERNOON',
        title: formData.title,
        type: formData.leaveType as 'PAID' | 'UNPAID',
        reason: formData.reason,
        is_past: false
      };

      if (isEdit && requestId && requestType) {
        await requestsService.updateRequest(requestType, String(requestId), payload);
        showSuccessToast('Cập nhật đơn xin nghỉ phép thành công!');
        queryClient.invalidateQueries({ queryKey: ['myRequests'] });
      } else {
        await timekeepingService.createDayOffRequest(payload);
        showSuccessToast('Tạo đơn xin nghỉ phép thành công!');
      }
      onClose();
    } catch (error) {
      console.error('Error submitting leave request:', error);
      setError('Có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setError('');
    setIsLoading(false);
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setError('');
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEdit ? "Chỉnh sửa đơn nghỉ phép" : "Đăng ký nghỉ phép"}
      size="md"
      footer={
        <>
          <Button variant="ghost" onClick={handleClose} disabled={isLoading}>
            Hủy
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            loading={isLoading}
            disabled={isLoading || isFetching || !formData.title.trim() || !formData.reason.trim()}
          >
            {isLoading ? 'Đang xử lý...' : isEdit ? 'Cập nhật' : 'Tạo đơn'}
          </Button>
        </>
      }
    >
      <ModalContent>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {isFetching && <div style={{ padding: '1rem', textAlign: 'center' }}>Đang tải thông tin...</div>}
        
        {!isFetching && (
          <>
            <InfoBanner>
              Số giờ phép còn lại: {annualLeaveQuota} giờ
            </InfoBanner>
            
            <FormSection>
          <FormGrid>
            <Input
              label="Tiêu đề"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Nhập tiêu đề đơn xin nghỉ phép"
              required
              disabled={isLoading}
            />
            
            <Select
              label="Loại nghỉ phép"
              value={formData.leaveType}
              onChange={(value: string | number) => handleInputChange('leaveType', value.toString())}
              options={leaveTypes}
              placeholder="Chọn loại nghỉ phép"
              required
              disabled={isLoading}
            />
            
            <Select
              label="Thời gian nghỉ"
              value={formData.duration}
              onChange={(value: string | number) => handleInputChange('duration', value.toString())}
              options={durations}
              placeholder="Chọn thời gian nghỉ"
              required
              disabled={isLoading}
            />
            
            <DatePicker
              label="Ngày nghỉ"
              value={formData.workDate}
              onChange={(value) => handleInputChange('workDate', value ? value.toISOString().split('T')[0] : '')}
              required
              disabled={isLoading}
            />
            <div style={{ gridColumn: '1 / -1' }}>
              <Input
                label="Lý do"
                value={formData.reason}
                onChange={(e) => handleInputChange('reason', e.target.value)}
                placeholder="Nhập lý do nghỉ phép..."
                required
                disabled={isLoading}
              />
            </div>
          </FormGrid>
        </FormSection>
        </>
        )}
      </ModalContent>

      {/* Modal cảnh báo không đủ giờ phép */}
      <Modal
        isOpen={showInsufficientQuotaModal}
        onClose={() => setShowInsufficientQuotaModal(false)}
        title="Không đủ giờ phép"
        size="sm"
        footer={
          <>
            <Button 
              variant="ghost" 
              onClick={() => setShowInsufficientQuotaModal(false)}
            >
              Đóng
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setShowInsufficientQuotaModal(false);
                // Chuyển sang nghỉ không lương
                setFormData(prev => ({ ...prev, leaveType: 'UNPAID' }));
              }}
            >
              Chuyển sang nghỉ không lương
            </Button>
          </>
        }
      >
        <div style={{ padding: '1rem', textAlign: 'center' }}>
          <p style={{ marginBottom: '1rem', color: '#ef4444' }}>
            Bạn không đủ giờ phép để xin nghỉ có lương.
          </p>
          <p style={{ marginBottom: '0.5rem' }}>
            Số giờ phép còn lại: <strong>{annualLeaveQuota} giờ</strong>
          </p>
          <p>
            Số giờ cần sử dụng: <strong>{getRequiredLeaveHours()} giờ</strong>
          </p>
        </div>
      </Modal>
    </Modal>
  );
};

export default PaidLeaveModal;
