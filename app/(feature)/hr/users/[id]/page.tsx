'use client';

import UserDetail from "@/components/hr/user/UserDetail";
import React, { use } from 'react';

interface UserDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

const UserDetailPage: React.FC<UserDetailPageProps> = ({ params }) => {
  const { id } = use(params);
  return <UserDetail userId={id} />;
};

export default UserDetailPage;