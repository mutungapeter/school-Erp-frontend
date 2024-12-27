"use client";


import DefaultLayout from "@/src/components/adminDashboard/Layouts/DefaultLayout";
import PageLoadingSpinner from "@/src/components/layouts/PageLoadingSpinner";

import { Suspense } from "react";
import Assignments from "@/src/components/assignments/Assignments";

const LessonsPage = () => {

  return (

  <DefaultLayout>

    <Suspense fallback={<PageLoadingSpinner />}>
  <Assignments />
    </Suspense>
  </DefaultLayout>


)
};
export default LessonsPage;
