"use client";

import React, { Suspense } from "react";
import AuthContainer from "@/components/authComponents/AuthContainer";
import { useSearchParams } from "next/navigation";

const LoginContent = () => {
  const searchParams = useSearchParams();
  const forgot = searchParams.get("forgot") || undefined;

  return <AuthContainer forgot={forgot} />;
};

const LoginFallback = () => {
  return <AuthContainer />;
};

const LoginPage: React.FC = () => {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginContent />
    </Suspense>
  );
};

export default LoginPage;
