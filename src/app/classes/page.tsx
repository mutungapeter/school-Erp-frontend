"use client";

import DefaultLayout from "@/src/components/adminDashboard/Layouts/DefaultLayout";
import Classes from "@/src/components/classlevels/ClassLevel";
// import { DefaultLayout } from "@/src/components/layouts/DefaultLayout";
import PageLoadingSpinner from "@/src/components/layouts/PageLoadingSpinner";
import dynamic from "next/dynamic";
import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "@/node_modules/@types/js-cookie";
const ClassesPage = () => {
  return (
    <DefaultLayout>
      <Suspense fallback={<PageLoadingSpinner />}>
        <Classes />
      </Suspense>
    </DefaultLayout>
  );
};
export default ClassesPage;
