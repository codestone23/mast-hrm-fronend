import React from "react";
import { Edit, Trash2, Award, Plus } from "lucide-react";
import { Certificate } from "@/services/profile.service";
import {
  SectionHeader,
  SectionTitle,
  SectionAction,
  CertificateContainer,
  CertificateCard,
  CertificateCardHeader,
  CertificateInfo,
  CertificateTitle,
  CertificateId,
  CertificateDate,
  CertificateActions,
  CertificateActionButton,
  CertificateDeleteButton,
  EmptyState,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateDescription,
} from "../personalInfoStyle";

interface CertificateListProps {
  certificates: Certificate[];
  onAdd: () => void;
  onEdit: (certificate: Certificate) => void;
  onDelete: (certificate: Certificate) => void;
}

const CertificateList: React.FC<CertificateListProps> = ({
  certificates,
  onAdd,
  onEdit,
  onDelete,
}) => {
  return (
    <>
      <SectionHeader>
        <SectionTitle>
          <Award size={20} />
          Chứng chỉ
        </SectionTitle>
        <SectionAction onClick={onAdd}>
          <Plus size={16} />
        </SectionAction>
      </SectionHeader>

      <CertificateContainer>
        {certificates.map((cert, index) => (
          <CertificateCard key={index}>
            <CertificateCardHeader>
              <CertificateInfo>
                <CertificateTitle>Chứng chỉ {cert.name}</CertificateTitle>
                <CertificateId>Tổ chức cấp: {cert.authority}</CertificateId>
                <CertificateDate>
                  Cấp ngày: {new Date(cert.issued_at).toLocaleDateString("vi-VN")}
                </CertificateDate>
              </CertificateInfo>
              <CertificateActions>
                <CertificateActionButton onClick={() => onEdit(cert)}>
                  <Edit size={16} />
                </CertificateActionButton>
                <CertificateDeleteButton onClick={() => onDelete(cert)}>
                  <Trash2 size={16} />
                </CertificateDeleteButton>
              </CertificateActions>
            </CertificateCardHeader>
          </CertificateCard>
        ))}
        {certificates.length === 0 && (
          <EmptyState>
            <EmptyStateIcon>
              <Award size={48} />
            </EmptyStateIcon>
            <EmptyStateTitle>Chưa có chứng chỉ nào</EmptyStateTitle>
            <EmptyStateDescription>
              Nhấn nút + để thêm chứng chỉ mới
            </EmptyStateDescription>
          </EmptyState>
        )}
      </CertificateContainer>
    </>
  );
};

export default CertificateList;

