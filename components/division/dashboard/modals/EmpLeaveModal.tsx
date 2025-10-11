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

interface LeaveEntry {
  id: string | number;
  avatar?: string;
  name: string;
  email?: string;
  role?: string;
  times?: string; // e.g. "8h - 10h, 13h30 - 15h30"
  fullDay?: boolean;
  allowed?: boolean;
}

interface EmployeeLeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  date?: string;
  entries?: LeaveEntry[];
}

const SAMPLE_DATA = (n = 10) => {
  return new Array(n).fill(null).map((_, i) => ({
    id: i,
    avatar: `https://i.pravatar.cc/100?img=${i}`,
    name: "Nguyen Van A",
    email: `employee${i}@company.com`,
    role: "Designer",
    times: i % 2 === 0 ? "8h - 12h" : "13h30 - 17h30",
    fullDay: i % 3 === 0,
    allowed: i % 4 !== 0,
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
            <Row key={e.id}>
              <Avatar src={e.avatar || ''} alt={e.name} />
              <Info>
                <Name>{e.name}</Name>
                <Meta>
                  {e.email && <span>{e.email} - </span>}
                  {e.role}
                </Meta>
              </Info>

              <RightCol>
                <TimeText>{e.fullDay ? 'Cả ngày' : e.times}</TimeText>
                <Status allowed={!!e.allowed}>{e.allowed ? 'Có phép' : 'Không phép'}</Status>
              </RightCol>
            </Row>
          ))}
        </List>
      </Wrapper>
    </Modal>
  );
};

export default EmployeeLeaveModal;