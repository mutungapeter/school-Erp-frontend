import Accounts from "@/src/components/accounts/Accounts"
import DefaultLayout from "@/src/components/adminDashboard/Layouts/DefaultLayout"
// import { DefaultLayout } from "@/src/components/layouts/DefaultLayout"
import PageLoadingSpinner from "@/src/components/layouts/PageLoadingSpinner"
import dynamic from "next/dynamic"
import { Suspense } from "react"

const AccountsPage=()=>{
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
        <Accounts />
            </Suspense>
        </DefaultLayout>
        // </ProtectedRoute>
    )
}
export default  AccountsPage