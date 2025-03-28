"use client";
import DefaultLayout from "@/src/components/adminDashboard/Layouts/DefaultLayout";
import PageLoadingSpinner from "@/src/components/layouts/PageLoadingSpinner";

import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import StudentDetails from "@/src/components/students/studentDetails";
import TeacherLayout from "@/src/components/teacherDashboard/TeacherLayout";
import { Suspense } from "react";
interface DetailProps {
  params: {
    id: number;
  };
}

const StudentDetailsPage = ({ params: { id } }: DetailProps) => {
  const { user, loading } = useAppSelector((state: RootState) => state.auth);
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
