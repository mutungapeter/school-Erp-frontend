'use client';
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import PageLoadingSpinner from "@/src/components/layouts/PageLoadingSpinner";
export const usePermissions = () => {
  const { user, loading, error } = useAppSelector((state: RootState) => state.auth);
  
  const hasAdminPermissions = () => {
    return ["Admin", "Principal"].includes(user?.role);
  };
  const hasClassMasterPermissions = () => {
    return user?.role === "Class Master";
  };

  return { hasAdminPermissions, hasClassMasterPermissions,loading  };
};
