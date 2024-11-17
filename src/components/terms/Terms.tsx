"use client";
import { useGetClassesQuery } from "@/redux/queries/classes/classesApi";
import { ClassLevel } from "@/src/definitions/classlevels";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { IoRefresh } from "react-icons/io5";
import PageLoadingSpinner from "../layouts/PageLoadingSpinner";
import { useGetTermsQuery } from "@/redux/queries/terms/termsApi";
import { BsChevronDown } from "react-icons/bs";
import { PiGearLight } from "react-icons/pi";
import DeleteTerm from "./DeleteTerm";
import ClickOutside from "../ClickOutside";
import EditTerm from "./EditTerm";
import { getStatusColor } from "@/src/utils/getStatus";
import CustomPopover from "../Popover";
import EditTermStatus from "./updateTermStatus";
import CreateTerm from "./NewTerm";

const Terms = () => {
  const pageSize = 5;
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

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
    router.push(`?${currentParams.toString()}`);
  };

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }
  const refetchTerms = () => {
    refetch();
  };
  if (loadingClasses) {
    return (
      <div className="mx-auto w-full md:max-w-screen-2xl lg:max-w-screen-2xl p-3 md:p-4 2xl:p-5">
        <PageLoadingSpinner />
      </div>
    );
  }

  console.log("termsData", termsData?.results);
  return (
    <div className="bg-white space-y-5 shadow-md ">
      <div className="p-3 flex justify-between ">
        <h2 className="font-semibold text-black md:text-xl text-md lg:text-xl">
          Terms
        </h2>
      <CreateTerm refetchTerms={refetchTerms} />
      </div>
      <div className=" relative mx-auto  w-full overflow-x-auto  p-3 md:p-4 2xl:p-5">
  <table className="  table-auto   bg-white   w-full  text-xs border text-gray-500 p-3 md:p-4 2xl:p-5">
      
         <thead className="text-[13px] uppercase border-b bg-gray-50 rounded-t-md">
            <tr>
              <th
                scope="col"
                className="px-3 border text-center py-2 text-[10px] lg:text-sm md:text-sm"
              >
                #
              </th>
              <th
                scope="col"
                className="px-3 border text-center py-2 text-[10px] lg:text-sm md:text-sm"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-3 border text-center py-2 text-[10px] lg:text-sm md:text-sm"
              >
                Year
              </th>
              <th
                scope="col"
                className="px-3 border text-center py-2 text-[10px] lg:text-sm md:text-sm"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-3 text-center border py-2 text-[10px] lg:text-sm md:text-sm"
              >
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
                  <th className="px-3 border text-center py-2 text-gray-900">
                    {index + 1}
                  </th>
                  <td className="px-3 border text-center py-2 font-normal text-sm lg:text-sm md:text-sm  whitespace-nowrap">
                    {term.term}
                  </td>
                  <td className="px-3 border text-center  py-2 text-sm lg:text-sm md:text-sm">
                    {term.calendar_year}
                  </td>
                  <td className="border text-center px-4 py-2 ">
                    <div
                      className={`px-2 py-1 flex items-center inline-flex rounded text-xs lg:text-sm md:text-sm ${
                        getStatusColor(term.status).bgColor
                      } ${getStatusColor(term.status).textColor}`}
                    >
                      {term.status}
                    </div>
                
                  
                      
                  </td>

                  <td className="px-3 py-2 flex  text-center justify-center ">
             
                    
                    <div className="flex items-center space-x-3">
                    <EditTermStatus termId={term.id} refetchTerms={refetchTerms} />
                  
                      <DeleteTerm
                        termId={term.id}
                        refetchTerms={refetchTerms}
                      />
                      <EditTerm termId={term.id} refetchTerms={refetchTerms} />
                    
                    </div>
             

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

      <div className="flex lg:justify-center   md:justify-center justify-center mt-4 mb-4 px-6 py-4">
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
