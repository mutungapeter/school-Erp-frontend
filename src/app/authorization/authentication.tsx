// ProtectedRoute.tsx
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import React from "react";

import PageLoadingSpinner from "@/src/components/layouts/PageLoadingSpinner";
interface ProtectedRouteProps {
  requiredRoles: string[];
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRoles, children }) => {
  const { user, loading } = useAppSelector((state: RootState) => state.auth);
  const router = useRouter();


  // if (loading) {
  //   return (
  //     <DefaultLayout>
  //       <PageLoadingSpinner />
  //     </DefaultLayout>
  //   );
  // }

 
  if (!user || !requiredRoles.includes(user.role)) {
    
    router.push("/");
    return null; 
  }

 
  return <>{children}</>;
};

export default ProtectedRoute;
