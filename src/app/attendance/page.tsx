"use client";


import DefaultLayout from "@/src/components/adminDashboard/Layouts/DefaultLayout";
import PageLoadingSpinner from "@/src/components/layouts/PageLoadingSpinner";

import { Suspense } from "react";
import Attendance from "@/src/components/attendance/Attendance";

const LessonsPage = () => {

  return (

  <DefaultLayout>

    <Suspense fallback={<PageLoadingSpinner />}>
  <Attendance />
    </Suspense>
  </DefaultLayout>


)
};
export default LessonsPage;
