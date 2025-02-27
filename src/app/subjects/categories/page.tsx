"use client";

import DefaultLayout from "@/src/components/adminDashboard/Layouts/DefaultLayout";
import PageLoadingSpinner from "@/src/components/layouts/PageLoadingSpinner";
import Subjects from "@/src/components/subjects/Subjects";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import TeacherLayout from "@/src/components/teacherDashboard/TeacherLayout";
import Categories from "@/src/components/subjects/Categories/SubjectCatgeories";
const SubjectCatgeoriesPage = () => {
 
  const{ user, loading } = useAppSelector((state: RootState) => state.auth);
  const Layout = user?.role === "Teacher" ? TeacherLayout : DefaultLayout;
  return (

    <DefaultLayout>

    <Suspense fallback={<PageLoadingSpinner />}>

    <Categories />
    </Suspense>
    </DefaultLayout>
   

  );
};
export default SubjectCatgeoriesPage;
