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
import { WorkingEntryData } from "@/types/api";

interface EmpWorkModalProps {
  isOpen: boolean;
  onClose: () => void;
  date?: string;
  entries?: WorkingEntryData[];
}

const EmpLateModal: React.FC<EmpWorkModalProps> = ({
  isOpen,
  onClose,
  date,
  entries = [],
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
          {entries?.length > 0 && entries.map((e) => (
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
                <Minutes>{e.duration} phút</Minutes>
              </RightCol>
            </Row>
          ))}
        </List>
      </Wrapper>
    </Modal>
  );
};

export default EmpLateModal;
