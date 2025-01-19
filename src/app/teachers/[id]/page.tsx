"use client";
import { useGetTeacherQuery } from "@/redux/queries/teachers/teachersApi";
import DefaultLayout from "@/src/components/adminDashboard/Layouts/DefaultLayout";
// import { DefaultLayout } from "@/src/components/layouts/DefaultLayout";
import PageLoadingSpinner from "@/src/components/layouts/PageLoadingSpinner";
import Spinner from "@/src/components/layouts/spinner";
import TeacherDetails from "@/src/components/teachers/TeacherDetail";
import { SerializedError } from "@reduxjs/toolkit";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import TeacherLayout from "@/src/components/teacherDashboard/TeacherLayout";
import { Suspense } from "react";
interface DetailProps {
  params: {
    id: number;
  };
}

interface ApiError {
  status: number;
  data: {
    error: string;
  };
}

const Teacher = ({ params: { id } }: DetailProps) => {
 const { user, loading } = useAppSelector((state: RootState) => state.auth);
  const Layout = user?.role === "Teacher" ? TeacherLayout : DefaultLayout;

   
  return (
    <Layout>
       <Suspense fallback={<PageLoadingSpinner />}>
       <TeacherDetails teacher_id={id} />
       </Suspense>
    </Layout>
  );
};
export default Teacher;
