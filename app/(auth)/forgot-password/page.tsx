'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ROUTERS from "@/config/router";

export default function ForgotPasswordRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace(ROUTERS.AUTH.LOGIN + '?forgot=true');
  }, [router]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontFamily: 'system-ui'
    }}>
      Đang chuyển hướng...
    </div>
  );
}
