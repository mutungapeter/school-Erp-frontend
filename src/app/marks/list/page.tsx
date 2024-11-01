"use client";

import DefaultLayout from "@/src/components/adminDashboard/Layouts/DefaultLayout";
// import { DefaultLayout } from "@/src/components/layouts/DefaultLayout";
import PageLoadingSpinner from "@/src/components/layouts/PageLoadingSpinner";
import MarksList from "@/src/components/Marks/marksList";
import { Suspense } from "react";
const MarksListPage = () => {
  return (
    <DefaultLayout>
      <Suspense fallback={<PageLoadingSpinner />}>
        <MarksList />
      </Suspense>
    </DefaultLayout>
  );
};
export default MarksListPage;
