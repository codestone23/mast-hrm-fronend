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

const EmployeeLeaveModal: React.FC<EmployeeLeaveModalProps> = ({
  isOpen,
  onClose,
  date,
  entries = [],
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nhân viên nghỉ phép" size="xl">
      <Wrapper>
        <DateLabel>{date}</DateLabel>

        <List>
          {entries.length > 0 && entries.map((e) => (
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