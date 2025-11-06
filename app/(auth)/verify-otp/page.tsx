'use client';

import React, { Suspense } from 'react';
import OtpVerificationPage from '@/components/authComponents/otp-verification/OtpVerificationPage';
import { Loading } from "@/components/common";

const VerifyOtpContent = () => {
  return <OtpVerificationPage />;
};

const VerifyOtpFallback = () => {
  return <Loading />;
};

export default function VerifyOtp() {
  return (
    <Suspense fallback={<VerifyOtpFallback />}>
      <VerifyOtpContent />
    </Suspense>
  );
}
