'use client'
import Accounts from "@/src/components/accounts/Accounts"
import DefaultLayout from "@/src/components/adminDashboard/Layouts/DefaultLayout"
// import { DefaultLayout } from "@/src/components/layouts/DefaultLayout"
import PageLoadingSpinner from "@/src/components/layouts/PageLoadingSpinner"
import dynamic from "next/dynamic"
import { Suspense } from "react"
import TeacherLayout from "@/src/components/teacherDashboard/TeacherLayout";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
const AccountsPage=()=>{
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
        
   
        <Layout>
            <Suspense fallback={<PageLoadingSpinner />}>
        <Accounts />
            </Suspense>
        </Layout>
  
    )
}
export default  AccountsPage