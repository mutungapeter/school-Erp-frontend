// import { DefaultLayout } from "@/src/components/layouts/DefaultLayout"
import DefaultLayout from "@/src/components/adminDashboard/Layouts/DefaultLayout"
import PageLoadingSpinner from "@/src/components/layouts/PageLoadingSpinner"
import Teachers from "@/src/components/teachers/Teachers"
import dynamic from "next/dynamic"
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { Suspense } from "react"
import TeacherLayout from "@/src/components/teacherDashboard/TeacherLayout";

const TeachersPage=()=>{
 const{ user, loading } = useAppSelector((state: RootState) => state.auth);
 const Layout = user?.role === "Teacher" ? TeacherLayout : DefaultLayout;
  
  return (
   

    <Layout>
       <Suspense fallback={<PageLoadingSpinner />}>
      <Teachers />
       </Suspense>
    </Layout>
  
  )
}
export default TeachersPage