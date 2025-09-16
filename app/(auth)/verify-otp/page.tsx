'use client';

import React, { Suspense } from 'react';
import OtpVerificationPage from '@/components/authComponents/otp-verification/OtpVerificationPage';

const VerifyOtpContent = () => {
  return <OtpVerificationPage />;
};

const VerifyOtpFallback = () => {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontFamily: 'system-ui'
    }}>
      Đang tải...
    </div>
  );
};

export default function VerifyOtp() {
  return (
    <Suspense fallback={<VerifyOtpFallback />}>
      <VerifyOtpContent />
    </Suspense>
  );
}
