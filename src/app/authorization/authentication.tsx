'use client';
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

import PageLoadingSpinner from "@/src/components/layouts/PageLoadingSpinner";
import { DefaultLayout } from "@/src/components/layouts/DefaultLayout";
interface ProtectedRouteProps {
  requiredRoles: string[];
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRoles, children }) => {
  const { user, loading } = useAppSelector((state: RootState) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !requiredRoles.includes(user.role))) {
      router.push("/");
    }
  }, [loading, user, requiredRoles, router]);

  if (loading) {
    // console.log("Loading spinner should show");
    return <PageLoadingSpinner />;
  }
  
  // console.log("User:", user);
  // console.log("Required roles:", requiredRoles);
  

 
  if (!user || !requiredRoles.includes(user.role)) {
    return <PageLoadingSpinner />;
  }

 
  return <>{children}</>;
};

export default ProtectedRoute;
