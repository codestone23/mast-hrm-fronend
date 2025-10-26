'use client';

import AccountDetail from "@/components/company/account/AccountDetail";
import React, { use } from 'react';

interface AccountDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

const AccountDetailPage: React.FC<AccountDetailPageProps> = ({ params }) => {
  const { id } = use(params);
  return <AccountDetail accountId={id} />;
};

export default AccountDetailPage;
