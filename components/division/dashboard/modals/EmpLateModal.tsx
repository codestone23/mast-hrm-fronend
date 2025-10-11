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

interface EmpLateEntry {
  id: string | number;
  avatar?: string;
  name: string;
  email?: string;
  role?: string;
  minutes: number; // minutes late
}

interface EmpLateModalProps {
  isOpen: boolean;
  onClose: () => void;
  date?: string;
  entries?: EmpLateEntry[];
}

const SAMPLE_DATA = (n = 10) => {
  return new Array(n).fill(null).map((_, i) => ({
    id: i,
    avatar: `https://i.pravatar.cc/100?img=${i}`,
    name: "Nguyen Van A",
    email: "someone@example.com",
    role: "Designer",
    minutes: Math.floor(Math.random() * 60) + 1,
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
            <Row key={e.id}>
              <Avatar src={e.avatar} alt={e.name} />
              <Info>
                <Name>{e.name}</Name>
                <Meta>
                  {e.email && <span>{e.email} - </span>}
                  {e.role}
                </Meta>
              </Info>

              <RightCol>
                <Minutes>{e.minutes} phút</Minutes>
              </RightCol>
            </Row>
          ))}
        </List>
      </Wrapper>
    </Modal>
  );
};

export default EmpLateModal;
