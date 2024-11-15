import DefaultLayout from "@/src/components/adminDashboard/Layouts/DefaultLayout";
import MeanGradeConfigs from "@/src/components/GradingConfigs/MeanGradeConfig/MeanGradeConfigs";
// import { DefaultLayout } from "@/src/components/layouts/DefaultLayout";
import PageLoadingSpinner from "@/src/components/layouts/PageLoadingSpinner";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const MeanGradeConfigurationsPage = () => {
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
        <MeanGradeConfigs />
      </Suspense>
   </DefaultLayout>
  //  </ProtectedRoute>
  );
};
export default MeanGradeConfigurationsPage;
