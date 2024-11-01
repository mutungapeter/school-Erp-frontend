import Accounts from "@/src/components/accounts/Accounts"
import DefaultLayout from "@/src/components/adminDashboard/Layouts/DefaultLayout"
// import { DefaultLayout } from "@/src/components/layouts/DefaultLayout"
import PageLoadingSpinner from "@/src/components/layouts/PageLoadingSpinner"
import { Suspense } from "react"

const AccountsPage=()=>{
    return(
        <DefaultLayout>
            <Suspense fallback={<PageLoadingSpinner />}>
        <Accounts />
            </Suspense>
        </DefaultLayout>
    )
}
export default  AccountsPage