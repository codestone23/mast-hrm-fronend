"use client";

import { useAuthContext } from "@/contexts/AuthContext";
import { useDivisionInitialization } from "@/hooks/useDivisionInitialization";

export const DivisionInitializer = () => {
  const { user, isAuthenticated } = useAuthContext();

  useDivisionInitialization({
    user,
    isAuthenticated,
  });

  return null;
};

