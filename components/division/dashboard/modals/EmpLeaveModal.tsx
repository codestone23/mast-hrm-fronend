import React from 'react';
import { Modal } from '@/components/common';
import {
  Wrapper,
  DateLabel,
  List,
  Row,
  Avatar,
  Info,
  Name,
  Meta,
  RightCol,
  TimeText,
  Status,
} from './empLeaveModalStyle';
import { LeaveEntryData } from '@/types/api';   

interface EmployeeLeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  date?: string;
  entries?: LeaveEntryData[];
}

const SAMPLE_DATA = (n = 10) => {
  return new Array(n).fill(null).map((_, i) => ({
    user_id: i,
    avatar: `https://i.pravatar.cc/100?img=${i}`,
    name: "Nguyen Van A",
    email: `employee${i}@company.com`,
    position: "Designer",
    leave_type: "Personal Leave",
    reason: "Personal matters",
    start_date: "2024-06-15",
    end_date: "2024-06-15",
    status: i % 4 === 0 ? "Rejected" : i % 3 === 0 ? "Approved" : "Pending",
    duration: "4 hours",
  }));
};

const EmployeeLeaveModal: React.FC<EmployeeLeaveModalProps> = ({
  isOpen,
  onClose,
  date,
  entries = SAMPLE_DATA(10),
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nhân viên nghỉ phép" size="xl">
      <Wrapper>
        <DateLabel>{date}</DateLabel>

        <List>
          {entries.map((e) => (
            <Row key={e.user_id}>
              <Avatar src={e.avatar && e.avatar.includes('https') ? e.avatar : `/images/background-login.png`} alt={e.name} />
              <Info>
                <Name>{e.name}</Name>
                <Meta>
                  {e.email && <span>{e.email} - </span>}
                  {e.position}
                </Meta>
              </Info>

              <RightCol>
                <TimeText>{e.duration}</TimeText>
                <Status allowed={!!e.status}>{e.status}</Status>
              </RightCol>
            </Row>
          ))}
        </List>
      </Wrapper>
    </Modal>
  );
};

export default EmployeeLeaveModal;