'use client'

import DefaultLayout from "@/src/components/adminDashboard/Layouts/DefaultLayout"
// import { DefaultLayout } from "@/src/components/layouts/DefaultLayout"
import PageLoadingSpinner from "@/src/components/layouts/PageLoadingSpinner"
import Marks from "@/src/components/Marks/marks"
import { Suspense } from "react"

const MarksPage=()=>{
  return (
   
      <DefaultLayout>
        <Suspense fallback={<PageLoadingSpinner />}>
         <Marks />
        </Suspense>
      </DefaultLayout>
  )
}
export default MarksPage