"use client";
import DefaultLayout from "@/src/components/adminDashboard/Layouts/DefaultLayout";
import GradingConfigs from "@/src/components/GradingConfigs/GradingConfigs";
// import { DefaultLayout } from "@/src/components/layouts/DefaultLayout";
import PageLoadingSpinner from "@/src/components/layouts/PageLoadingSpinner";
import { Suspense } from "react";
const SubjectGradingScaleConfigurations = () => {


  return (
    // <DefaultLayout>
      <Suspense fallback={<PageLoadingSpinner />}>
     <GradingConfigs />
      </Suspense>
    // </DefaultLayout>
  );
};
export default SubjectGradingScaleConfigurations;
