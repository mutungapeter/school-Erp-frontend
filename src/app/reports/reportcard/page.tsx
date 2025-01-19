'use client';
import PageLoadingSpinner from "@/src/components/layouts/PageLoadingSpinner";
import { Suspense } from "react";
import TeacherLayout from "@/src/components/teacherDashboard/TeacherLayout";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import dynamic from 'next/dynamic';
import DefaultLayout from "@/src/components/adminDashboard/Layouts/DefaultLayout";
import ContentSpinner from "@/src/components/perfomance/contentSpinner";

const Reports = dynamic(() => import('../../../components/ReportsForms/ReportCard'), {
  ssr: false,
  loading: () => <ContentSpinner />,
});
const ReportCardPage=()=>{
    const ProtectedRoute = dynamic(
        () => import("@/src/app/authorization/authentication"),
        {
          ssr: false,
          loading: () => <PageLoadingSpinner />,
        }
      );
      const{ user, loading } = useAppSelector((state: RootState) => state.auth);
const Layout = user?.role === "Teacher" ? TeacherLayout : DefaultLayout;
  console.log("user", user)
      return (
        <Layout>
           
            <Reports />
            
        </Layout>  
       
    )
}
export default ReportCardPage;