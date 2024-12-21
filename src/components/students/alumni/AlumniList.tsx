"use client";
import { useGetAlumniRecordsQuery } from "@/redux/queries/students/studentsApi";
import { Student } from "@/src/definitions/students";
import { formattedDate } from "@/src/utils/dates";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { IoEyeSharp } from "react-icons/io5";
import { TbDatabaseOff } from "react-icons/tb";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


import PageLoadingSpinner from "../../layouts/PageLoadingSpinner";
import { PAGE_SIZE } from "@/src/constants/constants";
import { PiCalendarDotsLight } from "react-icons/pi";

const AlumniRecords = () => {
  const pageSize = PAGE_SIZE;
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialFilters = useMemo(
    () => ({
      graduation_year: searchParams.get("graduation_year") || "",
      
    }),
    [searchParams]
  );

  const initialPage = parseInt(searchParams.get("page") || "1", 10);
  const [filters, setFilters] = useState(initialFilters);
  const [currentPage, setCurrentPage] = useState(initialPage);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("page", currentPage.toString());
    if (filters.graduation_year)
      params.set("graduation_year", filters.graduation_year);
   

    router.push(`?${params.toString()}`);
  }, [filters, currentPage]);

  const queryParams = useMemo(
    () => ({
      page: currentPage,
      page_size: pageSize,
      ...filters,
    }),
    [currentPage, filters]
  );

  const {
    isLoading: loadingAlumni,
    data: alumniData,
    refetch,
    error,
  } = useGetAlumniRecordsQuery(queryParams, { refetchOnMountOrArgChange: true });
 
  const totalPages = Math.ceil((alumniData?.count || 0) / pageSize);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };


  const handleYearChange = (date: Date | null) => {
    const year = date ? date.getFullYear().toString() : "";
    setFilters((prev) => ({ ...prev, graduation_year: year }));
  };

  const handleResetFilters = () => {
    setFilters({ graduation_year: "" });
    setCurrentPage(1);
    router.push("?");
  };

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  if (loadingAlumni) {
    return (
      <div className="mx-auto w-full md:max-w-screen-2xl lg:max-w-screen-2xl p-3 md:p-4 2xl:p-5">
        <PageLoadingSpinner />
      </div>
    );
  }
  console.log("alumniData", alumniData);
  console.log("error", error);
  return (
    <>
      
      <div className=" space-y-5 bg-white  py-2  ">
      <div className="flex flex-col lg:gap-0 md:gap-0 gap-3 lg:flex-row md:flex-row lg:items-center md:items-center md:justify-between lg:justify-between lg:px-3 md:px-3 lg:p-3 md:p-3 px-1 p-1    ">
      <h2 className="font-semibold text-black text-xl md:text-2xl lg:text-2xl">
          Alumni Records
          </h2>
         <div className="relative ">
               
                <DatePicker
                name="graduation_year"
                selected={filters.graduation_year ? new Date(parseInt(filters.graduation_year), 0) : null}
                onChange={handleYearChange}
                showYearPicker
                dateFormat="yyyy"
                // showIcon
                // icon={<PiCalendarDotsLight className="text-gray-currentColor" />}
                yearDropdownItemNumber={5}
                placeholderText="Graduation Year"
                isClearable
                className="w-full appearance-none py-2 px-2 text-lg rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
               />
               
                </div>
        
        </div>
        <div className=" rounded-sm  p-2">
         
          <div className=" relative overflow-x-auto p-2  ">
            <table className="w-full bg-white text-sm border text-left rtl:text-right text-gray-500 ">
              <thead className=" text-gray-700 uppercase border-b bg-gray-50 rounded-t-md">
                <tr>
                  <th scope="col" className="px-3 py-2 text-xs">
                    #
                  </th>
                  <th scope="col" className="px-3 py-2 text-xs">
                    Name
                  </th>
                  <th scope="col" className="px-3 py-2 text-xs">
                    Adm No
                  </th>
                  <th scope="col" className="px-3 py-2 text-xs">
                    Graduating Class
                  </th>
                  <th scope="col" className="px-3 py-2 text-xs">
                    Graduation year
                  </th>
                  
                </tr>
              </thead>
              <tbody>
                {loadingAlumni ? (
                  <tr>
                    <td colSpan={5} className="text-center py-4">
                      Loading...
                    </td>
                  </tr>
                ) : error ? (
                  <tr className="">
                    <td colSpan={4} className=" py-4">
                      <div className="flex items-center justify-center space-x-6 text-#1F4772">
                        <TbDatabaseOff size={25} />
                        <span>
                          {(error as any).data.message || "No records found!"}
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : alumniData?.results &&
                  alumniData?.results.length > 0 ? (
                  alumniData.results.map(
                    (student: any, index: number) => (
                      <tr key={student.id} className="bg-white border-b">
                        <th className="px-3 py-2 text-gray-900">{index + 1}</th>
                        <td className="px-3 py-2 font-normal text-sm lg:text-sm md:text-sm text-gray-900 whitespace-nowrap">
                          {student.student.first_name} {student.student.last_name}
                        </td>
                        <td className="px-3 py-2 text-sm lg:text-md md:text-md">
                          {student.student.admission_number}
                        </td>
                        <td className="px-3 py-2 text-sm lg:text-md md:text-md">
                          {student.final_class_level.form_level.name}
                          {student.final_class_level.stream
                            ? student.final_class_level.stream.name
                            : ""}
                        </td>
                        <td className="px-3 py-2 text-sm lg:text-md md:text-md">
                          {student.graduation_year}
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
                className={`px-4 py-2 border lg:text-sm md:text-sm text-xs rounded ${
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
      </div>
    </>
  );
};
export default AlumniRecords;
