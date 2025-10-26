'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import ROUTERS from '@/config/router';

const CompanyPage: React.FC = () => {
  const router = useRouter();

  React.useEffect(() => {
    router.push(ROUTERS.COMPANY.ACCOUNTS);
  }, [router]);

  return null;
};

export default CompanyPage;
