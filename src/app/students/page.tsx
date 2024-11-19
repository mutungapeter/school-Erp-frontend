"use client";
import DefaultLayout from "@/src/components/adminDashboard/Layouts/DefaultLayout";
// import { DefaultLayout } from "@/src/components/layouts/DefaultLayout";
import PageLoadingSpinner from "@/src/components/layouts/PageLoadingSpinner";
import { Suspense } from "react";
import Students from "@/src/components/students/Students";
import dynamic from "next/dynamic";
import TeacherLayout from "@/src/components/teacherDashboard/TeacherLayout";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const StudentsPage = () => {

const{ user, loading } = useAppSelector((state: RootState) => state.auth);
const Layout = user?.role === "Teacher" ? TeacherLayout : DefaultLayout;
  return (
    
    <Layout>
      <Suspense fallback={<PageLoadingSpinner />}>
        <Students />
      </Suspense>
    </Layout>

  );
};
export default StudentsPage;
