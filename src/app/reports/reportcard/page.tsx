// import { DefaultLayout } from "@/src/components/layouts/DefaultLayout";
import PageLoadingSpinner from "@/src/components/layouts/PageLoadingSpinner";
import { Suspense } from "react";

import dynamic from 'next/dynamic';
import DefaultLayout from "@/src/components/adminDashboard/Layouts/DefaultLayout";

const Reports = dynamic(() => import('../../../components/ReportsForms/ReportCard'), {
  ssr: false,
  loading: () => <PageLoadingSpinner />,
});
const ReportCardPage=()=>{
    const ProtectedRoute = dynamic(
        () => import("@/src/app/authorization/authentication"),
        {
          ssr: false,
          loading: () => <PageLoadingSpinner />,
        }
      );
      return (
        // <ProtectedRoute requiredRoles={["Admin", "Principal", "Teacher"]}>
    
        <DefaultLayout>
           
            <Reports />
            
        </DefaultLayout>  
        // </ProtectedRoute> 
    )
}
export default ReportCardPage;