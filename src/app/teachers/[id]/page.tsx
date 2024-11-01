"use client";
import { useGetTeacherQuery } from "@/redux/queries/teachers/teachersApi";
import DefaultLayout from "@/src/components/adminDashboard/Layouts/DefaultLayout";
// import { DefaultLayout } from "@/src/components/layouts/DefaultLayout";
import PageLoadingSpinner from "@/src/components/layouts/PageLoadingSpinner";
import Spinner from "@/src/components/layouts/spinner";
import TeacherDetails from "@/src/components/teachers/TeacherDetail";
import { SerializedError } from "@reduxjs/toolkit";

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
  const { data, isLoading, isSuccess, error, refetch } = useGetTeacherQuery(id);
  console.log("data", data);

  if (isLoading) {
    return (
      <DefaultLayout>
        <PageLoadingSpinner />
      </DefaultLayout>
    );
  }

  if (error) {
    const apiError = error as ApiError | SerializedError;
    const errorMessage = "data" in apiError && apiError.data?.error  ? apiError.data.error : "Error loading teacher details. Please try again later.";

    return (
      <DefaultLayout>
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <div className="text-red-500  text-center p-6 text-xs lg:text-lg  md:text-lg  bg-white rounded shadow-md">
            <p>{errorMessage}</p>
          </div>
        </div>
      </DefaultLayout>
    );
  }
  return (
    <DefaultLayout>
      {isSuccess && data && <TeacherDetails data={data} />}
    </DefaultLayout>
  );
};
export default Teacher;
