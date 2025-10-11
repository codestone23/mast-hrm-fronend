"use client";

import React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import EmployeeDetail from "@/components/division/workforce/employee/EmployeeDetail";

interface Props {
  params: { id: string };
}

const Page: React.FC<Props> = ({ params }) => {
  const { id } = params;

  // In this simple implementation we just render the client detail component.
  // Later you can fetch server-side data here and pass it down as props.
  return (
    <div style={{ padding: 12 }}>
      <EmployeeDetail id={id} />
    </div>
  );
};

export default Page;
