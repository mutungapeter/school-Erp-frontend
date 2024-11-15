"use client";
import { useGetStudentQuery } from "@/redux/queries/students/studentsApi";
import { useGetTeacherQuery } from "@/redux/queries/teachers/teachersApi";
import DefaultLayout from "@/src/components/adminDashboard/Layouts/DefaultLayout";
import PageLoadingSpinner from "@/src/components/layouts/PageLoadingSpinner";

import StudentDetails from "@/src/components/students/studentDetails";
import { SerializedError } from "@reduxjs/toolkit";
import TeacherLayout from "@/src/components/teacherDashboard/TeacherLayout";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
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

const StudentDetailsPage = ({ params: { id } }: DetailProps) => {
  const { data, isLoading, isSuccess, error, refetch } = useGetStudentQuery(id);
  console.log("data", data);
  const{ user, loading } = useAppSelector((state: RootState) => state.auth);
  const Layout = user?.role === "Teacher" ? TeacherLayout : DefaultLayout;
   
  if (isLoading) {
    return (
      <Layout>
        <PageLoadingSpinner />
      </Layout>
    );
  }

const refetchDetails=()=>{
  refetch();
}
  if (error) {
    const apiError = error as ApiError | SerializedError;
    const errorMessage =
      "data" in apiError && apiError.data?.error
        ? apiError.data.error
        : "Error loading teacher details. Please try again later.";

    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <div className="text-red-500  text-center p-6 text-xs lg:text-lg  md:text-lg  bg-white rounded shadow-md">
            <p>{errorMessage}</p>
          </div>
        </div>
      </Layout>
    );
  }
  return (
    <Layout>
      {isSuccess && data && <StudentDetails data={data} refetchDetails={refetchDetails} />}
    </Layout>
  );
};
export default StudentDetailsPage;
