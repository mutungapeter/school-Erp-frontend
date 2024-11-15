'use client';
import DashboardData from "@/src/components/adminDashboard/dashboard/DashboardContent";
import DefaultLayout from "@/src/components/adminDashboard/Layouts/DefaultLayout";
const DashboardPage=()=>{
 

  return(
    
    <DefaultLayout>
    <DashboardData />
    </DefaultLayout>
  )
}
export default DashboardPage;