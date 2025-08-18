'use client';

import { useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';

const ForgotPasswordContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const ForgotPasswordRedirect = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/login?forgot=true');
  }, [router]);

  return null;
};

const ForgotPasswordFallback = () => {
  return (
    <ForgotPasswordContainer>
      <p>Đang chuyển hướng...</p>
    </ForgotPasswordContainer>
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
