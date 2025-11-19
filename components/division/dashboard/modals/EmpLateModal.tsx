import React from "react";
import { Modal } from "@/components/common";
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
  Minutes,
} from "./empLateModalStyle";
import { LateEntryData } from "@/types/api";

interface EmpLateModalProps {
  isOpen: boolean;
  onClose: () => void;
  date?: string;
  entries?: LateEntryData[];
}

const SAMPLE_DATA = (n = 10) => {
  return new Array(n).fill(null).map((_, i) => ({
    user_id: i,
    avatar: `https://i.pravatar.cc/100?img=${i}`,
    name: "Nguyen Van A",
    email: "someone@example.com",
    position: "Developer",
    checkin_time: "09:15 AM",
    late_minutes: 15,
    status: "Late",
    duration: "15",
  }));
};

const EmpLateModal: React.FC<EmpLateModalProps> = ({
  isOpen,
  onClose,
  date,
  entries = SAMPLE_DATA(10),
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Thông tin đi muộn"
      size="xl"
    >
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
                <Minutes>{e.late_minutes} phút</Minutes>
              </RightCol>
            </Row>
          ))}
        </List>
      </Wrapper>
    </Modal>
  );
};

export default EmpLateModal;
