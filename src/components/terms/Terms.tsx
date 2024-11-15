"use client";
import { useGetClassesQuery } from "@/redux/queries/classes/classesApi";
import { ClassLevel } from "@/src/definitions/classlevels";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
// import { CreateClassLevel } from "./NewClasslevel";
// import DeleteClassLevel from "./deleteClassLevel";
// import EditClassLevel from "./editClassLevels";
// import { DefaultLayout } from "../layouts/DefaultLayout";
import PageLoadingSpinner from "../layouts/PageLoadingSpinner";
import { useGetTermsQuery } from "@/redux/queries/terms/termsApi";
const Terms = () => {
  const pageSize = 5;
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const pageParam = searchParams.get("page");
  const [currentPage, setCurrentPage] = useState<number>(
    parseInt(pageParam || "1")
  );
  const router = useRouter();
  const {
    isLoading: loadingClasses,
    data: termsData,
    refetch,
  } = useGetTermsQuery(
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

  const totalPages = Math.ceil((termsData?.count || 0) / pageSize);

 

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.set("page", page.toString());
    router.push(`/classes/?${currentParams.toString()}`);
  };

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }
const refetchClasses=()=>{
    refetch();
}
if (loadingClasses) {
  return (
    <div className="mx-auto w-full md:max-w-screen-2xl lg:max-w-screen-2xl p-3 md:p-4 2xl:p-5">

    <PageLoadingSpinner />
  </div>
  );
}
  console.log("termsData", termsData?.results);
  return (
 
    <div className=" space-y-5 shadow-md border py-2 bg-white overflow-x-auto ">
       
        <div className="p-3 flex justify-between">
        <h2 className="font-semibold text-black md:text-xl text-md lg:text-xl">Terms</h2>
        {/* <CreateClassLevel  refetchClasses={refetchClasses} /> */}
      </div>
      <div className=" relative overflow-x-auto p-2  ">
        <table className="w-full bg-white text-xs border text-left rtl:text-right text-gray-500 ">
          <thead className="text-xs text-gray-700 uppercase border-b bg-gray-50 rounded-t-md">
            <tr>
                <th scope="col" className="px-3 border py-2 text-xs lg:text-sm md:text-sm">
                  #
                </th>
                <th scope="col" className="px-3 border py-2 text-xs lg:text-sm md:text-sm">
                 Name
                </th>
                <th scope="col" className="px-3 border py-2 text-xs lg:text-sm md:text-sm">
                 Calendar Year
                </th>
                <th scope="col" className="px-3 border py-2 text-xs lg:text-sm md:text-sm">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loadingClasses ? (
                <tr>
                  <td colSpan={5} className="text-center py-4">
                    Loading...
                  </td>
                </tr>
              ) : termsData?.results && termsData?.results.length > 0 ? (
                termsData?.results.map((term: any, index: number) => (
                  <tr key={term.id} className="bg-white border-b">
                    <th className="px-3 border py-2 text-gray-900">{index + 1}</th>
                    <td className="px-3 border py-2 font-normal text-sm lg:text-sm md:text-sm  whitespace-nowrap">
                      {term.term}  
                    </td>
                    <td className="px-3 border py-2 text-sm lg:text-sm md:text-sm">
                      {term.calendar_year}
                    </td>
                 
                    <td className="px-3 py-2 flex items-center space-x-5">
                      {/* <EditClassLevel classLevelId={cl.id} refetchClassLevels={refetchClasses} />
                      <DeleteClassLevel classLevelId={cl.id} refetchClassLevels={refetchClasses} /> */}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-4">
                    No Terms found.
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
              className={`px-4 py-2 lg:text-sm md:text-sm text-xs  border rounded ${
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
                className={`px-4 py-2 lg:text-sm md:text-sm text-xs  border rounded ${
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
              className={`px-4 py-2 border lg:text-sm md:text-sm text-xs  rounded ${
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
export default Terms;
