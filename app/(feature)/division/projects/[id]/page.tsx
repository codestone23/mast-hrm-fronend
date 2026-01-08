"use client";
import React from "react";
import ProjectDetail from "@/components/personal/projects/ProjectDetail";

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params); 
  return <ProjectDetail projectId={id} isDivision={true} />;
}

