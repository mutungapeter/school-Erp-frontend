"use client";

import DefaultLayout from "@/src/components/adminDashboard/Layouts/DefaultLayout";
import TeacherLayout from "@/src/components/teacherDashboard/TeacherLayout";
import TeacherSubjectsAndClasses from "@/src/components/teachers/subjectsAndClasses";

const SubjectsPage = () => {
 
  return (
    
      <TeacherLayout>
        <TeacherSubjectsAndClasses />
      </TeacherLayout>
  );
};
export default SubjectsPage;
