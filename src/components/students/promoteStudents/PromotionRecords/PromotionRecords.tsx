"use client";
import { useGetAlumniRecordsQuery, useGetPromotionRecordsQuery } from "@/redux/queries/students/studentsApi";
import { Student } from "@/src/definitions/students";
import { formattedDate } from "@/src/utils/dates";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { IoEyeSharp } from "react-icons/io5";
import { TbDatabaseOff } from "react-icons/tb";
import "../../../style.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PageLoadingSpinner from "@/src/components/layouts/PageLoadingSpinner";
import { useGetFormLevelsQuery } from "@/redux/queries/formlevels/formlevelsApi";
import { FormLevel } from "@/src/definitions/formlevels";
import { BsChevronDown } from "react-icons/bs";
import { PAGE_SIZE } from "@/src/constants/constants";
import { useGetAllClassesQuery } from "@/redux/queries/classes/classesApi";
import { ClassLevel } from "@/src/definitions/classlevels";

import { addMonths, subMonths } from "date-fns";
import { PiCalendarDotsLight } from "react-icons/pi";
const PromotionRecords = () => {
  const pageSize = PAGE_SIZE;
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialFilters = useMemo(
    () => ({
      source_class_level: searchParams.get("source_class_level") || "",
        year: searchParams.get("year") || "",
      
    }),
    [searchParams]
  );

  const initialPage = parseInt(searchParams.get("page") || "1", 10);
  const [filters, setFilters] = useState(initialFilters);
  const [currentPage, setCurrentPage] = useState(initialPage);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("page", currentPage.toString());
    if (filters.source_class_level)
        params.set("source_class_level", filters.source_class_level);
     
    if (filters.year)
      params.set("year", filters.year);
   
   

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
    isLoading: loadingClasses,
    data: classesData,
    refetch: refetchClasses,
  } = useGetAllClassesQuery({}, { refetchOnMountOrArgChange: true });
  const {
    isLoading: loadingPromotionRecords,
    data: promotionRecordsData,
    refetch,
    error,
  } = useGetPromotionRecordsQuery(queryParams, { refetchOnMountOrArgChange: true });
 
  const totalPages = Math.ceil((promotionRecordsData?.count || 0) / pageSize);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };


  const handleYearChange = (date: Date | null) => {
    const year = date ? date.getFullYear().toString() : "";
    setFilters((prev) => ({ ...prev, year: year }));
  };

  const handleResetFilters = () => {
    setFilters({ year: "", source_class_level: "" });
    setCurrentPage(1);
    router.push("?");
  };
  const handleFilterChange = (
    e: ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;

      setFilters((prev) => ({ ...prev, [name]: value }));

  };
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  if (loadingPromotionRecords) {
    return (
      <div className="mx-auto w-full md:max-w-screen-2xl lg:max-w-screen-2xl p-3 md:p-4 2xl:p-5">
        <PageLoadingSpinner />
      </div>
    );
  }
  console.log("promotionRecordsData", promotionRecordsData);
  console.log("error", error);
  return (
    <>
      
      <div className=" space-y-5 bg-white  py-2  ">
        <div className="flex flex-col lg:gap-0 md:gap-0 gap-3 lg:flex-row md:flex-row lg:items-center md:items-center md:justify-between lg:justify-between lg:px-3 md:px-3 lg:p-3 md:p-3 px-1 p-1    ">
          <h2 className="font-semibold text-black text-xl md:text-2xl lg:text-2xl">
          Promotion Records
          </h2>
          <div className="flex flex-col gap-3  md:flex-row lg:flex-row md:items-center md:space-x-2 lg:items-center lg:space-x-5 lg:justify-end">
          
<div className="relative w-full lg:w-55 md:w-55 xl:w-55  ">

            <select
              name="source_class_level"
              value={filters.source_class_level || ""}
              onChange={handleFilterChange}
              className="w-full lg:w-55 md:w-55 xl:w-55 
                text-sm md:text-lg lg:text-lg appearance-none py-2 px-4 font-normal rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
             >
              <option value="">--- Select class ---</option>
              {classesData?.map((classLevel: ClassLevel) => (
                <option key={classLevel.id} value={classLevel.id}>
                  {classLevel.name} {classLevel?.stream?.name} - {classLevel.calendar_year}
                </option>
              ))}
            </select>
            <BsChevronDown
              color="gray"
              size={20}
              className="absolute top-[50%] right-4 transform -translate-y-1/2 text-[#1F4772] pointer-events-none"
            />
          </div>
              
              <div className="relative ">

                <DatePicker
               
                selected={filters.year ? new Date(parseInt(filters.year), 0) : null}
                onChange={handleYearChange}
               showYearPicker
                      dateFormat="yyyy"
                      // showIcon
                      // icon={<PiCalendarDotsLight className="text-gray-currentColor" />}
                      yearDropdownItemNumber={5}
                      placeholderText="Promotion Year"
                      isClearable
                      className="w-full appearance-none py-2 px-2 text-lg rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
                    />
              </div>
               
             
                
            </div>
        
        </div>
        <div className="  rounded-sm  p-2">
          
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
                    Previous Class
                  </th>
                  <th scope="col" className="px-3 py-2 text-xs">
                   Current Class
                  </th>
                  <th scope="col" className="px-3 py-2 text-xs">
                   Current Year
                  </th>
                  
                </tr>
              </thead>
              <tbody>
                {loadingPromotionRecords ? (
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
                ) : promotionRecordsData?.results &&
                  promotionRecordsData?.results.length > 0 ? (
                  promotionRecordsData.results.map(
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
                          {student.source_class_level.form_level.name}
                          {student.source_class_level.stream
                            ? student.source_class_level.stream.name
                            : ""}
                        </td>
                        <td className="px-3 py-2 text-sm lg:text-md md:text-md">
                          {student.target_class_level.form_level.name}
                          {student.target_class_level.stream
                            ? student.target_class_level.stream.name
                            : ""}
                        </td>
                        <td className="px-3 py-2 text-sm lg:text-md md:text-md">
                          {student.year}
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
export default PromotionRecords;
