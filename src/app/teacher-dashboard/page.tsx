'use client';

import DashboardData from "@/src/components/teacherDashboard/teacherDashboardContent";
import TeacherLayout from "@/src/components/teacherDashboard/TeacherLayout";

const DashboardPage=()=>{
  return(
    <TeacherLayout>
    <DashboardData />
    </TeacherLayout>
  )
}
export default DashboardPage;