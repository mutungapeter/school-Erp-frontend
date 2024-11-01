"use client";
import { useGetClassesQuery } from "@/redux/queries/classes/classesApi";
import { useGetReportFormsQuery } from "@/redux/queries/marks/reportsApi";
import { ClassLevel } from "@/src/definitions/classlevels";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { BsReceipt } from "react-icons/bs";
import { IoMdArrowDropdown } from "react-icons/io";
import { TbDatabaseOff } from "react-icons/tb";


import { useGetTermsQuery } from "@/redux/queries/terms/termsApi";
import { TermInterface } from "@/src/definitions/terms";

import { PDFViewer } from "@react-pdf/renderer";
import ContentSpinner from "../layouts/contentSpinner";
import ReportPDF from "./reportPdf";

const Reports=()=>{
  const router = useRouter();
  const searchParams = useSearchParams();

  const classLevelId = searchParams.get("class_level");
  const admissionNumber = searchParams.get("admission_number");
  const term = searchParams.get("term");
  const [message, setMessage] = useState<string | null>(null);
  const [show, setShow] = useState(false);
  const [filters, setFilters] = useState({
    class_level: classLevelId || "",
    admission_number: admissionNumber || "",
    term: term || "",
  });

  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [pdfData, setPdfData] = useState<any[] | null>(null);
  const [progress, setProgress] = useState(0);
  const queryParams = useMemo(() => {
    const params: any = {};

    if (admissionNumber) {
      params.admission_number = admissionNumber;
    }
    if (classLevelId) {
      params.class_level = classLevelId;
    }
    if (term) {
      params.term = term;
    }

    return params;
  }, [classLevelId, admissionNumber, term]);

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
      setPdfData(data.students_data);
      setMessage(data.message);
    }
  }, [data, filters]);
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
    if (filters.term) {
      params.set("term", filters.term);
    }

    if (filters.class_level) {
      params.set("class_level", filters.class_level);
    }
    setPdfData(null);
    router.push(`?${params.toString()}`);
  };

  const handleResetFilters = () => {
    setFilters({
      class_level: "",
      admission_number: "",
      term: "",
    });
    // setPdfBlobUrl(null);
    setPdfData([]);

    router.push("?");
  };

  console.log("data", data);
  console.log("pdfData", pdfData);
  // const handleGenerateReports = async () => {
  //   try {
  //     if (!data?.students_data || data.students_data.length === 0) return;

  //     const { pdf } = await import("@react-pdf/renderer");
  //     const pdfBlob = await pdf(<ReportPDF data={data.students_data} />).toBlob();
  //     const url = URL.createObjectURL(pdfBlob);
  //     setPdfBlobUrl(url);

  //   } catch (error) {
  //     console.log("error===========", error);

  //   }
  // };
  const handleGenerateReports = () => {
    if (!pdfData || pdfData.length === 0) return;
    setShow(true);
    setMessage(null)
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
    <div className="space-y-5 shadow-md border py-2 px-2  bg-white ">
      <div className="flex flex-col lg:gap-0 gap-3 p-3 lg:flex lg:flex-row lg:items-center lg:justify-between">
       
          <div className="flex flex-col gap-2 ">
            <h2 className="font-semibold text-black lg:text-xl md:text-lg text-sm ">
              Generating Report Forms
            </h2>
          </div>
       <div>

        <button
            onClick={handleGenerateReports}
            className="lg:py-2 lg:px-4 p-2 text-[13px] lg:text-sm rounded-md font-bold border bg-green-600 text-white"
          >
            Generate Report
          </button>
       </div>
      </div>
      <div className="flex items-center lg:justify-end space-x-5 px-3">
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
      <div>
        <div className="lg:justify-end lg:flex space-y-2 lg:space-y-0 lg:items-center lg:space-x-3 px-3">
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
              htmlFor="Term"
              className="block text-gray-700 text-sm  font-semibold mb-2"
            >
              Term
            </label>
            <select
              name="term"
              value={filters.term || ""}
              onChange={handleSelectChange}
              className="w-full lg:w-64 md:w-full xl:w-64 appearance-none py-2 px-4 text-lg rounded-md border border-primary focus:outline-none"
            >
              <option value="">Select Term</option>
              {termsData?.map((term: TermInterface) => (
                <option key={term.id} value={term.id}>
                  {term.term} {term.calendar_year}
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
          <div className="lg:flex lg:justify-between space-y-4 lg:space-y-0 lg:space-x-5 ">
          
          
        </div>
        </div>
      </div>

   
          {loading && (
            <div className="w-full mx-2 md:mx-auto lg:mx-auto flex justify-center lg:w-11/12 md:w-11/12  bg-white  rounded-md shadow-md py-8  ">
              <ContentSpinner />
            </div>
          )}
           {message && pdfData && (
            <div className="  w-full mx-2 md:mx-auto lg:mx-auto flex justify-center lg:w-11/12 md:w-11/12  bg-white  rounded-md shadow-md border border-green-200 py-5  ">
              <h2 className="text-green-700 text-xl">
              {message}
                </h2>
            </div>
          )}


          {!filters.admission_number && !filters.class_level && !filters.term && !loading && (
              <div className="w-full mx-auto  md:mx-auto lg:mx-auto flex justify-center lg:w-11/12 md:w-11/12  bg-white  rounded-md shadow-md  py-5 text-red-600 border border-red-300">
                
                <p className="text-sm lg:text-2xl md:text-2xl  ">
                 Please apply filters to show data
                </p>
              </div>
            )}

          {!loading  && error && !pdfData && (
            <div className="w-full mx-2 md:mx-auto lg:mx-auto flex justify-center lg:w-11/12 md:w-11/12  bg-white  rounded-md shadow-md  border border-red-300 items-center space-x-2 py-5  text-red-600">
              <TbDatabaseOff className=" text-gray-400" size={30} />
              <p>{(error as any)?.data?.error || "Server error occurred."}</p>
            </div>
          )}
       

        {/* {pdfBlobUrl && data &&(
    <iframe
      src={pdfBlobUrl}
      width="100%"
      height="400"
      title="Student Report PDF"
    />
  )} */}

{show && (
        <div className="w-full flex justify-center items-center space-x-2">
          <div className="text-lg font-bold text-primary">
            {progress < 100 ? `${progress}%` : "Generation complete!"}
          </div>
        </div>
      )}

        {show && pdfData && pdfData.length > 0 && progress === 100  && (
          <PDFViewer width="100%" height="600">
            <ReportPDF data={pdfData} />
          </PDFViewer>
        )}
    </div>
  );
};

export default Reports;
