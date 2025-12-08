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

interface LateEarlyModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string;
  requestId?: number;
  requestType?: string;
}

const LateEarlyModal: React.FC<LateEarlyModalProps> = ({
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
    workDate: selectedDate,
    requestType: 'LATE',
    lateMinutes: 0,
    earlyMinutes: 0,
    reason: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState('');
  const { success: showSuccessToast, error: showErrorToast } = useToast();

  const requestTypes = [
    { value: 'LATE', label: 'Đi muộn' },
    { value: 'EARLY', label: 'Về sớm' },
    { value: 'BOTH', label: 'Cả đi muộn và về sớm' }
  ];

  // Fetch request data when in edit mode
  useEffect(() => {
    if (isOpen && isEdit && requestId && requestType) {
      setIsFetching(true);
      requestsService.getRequestById(requestType, String(requestId))
        .then((request) => {
          // Determine request type based on late_minutes and early_minutes
          let reqType = 'LATE';
          if (request.late_minutes && request.late_minutes > 0 && request.early_minutes && request.early_minutes > 0) {
            reqType = 'BOTH';
          } else if (request.early_minutes && request.early_minutes > 0) {
            reqType = 'EARLY';
          }

          setFormData({
            title: request.title || '',
            workDate: request.work_date || selectedDate,
            requestType: reqType,
            lateMinutes: request.late_minutes || 0,
            earlyMinutes: request.early_minutes || 0,
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
        workDate: selectedDate,
        requestType: 'LATE',
        lateMinutes: 0,
        earlyMinutes: 0,
        reason: ''
      });
    }
  }, [isOpen, isEdit, requestId, requestType, selectedDate, showErrorToast]);

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      setError('Vui lòng nhập tiêu đề');
      return;
    }

    if (!formData.reason.trim()) {
      setError('Vui lòng nhập lý do');
      return;
    }

    if (formData.requestType === 'LATE' && formData.lateMinutes <= 0) {
      setError('Vui lòng nhập số phút đi muộn');
      return;
    }

    if (formData.requestType === 'EARLY' && formData.earlyMinutes <= 0) {
      setError('Vui lòng nhập số phút về sớm');
      return;
    }

    if (formData.requestType === 'BOTH' && (formData.lateMinutes <= 0 || formData.earlyMinutes <= 0)) {
      setError('Vui lòng nhập số phút đi muộn và về sớm');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const payload = {
        work_date: formData.workDate,
        request_type: formData.requestType as 'LATE' | 'EARLY' | 'BOTH',
        title: formData.title,
        late_minutes: formData.lateMinutes,
        early_minutes: formData.earlyMinutes,
        reason: formData.reason
      };

      if (isEdit && requestId && requestType) {
        await requestsService.updateRequest(requestType, String(requestId), {
          work_date: formData.workDate,
          title: formData.title,
          late_minutes: formData.lateMinutes,
          early_minutes: formData.earlyMinutes,
          reason: formData.reason
        });
        showSuccessToast('Cập nhật đơn xin đi muộn/về sớm thành công!');
        queryClient.invalidateQueries({ queryKey: ['myRequests'] });
      } else {
        await timekeepingService.createLateEarlyRequest(payload);
        showSuccessToast('Tạo đơn xin đi muộn/về sớm thành công!');
      }
      onClose();
    } catch (error) {
      console.error('Error submitting late/early request:', error);
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

  const handleInputChange = (field: string, value: string | number) => {
    setError('');
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const isFormValid = () => {
    if (!formData.title.trim() || !formData.reason.trim()) return false;
    
    if (formData.requestType === 'LATE' && formData.lateMinutes <= 0) return false;
    if (formData.requestType === 'EARLY' && formData.earlyMinutes <= 0) return false;
    if (formData.requestType === 'BOTH' && (formData.lateMinutes <= 0 || formData.earlyMinutes <= 0)) return false;
    
    return true;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEdit ? "Chỉnh sửa đơn đi muộn/về sớm" : "Đăng ký đi muộn/về sớm"}
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
            disabled={isLoading || isFetching || !isFormValid()}
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
              Số phút còn lại có thể đăng ký: 120 phút
            </InfoBanner>
            
            <FormSection>
          <FormGrid>
            <Input
              label="Tiêu đề"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Nhập tiêu đề đơn xin đi muộn/về sớm"
              required
              disabled={isLoading}
            />
            
            <Select
              label="Loại yêu cầu"
              value={formData.requestType}
              onChange={(value: string | number) => handleInputChange('requestType', value.toString())}
              options={requestTypes}
              placeholder="Chọn loại yêu cầu"
              required
              disabled={isLoading}
            />
            
            <DatePicker
              label="Ngày áp dụng"
              value={formData.workDate}
              onChange={(value) => handleInputChange('workDate', value ? value.toISOString().split('T')[0] : '')}
              required
              disabled={isLoading}
            />
            
            {(formData.requestType === 'LATE' || formData.requestType === 'BOTH') && (
              <Input
                label="Số phút đi muộn"
                type="number"
                value={formData.lateMinutes}
                onChange={(e) => handleInputChange('lateMinutes', parseInt(e.target.value) || 0)}
                placeholder="Nhập số phút đi muộn"
                required
                disabled={isLoading}
                min="1"
                max="120"
              />
            )}
            
            {(formData.requestType === 'EARLY' || formData.requestType === 'BOTH') && (
              <Input
                label="Số phút về sớm"
                type="number"
                value={formData.earlyMinutes}
                onChange={(e) => handleInputChange('earlyMinutes', parseInt(e.target.value) || 0)}
                placeholder="Nhập số phút về sớm"
                required
                disabled={isLoading}
                min="1"
                max="120"
              />
            )}
            
            <div style={{ gridColumn: '1 / -1' }}>
              <Input
                label="Lý do"
                value={formData.reason}
                onChange={(e) => handleInputChange('reason', e.target.value)}
                placeholder="Nhập lý do đi muộn/về sớm..."
                required
                disabled={isLoading}
              />
            </div>
          </FormGrid>
        </FormSection>
        </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default LateEarlyModal;
