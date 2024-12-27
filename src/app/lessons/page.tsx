"use client";


import DefaultLayout from "@/src/components/adminDashboard/Layouts/DefaultLayout";
import PageLoadingSpinner from "@/src/components/layouts/PageLoadingSpinner";
import Lessons from "@/src/components/lessons/Lessons";
import { Suspense } from "react";

const LessonsPage = () => {

  return (

  <DefaultLayout>

    <Suspense fallback={<PageLoadingSpinner />}>
  <Lessons />
    </Suspense>
  </DefaultLayout>


)
};
export default LessonsPage;
