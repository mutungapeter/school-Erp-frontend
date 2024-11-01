"use client";
// import { DefaultLayout } from "@/src/components/layouts/DefaultLayout";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { useGetGradingConfigsQuery } from "@/redux/queries/gradingConfig/gradingConfigApi";
import { CreateNewGradingConfig } from "./NewGradingConfig";
import DeleteConfig from "./deleteGradingConfig";
import { EditGradingConfig } from "./editGradingConfig";
import PageLoadingSpinner from "../layouts/PageLoadingSpinner";
import DefaultLayout from "../adminDashboard/Layouts/DefaultLayout";

const GradingConfigs = () => {
  const pageSize = 5;
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const pageParam = searchParams.get("page");
  const [currentPage, setCurrentPage] = useState<number>(
    parseInt(pageParam || "1")
  );
  const router = useRouter();
  const {
    isLoading: loadingGradingConfigs,
    data: gradingConfigsData,
    refetch,
  } = useGetGradingConfigsQuery(
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

  const totalPages = Math.ceil((gradingConfigsData?.count || 0) / pageSize);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.set("page", page.toString());
    router.push(`/grading/?${currentParams.toString()}`);
  };

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }
  const refetchConfigs = () => {
    refetch();
  };

  if (loadingGradingConfigs) {
    return (
      <div className="mx-auto w-full md:max-w-screen-2xl lg:max-w-screen-2xl p-3 md:p-4 2xl:p-5">
        <PageLoadingSpinner />
      </div>
    );
  }
  console.log("gradingConfigsData", gradingConfigsData);
  return (
    <DefaultLayout>
      <div className="space-y-5 shadow-md border py-2  bg-white ">
        <div className="p-3  flex justify-between">
          <h2 className="font-semibold text-black lg:text-xl md:text-lg text-sm ">
            Grading Scales
          </h2>
          <CreateNewGradingConfig refetchConfigs={refetchConfigs} />
        </div>

        <div className="relative overflow-x-auto p-2">
          <table className="w-full table-auto bg-white text-xs border text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase border-b bg-gray-50 rounded-t-md">
              <tr>
                <th scope="col" className="lg:px-6 lg:py-3 md:px-6 md:py-3 px-3 py-2 text-[10px] font-semibold">
                  #
                </th>
                <th scope="col" className="lg:px-6 lg:py-3 md:px-6 md:py-3 px-3 py-2 text-[10px] font-semibold ">
                 Category
                </th>
                <th scope="col" className="lg:px-6 lg:py-3 md:px-6 md:py-3 px-3 py-2 text-[10px] font-semibold ">
                  Min Marks
                </th>
                <th scope="col" className="lg:px-6 lg:py-3 md:px-6 md:py-3 px-3 py-2 text-[10px] font-semibold">
                  Max Marks
                </th>
                <th scope="col" className="lg:px-6 lg:py-3 md:px-6 md:py-3 px-3 py-2 text-[10px] font-semibold">
                  Points
                </th>
                <th scope="col" className="lg:px-6 lg:py-3 md:px-6 md:py-3 px-3 py-2 text-[10px] font-semibold">
                  Grade
                </th>
                <th scope="col" className="lg:px-6 lg:py-3 md:px-6 md:py-3 px-3 py-2 text-[10px] font-semibold">
                  Remarks
                </th>

                <th scope="col" className="lg:px-6 lg:py-3 md:px-6 md:py-3 px-3 py-2 text-[10px] font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loadingGradingConfigs ? (
                <tr>
                  <td colSpan={5} className="text-center py-4">
                    Loading...
                  </td>
                </tr>
              ) : gradingConfigsData?.results &&
                gradingConfigsData?.results.length > 0 ? (
                gradingConfigsData.results.map((config: any, index: number) => (
                  <tr key={config.id} className="bg-white border-b">
                    <th className="px-3 py-2 text-xs lg:text-sm md:text-sm text-center text-gray-900">{index + 1}</th>
                    <td className="px-3 py-2 text-xs lg:text-sm md:text-sm font-normal  whitespace-nowrap">
                      {config.subject_category.name}
                    </td>
                    <td className="px-3 py-2 text-center text-xs lg:text-sm md:text-sm">{config.min_marks}</td>
                    <td className="px-3 py-2 text-center text-xs lg:text-sm md:text-sm">{config.max_marks}</td>
                    <td className="px-3 py-2 text-center text-xs lg:text-sm md:text-sm">{config.grade}</td>
                    <td className="px-3 py-2 text-center text-xs lg:text-sm md:text-sm">{config.points}</td>
                    <td className="px-3 py-2 text-center text-xs lg:text-sm md:text-sm">{config.remarks}</td>
                    <td className="px-3 py-2 flex items-center space-x-5">
                      <EditGradingConfig
                        configId={config.id}
                        refetchConfigs={refetchConfigs}
                      />
                      <DeleteConfig
                        configId={config.id}
                        refetchConfigs={refetchConfigs}
                      />
                    </td>
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
    </DefaultLayout>
  );
};
export default GradingConfigs;
