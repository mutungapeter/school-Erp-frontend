"use client";
import DefaultLayout from "@/src/components/adminDashboard/Layouts/DefaultLayout";
import GradingConfigs from "@/src/components/GradingConfigs/GradingConfigs";
// import { DefaultLayout } from "@/src/components/layouts/DefaultLayout";
import PageLoadingSpinner from "@/src/components/layouts/PageLoadingSpinner";
import dynamic from "next/dynamic";
import { Suspense } from "react";
const SubjectGradingScaleConfigurations = () => {
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
     <GradingConfigs />
      </Suspense>
  </DefaultLayout>
  // </ProtectedRoute>
  );
};
export default SubjectGradingScaleConfigurations;
