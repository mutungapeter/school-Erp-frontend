"use client";
import { useAppSelector } from "@/redux/hooks";
import { useGetAllClassesQuery } from "@/redux/queries/classes/classesApi";
import { useGetReportFormsQuery } from "@/redux/queries/marks/reportsApi";
import { useGetTermsQuery } from "@/redux/queries/terms/termsApi";
import { RootState } from "@/redux/store";
import { ClassLevel } from "@/src/definitions/classlevels";
import { TermInterface } from "@/src/definitions/terms";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, Suspense, useEffect, useMemo, useState } from "react";
import { BsChevronDown, BsFiletypePdf } from "react-icons/bs";
import { IoMdSearch } from "react-icons/io";
import { VscRefresh } from "react-icons/vsc";
import { useDebouncedCallback } from "use-debounce";
import ContentSpinner from "../layouts/contentSpinner";
import ReportPDF from "./reportPdf";
import { CiSearch } from "react-icons/ci";
const Reports = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialFilters = useMemo(
    () => ({
      class_level: searchParams.get("class_level") || "",
      admission_number: searchParams.get("admission_number") || "",
      term: searchParams.get("term") || "",
      exam_type: searchParams.get("exam_type") || "",
    }),
    [searchParams]
  );

  const [filters, setFilters] = useState(initialFilters);
  const [selectedClassLevel, setSelectedClassLevel] = useState<number | null>(
    null
  );
  const { user, loading: loadingUser } = useAppSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.class_level) {
      params.set("class_level", filters.class_level);
    }
    if (filters.admission_number) {
      params.set("admission_number", filters.admission_number);
    }
    if (filters.term) {
      params.set("term", filters.term);
    }
    if (filters.exam_type) {
      params.set("exam_type", filters.exam_type);
    }

    router.replace(`?${params.toString()}`);
  }, [filters]);
  const title = useMemo(() => {
    if (user?.role === "Teacher") {
      return "Unofficial Terminal Report Form";
    } else if (user?.role === "Admin" || user?.role === "Principal") {
      return "Official Terminal Report Form";
    } else {
      return "Terminal Report Form";
    }
  }, [user]);
  const {
    isLoading: loading,
    data,
    error,
  } = useGetReportFormsQuery(
    {
      class_level: filters.class_level || "",
      term: filters.term || "",
      admission_number: filters.admission_number || "",
      exam_type: filters.exam_type || "",
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );
  const getSubtitle = (studentsData: any[]) => {
    if (!studentsData || studentsData.length === 0) return "";

    const firstMark = studentsData[0]?.marks?.find(
      (mark: any) => mark.exam_type === "Midterm" || mark.exam_type === "Endterm"
    );

    if (firstMark?.exam_type === "Midterm") {
      return "Midterm Report";
    } else if (firstMark?.exam_type === "Endterm") {
      return "Endterm Report";
    } else {
      return "Report";
    }
  };

  const subtitle = useMemo(() => getSubtitle(data?.students_data || []), [data?.students_data]);
  const {
    isLoading: loadingClasses,
    data: classesData,
    refetch: refetchClasses,
  } = useGetAllClassesQuery({}, { refetchOnMountOrArgChange: true });
  const {
    isLoading: loadingTerms,
    data: termsData,
    refetch: refetchTerms,
  } = useGetTermsQuery({}, { refetchOnMountOrArgChange: true });

  const handleSearch = useDebouncedCallback((value: string) => {
    // console.log(`Debounced Search Term: ${value}`);
    setFilters((prev) => ({ ...prev, admission_number: value }));
  }, 200);
  if (loadingClasses || loadingTerms) {
    return <ContentSpinner />;
  }

  if (!classesData || !termsData) {
    return <div>Failed to load classes or terms data.</div>;
  }

  const handleFilterChange = (
    e: ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    if (name === "admission_number") {
      handleSearch(value);
    } else if (name === "class_level") {
      const parsedValue = value ? parseInt(value, 10) : null;
      setSelectedClassLevel(parsedValue);
      setFilters((prev) => ({
        ...prev,
        class_level: value,
        term: "",
      }));
    } else {
      setFilters((prev) => ({ ...prev, [name]: value }));
    }
  };
  const filteredTerms = termsData?.filter(
    (term: any) => term.class_level.id === selectedClassLevel
  );
  const handleResetFilters = () => {
    setFilters({
      class_level: "",
      admission_number: "",
      term: "",
      exam_type: "",
    });

    router.push("?");
  };
  

  console.log("data", data);

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  return (
    <div className="space-y-5  py-2 px-2   min-h-[100vh] ">
      <div className="bg-white space-y-5 py-5">
        <div className="flex flex-col lg:gap-0 gap-3 p-3 lg:flex lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-2 ">
            <h2 className="font-semibold text-black lg:text-xl md:text-lg text-sm ">
              Terminal Report Forms
            </h2>
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:gap-0 lg:flex-row lg:items-center lg:justify-end  lg:space-x-5 px-2 ">
          <div className="relative lg:w-55 md:w-55 xl:w-55 ">
            <select
              name="class_level"
              value={filters.class_level || ""}
              onChange={handleFilterChange}
              className="w-full lg:w-55 md:w-55 xl:w-55 font-normal text-sm md:text-lg lg:text-lg appearance-none py-2 px-4 rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
            >
              <option value="">--- Select class ---</option>
              {classesData?.map((classLevel: ClassLevel) => (
                <option key={classLevel.id} value={classLevel.id}>
                  {classLevel.name} {classLevel?.stream?.name} -{" "}
                  {classLevel.calendar_year}
                </option>
              ))}
            </select>
            <BsChevronDown
              color="gray"
              size={20}
              className="absolute top-[50%] right-1 md:right-4 lg:right-4 transform -translate-y-1/2 text-[#1F4772] pointer-events-none"
            />
          </div>
          <div className="relative lg:w-55 md:w-55 xl:w-55">
            <select
              name="term"
              value={filters.term || ""}
              onChange={handleFilterChange}
              className="w-full lg:w-55 md:w-55 xl:w-55 font-normal text-sm md:text-lg lg:text-lg appearance-none py-2 px-4 rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
            >
              <option value="">--- Select term ---</option>
              {filteredTerms?.map((term: TermInterface) => (
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
          <div className="relative w-full lg:w-55 md:w-55 xl:w-55  ">
            <select
              name="exam_type"
              id="exam_type"
              value={filters.exam_type || ""}
              onChange={handleFilterChange}
              className="w-full lg:w-55 md:w-55 xl:w-55 
              text-sm md:text-lg lg:text-lg appearance-none py-2 px-4 font-normal rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
            >
              <option value="">--- Exam Type ---</option>
              <option value="Midterm">Midterm</option>
              <option value="Endterm">Endterm</option>
            </select>
            <BsChevronDown
              color="gray"
              size={20}
              className="absolute top-[50%] right-4 transform -translate-y-1/2 text-[#1F4772] pointer-events-none"
            />
          </div>
       
        </div>
        <div className="flex flex-col space-y-3 md:space-y-0  lg:flex-row md:flex-row lg:space-x-4 md:space-x-3 px-2 lg:justify-end md:justify-end   lg:items-center md:items-center">
        <div className=" relative w-full md:w-auto flex items-center gap-2 text-xs rounded-full  ring-[1.5px] ring-gray-300 px-2 focus-within:ring-1 focus-within:ring-blue-600 text-gray-500 focus-within:text-blue-600">
            <CiSearch size={20} className="" />

            <input
              type="text"
              name="admission_number"
              value={filters.admission_number || ""}
              onChange={handleFilterChange}
              placeholder="admission number"
              className=" w-full md:w-auto text-gray-900 lg:w-[200px] text-sm p-2 bg-transparent outline-none  "
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="w-full mx-2 md:mx-auto lg:mx-auto flex justify-center lg:w-11/12 md:w-11/12 bg-white rounded-md shadow-md py-8">
          <ContentSpinner />
        </div>
      ) : error ? (
        <div className="w-full mx-2 md:mx-auto lg:mx-auto flex justify-center lg:w-11/12 md:w-11/12   items-center space-x-2 py-5 text-black">
          <p className="text-sm lg:text-lg md:text-lg font-bold">
            {(error as any)?.data?.error || "An error occurred."}
          </p>
        </div>
      ) : data?.students_data && data.students_data.length > 0 ? (
        <Suspense fallback={<ContentSpinner />}>
          {isMobile ? (
            <div>
              <PDFDownloadLink
                document={<ReportPDF data={data.students_data} title={title} 
                subtitle={subtitle} />}
                fileName="report-cards.pdf"
              >
                <div className="mx-auto flex justify-center">
                  <div>
                    {loading ? (
                      <span className="flex items-center space-x-2">
                        <ContentSpinner />
                        <span>Preparing PDF...</span>
                      </span>
                    ) : (
                      <div className=" inline-flex items-center space-x-2  max-w-max px-4 py-2 rounded-md bg-primary text-white">
                        <BsFiletypePdf size={20} className="text-white" />
                        <span className="text-sm lg:text-md md:text-md">
                          Download ReportForms
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </PDFDownloadLink>
            </div>
          ) : (
            <PDFViewer style={{ width: "100%", height: "600px" }}>
              <ReportPDF data={data.students_data} title={title} subtitle={subtitle} />
            </PDFViewer>
          )}
        </Suspense>
      ) : (
        <div className="text-center text-red-600">
          {"No data available to display."}
        </div>
      )}
    </div>
  );
};

export default Reports;
