"use client";
import PromotionRecords from "@/src/components/students/promoteStudents/PromotionRecords/PromotionRecords";


import DefaultLayout from "@/src/components/adminDashboard/Layouts/DefaultLayout";
import PageLoadingSpinner from "@/src/components/layouts/PageLoadingSpinner";
import { Suspense } from "react";
import dynamic from "next/dynamic";

const AlumniPage = () => {
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
  <PromotionRecords />
    </Suspense>
  </DefaultLayout>
  // </ProtectedRoute>
)
};
export default AlumniPage;
