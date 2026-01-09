import React from 'react';
import { Clock, Home, Calendar, Briefcase, AlertCircle } from 'lucide-react';
import { Modal } from '@/components/common';
import {
  ModalContent,
  RequestTypeList,
  RequestTypeItem,
  RequestTypeIcon,
  RequestTypeText,
  RequestTypeCount
} from './requestModalStyles';
import { REQUEST_TYPE } from '@/constants/enums';

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
    id: REQUEST_TYPE.LATE_EARLY,
    name: 'Đi muộn/Về sớm',
    icon: <Clock size={20} />
  },
  {
    id: REQUEST_TYPE.REMOTE_WORK,
    name: 'Làm việc từ xa',
    icon: <Home size={20} />
  },
  {
    id: REQUEST_TYPE.DAY_OFF,
    name: 'Nghỉ phép (có lương/không lương)',
    icon: <Calendar size={20} />
  },
  {
    id: REQUEST_TYPE.OVERTIME,
    name: 'Làm thêm giờ',
    icon: <Briefcase size={20} />
  },
  {
    id: REQUEST_TYPE.FORGOT_CHECKIN,
    name: 'Quên chấm công',
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
      title="Gợi ý loại yêu cầu"
      size="md"
    >
      <ModalContent>
        <div style={{ marginBottom: '16px', color: '#6b7280', fontSize: '14px' }}>
          Chọn loại yêu cầu cho ngày {selectedDate}
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
