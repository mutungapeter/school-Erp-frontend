"use client";


import DefaultLayout from "@/src/components/adminDashboard/Layouts/DefaultLayout";
import PageLoadingSpinner from "@/src/components/layouts/PageLoadingSpinner";
import ClassPerformance from "@/src/components/perfomance/classPerformance";
import { Suspense } from "react";

const AlumniPage = () => {

  return (

  <DefaultLayout>
    <Suspense fallback={<PageLoadingSpinner />}>
  <ClassPerformance />
    </Suspense>
  </DefaultLayout>

)
};
export default AlumniPage;
