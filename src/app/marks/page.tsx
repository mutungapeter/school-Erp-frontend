'use client'

import DefaultLayout from "@/src/components/adminDashboard/Layouts/DefaultLayout"
// import { DefaultLayout } from "@/src/components/layouts/DefaultLayout"
import PageLoadingSpinner from "@/src/components/layouts/PageLoadingSpinner"
import Marks from "@/src/components/Marks/marks"
import dynamic from "next/dynamic"
import { Suspense } from "react"
import TeacherLayout from "@/src/components/teacherDashboard/TeacherLayout";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
const MarksPage=()=>{
  const ProtectedRoute = dynamic(
    () => import("@/src/app/authorization/authentication"),
    {
      ssr: false,
      loading: () => <PageLoadingSpinner />,
    }
  );
  const{ user, loading } = useAppSelector((state: RootState) => state.auth);
const Layout = user?.role === "Teacher" ? TeacherLayout : DefaultLayout;
 
  
  return (
    // <ProtectedRoute requiredRoles={["Admin", "Principal", "Teacher"]}>

      <Layout>
        <Suspense fallback={<PageLoadingSpinner />}>
         <Marks />
        </Suspense>
      </Layout>
      // </ProtectedRoute>
  )
}
export default MarksPage