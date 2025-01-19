"use client";
import PageLoadingSpinner from "@/src/components/layouts/PageLoadingSpinner";

import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import DefaultLayout from "@/src/components/adminDashboard/Layouts/DefaultLayout";
import TeacherLayout from "@/src/components/teacherDashboard/TeacherLayout";
import StudentDetails from "@/src/components/students/studentDetails";
import { Suspense } from "react";
import StudentSubjects from "@/src/components/students/promoteStudents/StudentSubjects";

interface DetailProps {
  params: {
    id: number;
  };
}

const StudentSubjectsPage = ({ params: { id } }: DetailProps) => {
  const { user, loading } = useAppSelector((state: RootState) => state.auth);
  const Layout = user?.role === "Teacher" ? TeacherLayout : DefaultLayout;

  return (
    <Layout>
      <>
        <Suspense fallback={<PageLoadingSpinner />}>
          <StudentSubjects student_id={id} />
        </Suspense>
      </>
    </Layout>
  );
};
export default StudentSubjectsPage;
