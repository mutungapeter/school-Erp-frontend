"use client";

import DefaultLayout from "@/src/components/adminDashboard/Layouts/DefaultLayout";
import TeacherLayout from "@/src/components/teacherDashboard/TeacherLayout";
import TeacherSubjectsAndClasses from "@/src/components/teachers/subjectsAndClasses";
import PageLoadingSpinner from "@/src/components/layouts/PageLoadingSpinner";
import { Suspense } from "react";
const SubjectsPage = () => {
 
  return (
    <Suspense fallback={<PageLoadingSpinner />}>
      <TeacherLayout>
        <TeacherSubjectsAndClasses />
      </TeacherLayout>
    </Suspense>
  );
};
export default SubjectsPage;
