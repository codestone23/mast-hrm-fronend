'use client';

import { useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';

const ForgotPasswordRedirect = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/login?forgot=true');
  }, [router]);

  return null;
};

const ForgotPasswordFallback = () => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <p>Đang chuyển hướng...</p>
    </div>
  );
};

const ForgotPasswordPage = () => {
  return (
    <Suspense fallback={<ForgotPasswordFallback />}>
      <ForgotPasswordRedirect />
    </Suspense>
  );
};

export default ForgotPasswordPage;
