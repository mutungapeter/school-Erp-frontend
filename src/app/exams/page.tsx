"use client";


import DefaultLayout from "@/src/components/adminDashboard/Layouts/DefaultLayout";
import PageLoadingSpinner from "@/src/components/layouts/PageLoadingSpinner";
import Exams from "@/src/components/exams/Exams";
import { Suspense } from "react";

const LessonsPage = () => {

  return (

  <DefaultLayout>

    <Suspense fallback={<PageLoadingSpinner />}>
  <Exams />
    </Suspense>
  </DefaultLayout>


)
};
export default LessonsPage;
