"use client";
import DefaultLayout from "@/src/components/adminDashboard/Layouts/DefaultLayout";
// import { DefaultLayout } from "@/src/components/layouts/DefaultLayout";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import PageLoadingSpinner from "@/src/components/layouts/PageLoadingSpinner";
import Students from "@/src/components/students/Students";
import TeacherLayout from "@/src/components/teacherDashboard/TeacherLayout";
import { Suspense } from "react";

const StudentsPage = () => {

const{ user, loading } = useAppSelector((state: RootState) => state.auth);
const Layout = user?.role === "Teacher" ? TeacherLayout : DefaultLayout;
  return (
    
    <Layout>
      <Suspense fallback={<PageLoadingSpinner />}>
        <Students />
      </Suspense>
    </Layout>

  );
};
export default StudentsPage;
