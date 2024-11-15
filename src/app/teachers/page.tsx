// import { DefaultLayout } from "@/src/components/layouts/DefaultLayout"
import DefaultLayout from "@/src/components/adminDashboard/Layouts/DefaultLayout"
import PageLoadingSpinner from "@/src/components/layouts/PageLoadingSpinner"
import Teachers from "@/src/components/teachers/Teachers"
import dynamic from "next/dynamic"
import { Suspense } from "react"

const TeachersPage=()=>{
 
  return (
   

    <DefaultLayout>
       <Suspense fallback={<PageLoadingSpinner />}>
      <Teachers />
       </Suspense>
    </DefaultLayout>
  
  )
}
export default TeachersPage