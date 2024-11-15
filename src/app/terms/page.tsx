import DefaultLayout from "@/src/components/adminDashboard/Layouts/DefaultLayout";
import Terms from "@/src/components/terms/Terms";

const TermsPage = () => {

    return(
        <DefaultLayout>
        {/* <Suspense fallback={<PageLoadingSpinner />}> */}
       <Terms />
        {/* </Suspense> */}
     </DefaultLayout>
    )
}
export default TermsPage