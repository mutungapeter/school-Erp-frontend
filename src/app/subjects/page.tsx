"use client";

import DefaultLayout from "@/src/components/adminDashboard/Layouts/DefaultLayout";
// import { DefaultLayout } from "@/src/components/layouts/DefaultLayout";
import PageLoadingSpinner from "@/src/components/layouts/PageLoadingSpinner";
import Subjects from "@/src/components/subjects/Subjects";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const SubjectsPage = () => {
  const ProtectedRoute = dynamic(
    () => import("@/src/app/authorization/authentication"),
    {
      ssr: false,
      loading: () => <PageLoadingSpinner />,
    }
  );
  return (
    // <ProtectedRoute requiredRoles={["Admin", "Principal", "Teacher"]}>

    <DefaultLayout>

    <Suspense fallback={<PageLoadingSpinner />}>

    <Subjects />
    </Suspense>
    </DefaultLayout>
    // </ProtectedRoute>

  );
};
export default SubjectsPage;
