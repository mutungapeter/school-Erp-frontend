"use client";


import DefaultLayout from "@/src/components/adminDashboard/Layouts/DefaultLayout";
import PageLoadingSpinner from "@/src/components/layouts/PageLoadingSpinner";

import { Suspense } from "react";
import Announcements from "@/src/components/announcements/Announcements";

const LessonsPage = () => {

  return (

  <DefaultLayout>

    <Suspense fallback={<PageLoadingSpinner />}>
  <Announcements />
    </Suspense>
  </DefaultLayout>


)
};
export default LessonsPage;
