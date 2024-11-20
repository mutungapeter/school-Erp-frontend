"use client";
import { useGetClassesQuery } from "@/redux/queries/classes/classesApi";
import { useGetReportFormsQuery } from "@/redux/queries/marks/reportsApi";
import { ClassLevel } from "@/src/definitions/classlevels";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { BsChevronDown, BsReceipt } from "react-icons/bs";
import { TbDatabaseOff } from "react-icons/tb";
import { useDebouncedCallback } from "use-debounce";

import { useGetTermsQuery } from "@/redux/queries/terms/termsApi";
import { TermInterface } from "@/src/definitions/terms";

import { PDFViewer } from "@react-pdf/renderer";
import ContentSpinner from "../layouts/contentSpinner";
import ReportPDF from "./reportPdf";
import { IoMdArrowDropdown } from "react-icons/io";
import { ImFilePdf } from "react-icons/im";

// import dynamic from "next/dynamic";

// const ReportPDF = dynamic(() => import("./reportPdf"), { ssr: false });
const Reports = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

 
  const [message, setMessage] = useState<string | null>(null);
  const [show, setShow] = useState(false);

  const initialFilters = useMemo(
    () => ({
      class_level: searchParams.get("class_level") || "",
      admission_number: searchParams.get("admission_number") || "",
      term: searchParams.get("term") || "",
    }),
    [searchParams]
  );
  const initialPage = parseInt(searchParams.get("page") || "1", 10);
  const [filters, setFilters] = useState(initialFilters);

  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [pdfData, setPdfData] = useState<any[] | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.class_level){
      params.set("class_level", filters.class_level);
    }
    if (filters.admission_number){
      params.set("admission_number", filters.admission_number);
    }
    if (filters.term){
      params.set("term", filters.term);
    }

    router.push(`?${params.toString()}`);
  }, [filters]);
  const queryParams = useMemo(
    () => ({
      ...filters,
    }),
    [filters]
  );
  const {
    isLoading: loading,
    data,
    error,
    refetch,
  } = useGetReportFormsQuery(queryParams, {
    skip: !(
      (filters.class_level && filters.term) ||
      (filters.admission_number && filters.term)
    ),
  });

  const {
    isLoading: loadingClasses,
    data: classesData,
    refetch: refetchClasses,
  } = useGetClassesQuery({}, { refetchOnMountOrArgChange: true });
  const {
    isLoading: loadingTerms,
    data: termsData,
    refetch: refetchTerms,
  } = useGetTermsQuery({}, { refetchOnMountOrArgChange: true });

  useEffect(() => {
    if (
      (data && filters.class_level && filters.term) ||
      (filters.admission_number && filters.term)
    ) {
      setPdfData(data?.students_data);
      setMessage(data?.message);
    }
  }, [data, filters]);

  const handleSearch = useDebouncedCallback((value: string) => {
    // console.log(`Debounced Search Term: ${value}`);
    setFilters((prev) => ({ ...prev, admission_number: value }));
  }, 200);

  const handleFilterChange = (
    e: ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    if (name === "admission_number") {
      handleSearch(value);
    } else {
      setFilters((prev) => ({ ...prev, [name]: value }));
    }
  };
  const handleResetFilters = () => {
    setFilters({
      class_level: "",
      admission_number: "",
      term: "",
    });

    setPdfData([]);

    router.push("?");
  };

  console.log("data", data);
  console.log("pdfData", pdfData);

  const handleGenerateReports = () => {
    if (!pdfData || pdfData.length === 0) return;
    setShow(true);
    setMessage(null);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        const nextProgress = prev + 10;
        if (nextProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return nextProgress;
      });
    }, 300);
  };

  return (
    <div className="space-y-5 shadow-md border py-2 px-2  bg-white min-h-[100vh] ">
      <div className="flex flex-col lg:gap-0 gap-3 p-3 lg:flex lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-2 ">
          <h2 className="font-semibold text-black lg:text-xl md:text-lg text-sm ">
          Terminal Report Forms
          </h2>
        </div>
       
      </div>
      <div className="flex items-center lg:justify-end space-x-5 px-3">
      
        <div
            onClick={handleGenerateReports}
            className="lg:py-2 lg:px-4 p-2 flex cursor-pointer space-x-2 items-center text-[13px] lg:text-sm rounded-md font-bold border bg-green-600 text-white"
          >
            <ImFilePdf size={17} className="text-white" />
            <span>Generate Report</span>
          </div>
      </div>
    
      <div className="flex flex-col gap-3 lg:gap-0 lg:flex-row lg:items-center lg:justify-end  lg:space-x-5 px-2 ">
      <div className="flex space-x-4 items-center">
          <div className="relative w-32 lg:w-40 md:w-40 xl:w-40 ">
           
            <select
              name="class_level"
              value={filters.class_level || ""}
              onChange={handleFilterChange}
              className="w-32 lg:w-40 md:w-40 xl:w-40 appearance-none py-2 px-4 text-sm md:text-lg lg:text-lg font-semibold rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
            >
              <option value="">Class</option>
              {classesData?.map((classLevel: ClassLevel) => (
                <option key={classLevel.id} value={classLevel.id}>
                  {classLevel.form_level.name} {classLevel?.stream?.name}
                </option>
              ))}
            </select>
            <BsChevronDown
              color="gray"
              size={20}
              className="absolute top-[50%] right-4 transform -translate-y-1/2 text-[#1F4772] pointer-events-none"
            />
          </div>
          <div className="relative w-32 lg:w-40 md:w-40 xl:w-40">
          
            <select
              name="term"
              value={filters.term || ""}
              onChange={handleFilterChange}
              className="w-32 lg:w-40 md:w-40 xl:w-40 appearance-none py-2 px-4 text-xs md:text-lg lg:text-lg font-semibold rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
            >
              <option value="">Term</option>
              {termsData?.map((term: TermInterface) => (
                <option key={term.id} value={term.id}>
                  {term.term} {term.calendar_year}
                </option>
              ))}
            </select>
            <BsChevronDown
              color="gray"
              size={20}
              className="absolute top-[50%] right-4 transform -translate-y-1/2 text-[#1F4772] pointer-events-none"
            />
          </div>
          </div>
          <div className="flex space-x-4 items-center">
          <div className="relative w-40 lg:w-40 md:w-40 xl:w-40 ">
        
            <input
              type="text"
              name="admission_number"
              value={filters.admission_number || ""}
              onChange={handleFilterChange}
              placeholder="Admission Number"
              className="w-40 lg:w-40 md:w-40 xl:w-40 py-2 px-4 text-sm font-semibold md:text-lg lg:text-lg rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm placeholder:font-semibold"
            />
          </div>
          <button
          onClick={handleResetFilters}
          className="lg:py-2 lg:px-4 p-2 text-[13px] lg:text-sm rounded-md font-bold border text-white bg-primary"
        >
          Reset Filters
        </button>
          </div>
         
        </div>


      {loading && (
        <div className="w-full mx-2 md:mx-auto lg:mx-auto flex justify-center lg:w-11/12 md:w-11/12  bg-white  rounded-md shadow-md py-8  ">
          <ContentSpinner />
        </div>
      )}
      {message && pdfData && (
        <div className="  w-full mx-auto flex justify-center lg:w-11/12 md:w-11/12  bg-white  rounded-md shadow-md border border-green-200 py-5  ">
          <h2 className="text-green-700 text-xl">{message}</h2>
        </div>
      )}

      {!filters.admission_number &&
        !filters.class_level &&
        !filters.term &&
        !loading && (
          <div className="w-full mx-auto  md:mx-auto lg:mx-auto flex justify-center lg:w-11/12 md:w-11/12  bg-white  rounded-md shadow-md  py-5 text-red-600 border border-red-300">
            <p className="text-sm lg:text-2xl md:text-2xl  ">
              Please apply filters to show data
            </p>
          </div>
        )}

      {!loading && error && !pdfData && (
        <div className="w-full mx-2 md:mx-auto lg:mx-auto flex justify-center lg:w-11/12 md:w-11/12  bg-white  rounded-md shadow-md  border border-red-300 items-center space-x-2 py-5  text-red-600">
          <TbDatabaseOff className=" text-gray-400" size={30} />
          <p>{(error as any)?.data?.error || "Server error occurred."}</p>
        </div>
      )}


      {/* {show && (
        <div className="w-full flex justify-center items-center space-x-2">
          <div className="text-lg font-bold text-primary">
            {progress < 100 ? `${progress}%` : "Generation complete!"}
          </div>
        </div>
      )} */}

      {show && pdfData && pdfData.length > 0 && progress === 100 && (
        <PDFViewer width="100%" height="600">
          <ReportPDF data={pdfData} />
        </PDFViewer>
      )}
      {/* {show && pdfData && pdfData.length > 0 &&(
      <ReportHTML data={pdfData} />
      )} */}
    </div>
  );
};

export default Reports;
