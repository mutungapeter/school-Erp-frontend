import { DefaultLayout } from "@/src/components/layouts/DefaultLayout";
import PageLoadingSpinner from "@/src/components/layouts/PageLoadingSpinner";
import Reports from "@/src/components/ReportsForms/reports";
import Settings from "@/src/components/settings/Settings";
import dynamic from "next/dynamic";

const SettingsPage=()=>{
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
            <Settings />
        </DefaultLayout>
        // </ProtectedRoute>
    )
}
export default  SettingsPage;