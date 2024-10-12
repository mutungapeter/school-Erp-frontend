"use client";


import { useGetClassesQuery } from "@/redux/queries/classes/classesApi";
import { useGetReportFormsQuery } from "@/redux/queries/marks/reportsApi";
import { ClassLevel } from "@/src/definitions/classlevels";
import { MarksInterface } from "@/src/definitions/marks";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { BsReceipt } from "react-icons/bs";
import { IoMdArrowDropdown } from "react-icons/io";
import { TbDatabaseOff } from "react-icons/tb";
import { pdf } from "@react-pdf/renderer"; 
import ReportPDF from "./reportPdf";
import Spinner from "../layouts/spinner";
import ContentSpinner from "../layouts/contentSpinner";


const ReportCard = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const classLevelId = searchParams.get("class_level");
  const admissionNumber = searchParams.get("admission_number");

  const [filters, setFilters] = useState({
    class_level: classLevelId || "",
    admission_number: admissionNumber || "",
  });

  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null); 

  const queryParams = useMemo(() => {
    const params: any = {};

    if (admissionNumber) {
      params.admission_number = admissionNumber;
    }
    if (classLevelId) {
      params.class_level = classLevelId;
    }

    return params;
  }, [classLevelId, admissionNumber]);

  const {
    isLoading: loading,
    data,
    error,
    refetch,
  } = useGetReportFormsQuery(queryParams,  {skip: !(admissionNumber || classLevelId)});
console.log("error", error)
  const {
    isLoading: loadingClasses,
    data: classesData,
    refetch: refetchClasses,
  } = useGetClassesQuery({}, { refetchOnMountOrArgChange: true });

  useEffect(() => {
    if (!loading && refetch) {
      if (admissionNumber) {
        refetch();
      } else if (classLevelId) {
        refetch();
      }
    }
  }, [
    classLevelId,
    admissionNumber,
    loading,
    loadingClasses,
    refetch,
  ]);

  const handleSelectChange = (
    e: ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleApplyFilters = () => {
    const params = new URLSearchParams();
    if (filters.admission_number) {
      params.set("admission_number", filters.admission_number);
    }
   
    if (filters.class_level) {
      params.set("class_level", filters.class_level);
    }
    router.push(`?${params.toString()}`);
  };

  const handleResetFilters = () => {
    setFilters({
      class_level: "",
      admission_number: "",
    });
    router.push("?");
    setPdfBlobUrl(null);
    // refetch();
  };

  console.log("data", data)
  
  const handleGenerateReports = async () => {
    if (!data || data.length === 0) return;
    const { pdf } = await import("@react-pdf/renderer");
    const pdfBlob = await pdf(<ReportPDF data={data} />).toBlob();
    const url = URL.createObjectURL(pdfBlob);
    setPdfBlobUrl(url); 
  };

  return (
    <div className="mt-[60px] sm:mt-[110px] lg:mt-[110px] flex flex-col gap-5">
      <div className="flex flex-col lg:gap-0 gap-3 lg:flex lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4 p-1 border border-[#1F4772] rounded-md lg:w-1/3 w-full">
          <div className="bg-[#C8D9EB] p-3 rounded-full flex items-center justify-center">
            <BsReceipt color="#1F4772" size={30} />
          </div>
          <div className="flex flex-col gap-2 ">
            <h2 className="text-[#1F4772] font-bold text-lg underline underline-offset-4 decoration-[#1F4772] decoration-3">
              Generating Report Forms
            </h2>
          </div>
        </div>
        <div className="lg:flex lg:justify-between space-y-4 lg:space-y-0 lg:space-x-5 ">
          <div className="flex items-center space-x-5">
          <button
            onClick={handleApplyFilters}
            className="lg:py-2 lg:px-4 p-2 text-[13px] lg:text-sm font-bold rounded-md border bg-primary text-white"
          >
            Apply Filters
          </button>
          <button
            onClick={handleResetFilters}
            className="lg:py-2 lg:px-4 p-2 text-[13px] lg:text-sm rounded-md font-bold border bg-white text-primary"
          >
            Reset Filters
          </button>
          </div>
          <button
            onClick={handleGenerateReports}
            className="lg:py-2 lg:px-4 p-2 text-[13px] lg:text-sm rounded-md font-bold border bg-green-600 text-white"
          >
            Generate Report
          </button>
        </div>
      </div>
      <div>
        <div className="lg:justify-end lg:flex space-y-2 lg:space-y-0 lg:items-center lg:space-x-3">
        <div className="relative w-full lg:w-64 md:w-full xl:w-64 ">
          <label
            htmlFor="class"
            className="block text-gray-700 text-sm  font-semibold mb-2"
          >
            Class
          </label>
          <select
            name="class_level"
            value={filters.class_level || ""}
            onChange={handleSelectChange}
            className="w-full lg:w-64 md:w-full xl:w-64 appearance-none py-2 px-4 text-lg rounded-md border border-primary focus:outline-none"
          >
            <option value="">Select Class</option>
            {classesData?.map((classLevel: ClassLevel) => (
              <option key={classLevel.id} value={classLevel.id}>
                {classLevel.form_level.name} {classLevel?.stream?.name}
              </option>
            ))}
          </select>
          <IoMdArrowDropdown
            size={30}
            className="absolute top-[65%] right-4 transform -translate-y-1/2 text-[#1F4772] pointer-events-none"
          />
        </div>
        <div className="relative w-full lg:w-64 md:w-full xl:w-64 ">
          <label
            htmlFor="class"
            className="block text-gray-700 text-sm  font-semibold mb-2"
          >
            Admission No
          </label>
          <input
            type="text"
            name="admission_number"
            value={filters.admission_number || ""}
            onChange={handleSelectChange}
            placeholder="Find by Admission Number"
            className="w-full lg:w-64 md:w-full xl:w-64  py-2 px-4 rounded-md border border-[#1F4772] focus:outline-none focus:bg-white"
          />
        </div>
        </div>
      </div>
    
      <div className="relative overflow-x-auto rounded-md">
  {loading && (
   <ContentSpinner/>
    
  )}

 
  {!loading && error && (
    <div className="flex justify-center items-center space-x-2 mx-auto py-5 text-red-600">
      <TbDatabaseOff className=" text-gray-400" size={30} />
      <p>{(error as any).data?.error || "An unknown error occurred."}</p> {/* Error handling */}
    </div>
  )}


{!loading && data && data.length === 0 && (
    <div className=" flex justify-center items-center space-x-2  mx-auto py-5 text-red-600 text-center py-5 text-red-600">
         <TbDatabaseOff className=" text-gray-400" size={30} />
      <p>No records to show yet. Please apply filters to fetch data.</p> {/* Default message */}
    </div>
  )}

  
  {pdfBlobUrl && (
    <iframe
      src={pdfBlobUrl}
      width="100%"
      height="800"
      title="Student Report PDF"
    />
  )}
</div>

    </div>
  );
};

export default ReportCard;
