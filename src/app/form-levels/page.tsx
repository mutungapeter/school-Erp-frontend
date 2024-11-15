import DefaultLayout from "@/src/components/adminDashboard/Layouts/DefaultLayout"
import FormLevels from "@/src/components/formlevels/Formlevels"
// import { DefaultLayout } from "@/src/components/layouts/DefaultLayout"
import PageLoadingSpinner from "@/src/components/layouts/PageLoadingSpinner"
import dynamic from "next/dynamic"
import { Suspense } from "react"

const FormLevelsPage=()=>{
    const ProtectedRoute = dynamic(
        () => import("@/src/app/authorization/authentication"),
        {
          ssr: false,
          loading: () => <PageLoadingSpinner />,
        }
      );
      return (
        // <ProtectedRoute requiredRoles={["Admin", "Principal", "Teacher"]}>
    
        <DefaultLayout>
            <Suspense fallback={<PageLoadingSpinner />}>
        <FormLevels />
            </Suspense>
        </DefaultLayout>
        // </ProtectedRoute>
    )
}
export default FormLevelsPage