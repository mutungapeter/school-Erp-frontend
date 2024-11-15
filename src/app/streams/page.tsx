// import { DefaultLayout } from "@/src/components/layouts/DefaultLayout"
import DefaultLayout from "@/src/components/adminDashboard/Layouts/DefaultLayout"
import PageLoadingSpinner from "@/src/components/layouts/PageLoadingSpinner"
import Streams from "@/src/components/streams/Streams"
import dynamic from "next/dynamic"
import { Suspense } from "react"

const StreamsPage=()=>{
    
      return (
        
        <DefaultLayout>
            <Suspense fallback={<PageLoadingSpinner />}>
        <Streams />
            </Suspense>
        </DefaultLayout>
       
    )
}
export default StreamsPage