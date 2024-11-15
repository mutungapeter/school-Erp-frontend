// PermissionsWrapper.tsx
import { ReactNode } from "react";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import PageLoadingSpinner from "@/src/components/layouts/PageLoadingSpinner";
import DefaultLayout from "@/src/components/adminDashboard/Layouts/DefaultLayout";

interface PermissionsWrapperProps {
  children: ReactNode;
  rolesAllowed: string[];
}

const AdminPermissions = ({ children, rolesAllowed }: PermissionsWrapperProps) => {
  const { user, loading } = useAppSelector((state: RootState) => state.auth);

  if (loading) {
    return (
        <PageLoadingSpinner />
    ); 
  }

  
  const hasPermission = user && rolesAllowed.includes(user.role);

  return hasPermission ? <>{children}</> : null;
};

export default AdminPermissions;
