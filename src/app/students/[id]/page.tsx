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
import { ClassLevel } from "@/src/definitions/classlevels";
import { useRouter, useSearchParams } from "next/navigation";
import { useDeleteClassLevelsMutation, useGetClassesQuery } from "@/redux/queries/classes/classesApi";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
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

const StudentDetailsPage = ({ params: { id } }: DetailProps) => {

  const{ user, loading } = useAppSelector((state: RootState) => state.auth);
  const Layout = user?.role === "Teacher" ? TeacherLayout : DefaultLayout;
   
 



  return (
    <Layout>
      <>
      <Suspense fallback={<PageLoadingSpinner />}>
      
      
      {/* {isSuccess && data && <StudentDetails data={data} refetchDetails={refetchDetails} />} */}
      <StudentDetails student_id={id} />
      </Suspense>
      </>
    </Layout>
  );
};
export default StudentDetailsPage;
