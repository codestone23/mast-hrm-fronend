import React from "react";
import TeamDetail from "@/components/division/workforce/team/TeamDetail";

interface Props {
  params: { id: string };
}

export default function Page({ params }: Props) {
  return <TeamDetail id={params.id} />;
}
