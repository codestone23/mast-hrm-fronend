"use client";

import React from 'react';
import DivisionDetail from "@/components/company/division/divisionDetail/DivisionDetail";
import { useParams } from "next/navigation";

const DivisionDetailPage: React.FC = () => {
  const params = useParams<{ id: string }>();
  return <DivisionDetail divisionId={Number(params.id)} />;
};

export default DivisionDetailPage;

