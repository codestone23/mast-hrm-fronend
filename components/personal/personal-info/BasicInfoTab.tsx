import React from "react";
import { Edit } from "lucide-react";
import { UserProfile } from "@/constants/types";
import {
  SectionHeader,
  SectionTitle,
  SectionAction,
  InfoGrid,
  InfoItem,
  InfoLabel,
  InfoValue,
} from "./personalInfoStyle";

interface BasicInfoTabProps {
  data?: UserProfile;
  onEdit: () => void;
}

const BasicInfoTab: React.FC<BasicInfoTabProps> = ({ data, onEdit }) => {
  return (
    <>
      <SectionHeader>
        <SectionTitle>Thông tin cá nhân</SectionTitle>
        <SectionAction onClick={onEdit}>
          <Edit size={16} />
        </SectionAction>
      </SectionHeader>

      <InfoGrid>
        <InfoItem>
          <InfoLabel>Ngày sinh</InfoLabel>
          <InfoValue>
            {data?.user_information?.birthday
              ? new Date(data.user_information?.birthday).toLocaleDateString("vi-VN")
              : "Không có"}
          </InfoValue>
        </InfoItem>
        <InfoItem>
          <InfoLabel>Quốc tịch</InfoLabel>
          <InfoValue>
            {data?.user_information?.nationality || "Không có"}
          </InfoValue>
        </InfoItem>
        <InfoItem>
          <InfoLabel>Giới tính</InfoLabel>
          <InfoValue>
            {data?.user_information?.gender || "Không có"}
          </InfoValue>
        </InfoItem>
        <InfoItem>
          <InfoLabel>Số điện thoại</InfoLabel>
          <InfoValue>
            {data?.user_information?.phone || "Không có"}
          </InfoValue>
        </InfoItem>
        <InfoItem>
          <InfoLabel>Tình trạng hôn nhân</InfoLabel>
          <InfoValue>
            {data?.user_information?.marital || "Chưa kết hôn"}
          </InfoValue>
        </InfoItem>
        <InfoItem>
          <InfoLabel>Phòng ban (Nhóm)</InfoLabel>
          <InfoValue>
            {data?.user_information?.office_id || "Không có"}
          </InfoValue>
        </InfoItem>
        <InfoItem>
          <InfoLabel>Địa chỉ tạm trú</InfoLabel>
          <InfoValue>
            {data?.user_information?.temp_address || "Không có"}
          </InfoValue>
        </InfoItem>
        <InfoItem>
          <InfoLabel>Địa chỉ thường trú</InfoLabel>
          <InfoValue>
            {data?.user_information?.address || "Không có"}
          </InfoValue>
        </InfoItem>
        <InfoItem>
          <InfoLabel>Email cá nhân</InfoLabel>
          <InfoValue>
            {data?.user_information?.personal_email || "Không có"}
          </InfoValue>
        </InfoItem>
      </InfoGrid>
    </>
  );
};

export default BasicInfoTab;

