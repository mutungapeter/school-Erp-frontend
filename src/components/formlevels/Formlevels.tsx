"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useGetFormLevelsQuery } from "@/redux/queries/formlevels/formlevelsApi";
import { FormLevel } from "@/src/definitions/formlevels";
import { CreateFormLevel } from "./NewFormLevel";
import DeleteFormLevel from "./deleteFormLevels";
import EditFormLevel from "./editFormLevels";
import PageLoadingSpinner from "../layouts/PageLoadingSpinner";
import { DefaultLayout } from "../layouts/DefaultLayout";
import { PAGE_SIZE } from "@/src/constants/constants";

const FormLevels = () => {
  const pageSize = PAGE_SIZE;
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const pageParam = searchParams.get("page");
  const [currentPage, setCurrentPage] = useState<number>(
    parseInt(pageParam || "1")
  );
  const router = useRouter();
  const {
    isLoading: loadingFormLevels,
    data: formLevelsData,
    refetch,
  } = useGetFormLevelsQuery(
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

  const totalPages = Math.ceil((formLevelsData?.count || 0) / pageSize);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.set("page", page.toString());
    router.push(`/form-levels/?${currentParams.toString()}`);
  };

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }
  const refetchFormLevels = () => {
    refetch();
  };
  if (loadingFormLevels) {
    return (
      <div className="mx-auto w-full md:max-w-screen-2xl lg:max-w-screen-2xl p-3 md:p-4 2xl:p-5">

      <PageLoadingSpinner />
    </div>
    );
  }
  console.log("formLevelsData", formLevelsData);
  return (
    <>
      <div className="space-y-5 shadow-md border py-2 bg-white ">
        <div className="p-3 flex justify-between">
        <h2 className="font-semibold text-black md:text-xl text-md lg:text-xl">
            Form Levels
          </h2>
          <CreateFormLevel refetchFormLevels={refetchFormLevels} />
        </div>
        <div className=" relative overflow-x-auto p-2  ">
          <table className="w-full bg-white text-sm border text-left rtl:text-right text-gray-500 ">
            <thead className="text-sm text-gray-700 uppercase border-b bg-gray-50 rounded-t-md">
              <tr>
                <th scope="col" className="px-6 py-4">
                  #
                </th>
                <th scope="col" className="px-6 py-4">
                  Name
                </th>
                <th scope="col" className="px-6 py-4">
                  Level
                </th>

                <th scope="col" className="px-6 py-4">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loadingFormLevels ? (
                <tr>
                  <td colSpan={5} className="text-center py-4">
                    Loading...
                  </td>
                </tr>
              ) : formLevelsData?.results &&
                formLevelsData?.results.length > 0 ? (
                formLevelsData.results.map(
                  (form_level: FormLevel, index: number) => (
                    <tr key={form_level.id} className="bg-white border-b">
                      <th className="px-3 py-2 text-gray-900">{index + 1}</th>
                      <td className="px-3 py-2 font-medium text-gray-900 whitespace-nowrap">
                        {form_level.name}
                      </td>
                      <td className="px-3 py-2 text-sm lg:text-lg md:text-lg">
                        {form_level.level}
                      </td>

                      <td className="px-3 py-2 flex items-center space-x-5">
                        <EditFormLevel
                          formLevelId={form_level.id}
                          refetchFormLevels={refetchFormLevels}
                        />
                        <DeleteFormLevel
                          formLevelId={form_level.id}
                          refetchFormLevels={refetchFormLevels}
                        />
                      </td>
                    </tr>
                  )
                )
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
              className={`px-4 py-2 lg:text-sm md:text-sm text-xs border rounded ${
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
                className={`px-4 py-2 lg:text-sm md:text-sm text-xs border rounded ${
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
              className={`px-4 py-2 lg:text-sm md:text-sm text-xs border rounded ${
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
    </>
  );
};
export default FormLevels;
