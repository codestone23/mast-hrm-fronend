'use client';

import React, { Suspense } from 'react';
import AuthContainer, { AuthView } from '@/components/authComponents/AuthContainer';
import { useSearchParams } from 'next/navigation';

const LoginContent = () => {
  const searchParams = useSearchParams();
  const forgot: AuthView = searchParams.get('forgot') as AuthView;

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