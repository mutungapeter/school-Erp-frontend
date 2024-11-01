import DefaultLayout from "@/src/components/adminDashboard/Layouts/DefaultLayout";
import MeanGradeConfigs from "@/src/components/GradingConfigs/MeanGradeConfig/MeanGradeConfigs";
// import { DefaultLayout } from "@/src/components/layouts/DefaultLayout";
import PageLoadingSpinner from "@/src/components/layouts/PageLoadingSpinner";
import { Suspense } from "react";

const MeanGradeConfigurationsPage = () => {
  return (
    <DefaultLayout>
      <Suspense fallback={<PageLoadingSpinner />}>
        <MeanGradeConfigs />
      </Suspense>
   </DefaultLayout>
  );
};
export default MeanGradeConfigurationsPage;
