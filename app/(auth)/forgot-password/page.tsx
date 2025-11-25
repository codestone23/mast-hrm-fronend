"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import ROUTERS from "@/config/router";
import styled from "styled-components";

const ForgotWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-family: system-ui;
`;

export default function ForgotPasswordRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace(ROUTERS.AUTH.LOGIN + "?forgot=true");
  }, [router]);

  return <ForgotWrapper>Đang chuyển hướng...</ForgotWrapper>;
}
