"use client";
import DefaultLayout from "@/src/components/adminDashboard/Layouts/DefaultLayout";
// import { DefaultLayout } from "@/src/components/layouts/DefaultLayout";
import PageLoadingSpinner from "@/src/components/layouts/PageLoadingSpinner";
import Students from "@/src/components/students/Students";
import { Suspense } from "react";

const StudentsPage = () => {
  return (
    <DefaultLayout>
      <Suspense fallback={<PageLoadingSpinner />}>
        <Students />
      </Suspense>
    </DefaultLayout>
  );
};
export default StudentsPage;
