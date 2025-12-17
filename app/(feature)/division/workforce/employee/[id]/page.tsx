import React from "react";
import EmployeeDetail from "@/components/division/workforce/employee/EmployeeDetail";

interface Props {
  params: Promise<{ id: string }>;
}

const Page: React.FC<Props> = async ({ params }) => {
  const { id } = await params;

  return (
    <div style={{ padding: 12 }}>
      <EmployeeDetail id={id} />
    </div>
  );
};

export default Page;
