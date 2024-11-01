import DefaultLayout from "@/src/components/adminDashboard/Layouts/DefaultLayout"
import FormLevels from "@/src/components/formlevels/Formlevels"
// import { DefaultLayout } from "@/src/components/layouts/DefaultLayout"
import PageLoadingSpinner from "@/src/components/layouts/PageLoadingSpinner"
import { Suspense } from "react"

const FormLevelsPage=()=>{
    return(
        <DefaultLayout>
            <Suspense fallback={<PageLoadingSpinner />}>
        <FormLevels />
            </Suspense>
        </DefaultLayout>
    )
}
export default FormLevelsPage