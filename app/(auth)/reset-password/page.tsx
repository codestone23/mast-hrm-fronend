'use client';

import React, { Suspense } from 'react';
import ResetPasswordPage from '@/components/authComponents/reset-password/ResetPasswordPage';
import { Loading } from "@/components/common";

const ResetPasswordContent = () => {
  return <ResetPasswordPage />;
};

const ResetPasswordFallback = () => {
  return <Loading />;
};

export default function ResetPassword() {
  return (
    <Suspense fallback={<ResetPasswordFallback />}>
      <ResetPasswordContent />
    </Suspense>
  );
}
