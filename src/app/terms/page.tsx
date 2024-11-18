'use client';
import DefaultLayout from "@/src/components/adminDashboard/Layouts/DefaultLayout";
import Terms from "@/src/components/terms/Terms";
import PageLoadingSpinner from "@/src/components/layouts/PageLoadingSpinner";
import { Suspense } from "react";
const TermsPage = () => {

    return(
        <DefaultLayout>
        <Suspense fallback={<PageLoadingSpinner />}>
       <Terms />
        </Suspense>
     </DefaultLayout>
    )
}
export default TermsPage