import React from "react";
import TeamDetail from "@/components/division/workforce/team/TeamDetail";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  return <TeamDetail id={id} />;
}
