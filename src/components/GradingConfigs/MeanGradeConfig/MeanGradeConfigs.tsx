"use client";
// import { DefaultLayout } from "@/src/components/layouts/DefaultLayout";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useGetMeanGradeConfigsQuery } from "@/redux/queries/gradingConfig/meanGradeConfig";
import DeleteMeanGradeConfig from "./DeleteMeanGradeConfig";
import { EditMeanGradeConfig } from "./EditMeanGradeConfig";
import { CreateMeanGradeConfig } from "./NewMeanGradingConfig";
import PageLoadingSpinner from "../../layouts/PageLoadingSpinner";
import DefaultLayout from "../../adminDashboard/Layouts/DefaultLayout";
import { PAGE_SIZE } from "@/src/constants/constants";
import { usePermissions } from "@/src/hooks/hasAdminPermission";


const MeanGradeConfigs = () => {
  const pageSize = PAGE_SIZE;
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const pageParam = searchParams.get("page");
  const [currentPage, setCurrentPage] = useState<number>(
    parseInt(pageParam || "1")
  );
  const router = useRouter();
  const { hasAdminPermissions, loading: loadingPermissions } = usePermissions();
  const {
    isLoading: loadingMeangradeConfigs,
    data: meanGradeData,
    refetch,
  } = useGetMeanGradeConfigsQuery(
    { page: currentPage || 1, page_size: pageSize },
    { refetchOnMountOrArgChange: true }
  );
  useEffect(() => {
    const page = parseInt(pageParam || "1");
    if (page !== currentPage) {
      setCurrentPage(page);
    }
  }, [pageParam, currentPage]);

  useEffect(() => {
    refetch();
  }, [currentPage, refetch]);

  const totalPages = Math.ceil((meanGradeData?.count || 0) / pageSize);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.set("page", page.toString());
    router.push(`?${currentParams.toString()}`);
  };

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }
  const refetchMeanGradeConfigs  = () => {
    refetch();
  };
 
if (loadingPermissions) {
    return <PageLoadingSpinner />;
  }
  console.log("meanGradeData", meanGradeData);
  return (
   
      <div className="space-y-5 shadow-md border py-2  bg-white ">
        <div className="p-3  flex justify-between">
          <h2 className="font-semibold text-black lg:text-xl md:text-lg text-sm">Mean Grade Scales</h2>
         <div>
         {hasAdminPermissions() && (
         <CreateMeanGradeConfig refetchMeanGradeConfigs={refetchMeanGradeConfigs} />
         )}
         </div>
        </div>
      
     
        <div className=" relative overflow-x-auto  ">
          <table className="w-full bg-white text-sm border text-left rtl:text-right text-gray-500 ">
            <thead className=" text-gray-700 uppercase border-b bg-gray-50 rounded-t-md">
              <tr>
                <th scope="col" className="p-2 border-r  text-[10px] ">
                  #
                </th>
               
                <th scope="col" className="px-3 py-2 border-r    text-[10px]">
                Min mean points
                </th>
                <th scope="col" className="px-3 py-2 border-r  text-[10px]">
                  Max mean points
                </th>
                <th scope="col" className="px-3 py-2 border-r  text-[10px]">
                  Mean Grade
                </th>
                <th scope="col" className="px-3 py-2 border-r  text-[10px]">
                 Class Master&apos;s Remarks
                </th>
                <th scope="col" className="px-3 py-2 border-r text-[10px]">
                 Principal&apos;s Remarks
                </th>
                {hasAdminPermissions() && (
                <th scope="col" className="px-3 py-2 text-[10px]">
                  Actions
                </th>
                )}
              </tr>
            </thead>
            <tbody>
              {loadingMeangradeConfigs ? (
                <tr>
                  <td colSpan={5} className="text-center py-4">
                    Loading...
                  </td>
                </tr>
              ) : meanGradeData?.results && meanGradeData?.results.length > 0 ? (
                meanGradeData.results.map((config: any, index: number) => (
                  <tr key={config.id} className="bg-white border-b">
                    <th className="px-3 py-2 text-sm lg:text-sm border-r md:text-sm">{index + 1}</th>
                   
                    <td className="px-3 py-2 text-sm lg:text-sm border-r md:text-sm">{config.min_mean_points}</td>
                 <td className="px-3 py-2 text-sm lg:text-sm border-r md:text-sm">{config.max_mean_points}</td>
              
                    <td className="px-3 py-2 text-sm lg:text-sm border-r md:text-sm">{config.grade}</td>
                    <td className="px-3 py-2 text-sm lg:text-sm border-r md:text-sm">{config.remarks}</td>
                    <td className="px-3 py-2 text-sm lg:text-sm border-r md:text-sm">{config.principal_remarks}</td>
                    {hasAdminPermissions() && (
                    <td className="px-3 py-2 flex items-center space-x-5">
                      <EditMeanGradeConfig  refetchMeanGradeConfigs={refetchMeanGradeConfigs} meangradeConfigId={config.id} />
                      <DeleteMeanGradeConfig  refetchMeanGradeConfigs={refetchMeanGradeConfigs} meangradeConfigId={config.id} />
                    
                    </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-4">
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex lg:justify-end md:justify-end justify-center mt-4 mb-4 px-6 py-4">
          <nav className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              className={`lg:px-4 lg:py-2 md:px-4 md:py-2 py-1 px-2 border lg:text-sm md:text-sm text-xs rounded ${
                currentPage === 1
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-white text-black border-gray-300 hover:bg-gray-100"
              }`}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            {pages.map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`lg:px-4 lg:py-2 md:px-4 md:py-2 py-1 px-2 lg:text-sm md:text-sm text-xs border rounded ${
                  page === currentPage
                    ? "bg-primary text-white"
                    : "bg-white text-black border-gray-300 hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              className={`lg:px-4 lg:py-2 md:px-4 md:py-2 py-1 px-2 lg:text-sm md:text-sm text-xs border rounded ${
                currentPage === totalPages
                  ? "bg-[gray-300] text-gray-500 cursor-not-allowed"
                  : "bg-primary text-white border-gray-300 hover:bg-gray-100"
              }`}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </nav>
        </div>
      </div>
   
  );
};
export default MeanGradeConfigs;
