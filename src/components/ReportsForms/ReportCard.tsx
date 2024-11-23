"use client";
import { useGetClassesQuery } from "@/redux/queries/classes/classesApi";
import { useGetReportFormsQuery } from "@/redux/queries/marks/reportsApi";
import { ClassLevel } from "@/src/definitions/classlevels";
import { useRouter, useSearchParams } from "next/navigation";
import { BsFiletypePdf } from "react-icons/bs";
import {
  ChangeEvent,
  useEffect,
  useMemo,
  useState,
  Suspense,
  lazy,
} from "react";
import { BsChevronDown } from "react-icons/bs";
import { TbDatabaseOff } from "react-icons/tb";
import { useDebouncedCallback } from "use-debounce";
import { VscRefresh } from "react-icons/vsc";
import { CiSearch } from "react-icons/ci";
import { useGetTermsQuery } from "@/redux/queries/terms/termsApi";
import { TermInterface } from "@/src/definitions/terms";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import PageLoadingSpinner from "@/src/components/layouts/PageLoadingSpinner";
import { pdf, PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { ImFilePdf } from "react-icons/im";
import ContentSpinner from "../layouts/contentSpinner";
import dynamic from "next/dynamic";
import ReportPDF from "./reportPdf";
const Reports = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialFilters = useMemo(
    () => ({
      class_level: searchParams.get("class_level") || "",
      admission_number: searchParams.get("admission_number") || "",
      term: searchParams.get("term") || "",
    }),
    [searchParams]
  );

  const [filters, setFilters] = useState(initialFilters);
  const { user, loading: loadingUser } = useAppSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.class_level) params.set("class_level", filters.class_level);
    if (filters.admission_number)
      params.set("admission_number", filters.admission_number);
    if (filters.term) params.set("term", filters.term);

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
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

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
          <div className="flex lg:space-x-4 space-x-2 md:space-x-4 items-center">
            <div className="relative w-34 lg:w-40 md:w-40 xl:w-40 ">
              <select
                name="class_level"
                value={filters.class_level || ""}
                onChange={handleFilterChange}
                className="w-34 lg:w-40 md:w-40 xl:w-40 appearance-none py-2 px-4 text-xs md:text-sm lg:text-sm font-semibold rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
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
                className="absolute top-[50%] right-1 md:right-4 lg:right-4 transform -translate-y-1/2 text-[#1F4772] pointer-events-none"
              />
            </div>
            <div className="relative w-32 lg:w-40 md:w-40 xl:w-40">
              <select
                name="term"
                value={filters.term || ""}
                onChange={handleFilterChange}
                className="w-32 lg:w-40 md:w-40 xl:w-40 appearance-none py-2 px-4 text-xs md:text-sm lg:text-sm font-semibold rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-xs md:placeholder:text-sm lg:placeholder:text-sm"
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
          <div className="flex flex-col space-y-3 md:space-y-0 md:space-y-0 lg:flex-row md:flex-row lg:space-x-4 md:space-x-4  lg:items-center md:items-center">
          <div className="relative w-full lg:w-64 md:w-64 xl:w-64 ">
                <CiSearch
                  size={20}
                  className="absolute text-gray-500 top-[50%] left-3 transform -translate-y-1/2 text-[#1F4772] pointer-events-none"
                />
                <input
                  type="text"
                  name="admission_number"
                  value={filters.admission_number || ""}
                  onChange={handleFilterChange}
                  placeholder="admission number"
                  className="w-full lg:w-64 md:w-64 xl:w-64  py-2  pl-8 pr-4  rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-xs md:placeholder:text-lg lg:placeholder:text-lg placeholder:font-semibold"
                />
              </div>

              <div
                onClick={handleResetFilters}
                className="lg:py-2 lg:px-4 p-2 cursor-pointer max-w-max flex  inline-flex space-x-2 items-center text-[13px] md:py-2 md:px-2 lg:text-lg md:text-xs  rounded-md border text-white bg-primary"
              >
                <VscRefresh className="text-white" />
                <span>Reset Filters</span>
              </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="w-full mx-2 md:mx-auto lg:mx-auto flex justify-center lg:w-11/12 md:w-11/12 bg-white rounded-md shadow-md py-8">
          <ContentSpinner />
        </div>
      ) : error ? (
        <div className="w-full mx-2 md:mx-auto lg:mx-auto flex justify-center lg:w-11/12 md:w-11/12   items-center space-x-2 py-5 text-red-600">
          <p className="text-sm lg:text-lg md:text-lg font-bold">
            {(error as any)?.data?.error || "An error occurred."}
          </p>
        </div>
      ) : data?.students_data && data.students_data.length > 0 ? (
        <Suspense fallback={<ContentSpinner />}>
          {isMobile ? (
            <div>
              <PDFDownloadLink
                document={<ReportPDF data={data.students_data} title={title} />}
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
                      <div className="flex inline-flex items-center space-x-2  max-w-max px-4 py-2 rounded-md bg-primary text-white">
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
              <ReportPDF data={data.students_data} title={title} />
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
