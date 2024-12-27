"use client";

import DefaultLayout from "@/src/components/adminDashboard/Layouts/DefaultLayout";
// import { DefaultLayout } from "@/src/components/layouts/DefaultLayout";
import PageLoadingSpinner from "@/src/components/layouts/PageLoadingSpinner";
import Subjects from "@/src/components/subjects/Subjects";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import TeacherLayout from "@/src/components/teacherDashboard/TeacherLayout";
const SubjectsPage = () => {
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

    <Subjects />
    </Suspense>
    </Layout>
    // </ProtectedRoute>

  );
};
export default SubjectsPage;
