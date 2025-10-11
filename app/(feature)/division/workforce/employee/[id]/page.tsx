import React from "react";
import EmployeeDetail from "@/components/division/workforce/employee/EmployeeDetail";

interface Props {
  params: Promise<{ id: string }>;
}

const Page: React.FC<Props> = async ({ params }) => {
  const { id } = await params;

  // In this simple implementation we just render the client detail component.
  // Later you can fetch server-side data here and pass it down as props.
  return (
    <div style={{ padding: 12 }}>
      <EmployeeDetail id={id} />
    </div>
  );
};

export default Page;
