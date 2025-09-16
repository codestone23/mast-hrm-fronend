'use client';

import React, { Suspense } from 'react';
import ResetPasswordPage from '@/components/authComponents/reset-password/ResetPasswordPage';

const ResetPasswordContent = () => {
  return <ResetPasswordPage />;
};

const ResetPasswordFallback = () => {
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

export default function ResetPassword() {
  return (
    <Suspense fallback={<ResetPasswordFallback />}>
      <ResetPasswordContent />
    </Suspense>
  );
}
