import React from 'react';
import { Clock, Home, Calendar, Briefcase, AlertCircle } from 'lucide-react';
import { Modal } from '@/components/common';
import { RequestModalType } from './modalTypes';
import {
  ModalContent,
  RequestTypeList,
  RequestTypeItem,
  RequestTypeIcon,
  RequestTypeText,
  RequestTypeCount
} from './requestModalStyles';

interface RequestType {
  id: string;
  name: string;
  icon: React.ReactNode;
  count?: number;
}

interface RequestTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRequestType: (requestType: string) => void;
  selectedDate: string;
}

const requestTypes: RequestType[] = [
  {
    id: RequestModalType.LATE_ARRIVAL,
    name: 'Đăng ký đi muộn đầu ca',
    icon: <Clock size={20} />
  },
  {
    id: RequestModalType.EARLY_DEPARTURE,
    name: 'Đăng ký về sớm',
    icon: <Clock size={20} />
  },
  {
    id: RequestModalType.REMOTE_WORK,
    name: 'Đăng ký làm việc từ xa',
    icon: <Home size={20} />
  },
  {
    id: RequestModalType.UNPAID_LEAVE,
    name: 'Nghỉ không lương',
    icon: <Calendar size={20} />
  },
  {
    id: RequestModalType.PAID_LEAVE,
    name: 'Nghỉ phép',
    icon: <Calendar size={20} />
  },
  {
    id: RequestModalType.REGULAR_OVERTIME,
    name: 'Đăng ký OT ngày thường',
    icon: <Briefcase size={20} />
  },
  {
    id: RequestModalType.FORGOT_TIMEKEEPING,
    name: 'Đăng ký quên chấm công',
    icon: <AlertCircle size={20} />
  }
];

const RequestTypeModal: React.FC<RequestTypeModalProps> = ({
  isOpen,
  onClose,
  onSelectRequestType,
  selectedDate
}) => {
  const handleSelectRequestType = (requestTypeId: string) => {
    onSelectRequestType(requestTypeId);
    // Don't call onClose() here - let the parent handle modal state
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Gợi ý đề xuất"
      size="md"
    >
      <ModalContent>
        <div style={{ marginBottom: '16px', color: '#6b7280', fontSize: '14px' }}>
          Chọn loại đề xuất cho ngày {selectedDate}
        </div>
        
        <RequestTypeList>
          {requestTypes.map((requestType) => (
            <RequestTypeItem
              key={requestType.id}
              onClick={() => handleSelectRequestType(requestType.id)}
            >
              <RequestTypeIcon>
                {requestType.icon}
              </RequestTypeIcon>
              <RequestTypeText>
                {requestType.name}
              </RequestTypeText>
              {requestType.count !== undefined && (
                <RequestTypeCount>
                  {requestType.count}
                </RequestTypeCount>
              )}
            </RequestTypeItem>
          ))}
        </RequestTypeList>
      </ModalContent>
    </Modal>
  );
};

export default RequestTypeModal;
