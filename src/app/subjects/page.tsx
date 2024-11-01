"use client";

import DefaultLayout from "@/src/components/adminDashboard/Layouts/DefaultLayout";
// import { DefaultLayout } from "@/src/components/layouts/DefaultLayout";
import PageLoadingSpinner from "@/src/components/layouts/PageLoadingSpinner";
import Subjects from "@/src/components/subjects/Subjects";
import { Suspense } from "react";

const SubjectsPage = () => {
   return (
    <DefaultLayout>

    <Suspense fallback={<PageLoadingSpinner />}>

    <Subjects />
    </Suspense>
    </DefaultLayout>

  );
};
export default SubjectsPage;
