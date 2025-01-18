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
import { TbDatabaseOff } from "react-icons/tb";
import { Marks, Report } from "@/src/definitions/marks";
import { CiSearch } from "react-icons/ci";
import { MeritListPDF } from "./meritListPdf";
const MeritList = () => {
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
  const [selectedClassLevel, setSelectedClassLevel] = useState<number | null>(
    null
  );
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
    });

    router.push("?");
  };

  console.log("data", data);
  const reports: Report[] = data?.students_data || [];
  return (
    <div className="space-y-5 bg-white py-2 px-2   min-h-[100vh] ">
      <div className=" space-y-5 py-5">
        <div className="flex flex-col lg:gap-0 gap-3 p-3 lg:flex lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-2 ">
            <h2 className="font-semibold text-black lg:text-xl md:text-lg text-sm ">
              Merit List
            </h2>
          </div>
          {!loading && !error && reports?.length > 0 && (
            <PDFDownloadLink
              document={<MeritListPDF reports={reports} />}
              fileName="merit_list.pdf"
              className="bg-blue-500 text-white py-2 px-4 rounded"
            >
              Export PDF
            </PDFDownloadLink>
          )}
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

      <div className=" relative overflow-x-auto p-2  ">
        <table className="w-full bg-white text-sm border text-left rtl:text-right text-gray-500 ">
          <thead className="text-sm text-gray-700 uppercase border-b bg-gray-50 rounded-t-md">
            <tr>
              <th
                scope="col"
                className="px-6  py-4 text-xs lg:text-sm md:text-sm"
              >
                #
              </th>
              <th
                scope="col"
                className="px-6 py-4 text-xs lg:text-sm md:text-sm"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-6 py-4 text-xs lg:text-sm md:text-sm"
              >
                ADM No.
              </th>
              <th
                scope="col"
                className="px-6 py-4 text-xs lg:text-sm md:text-sm"
              >
                Mean Grade
              </th>

              <th
                scope="col"
                className="px-6 py-4 text-xs lg:text-sm md:text-sm"
              >
                Position
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-4">
                  <ContentSpinner />
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={4} className=" py-4">
                  <div className="flex items-center justify-center space-x-6 text-#1F4772">
                    <TbDatabaseOff size={25} />
                    <span>
                      {(error as any)?.data?.error || "No data to show"}
                    </span>
                  </div>
                </td>
              </tr>
            ) : reports && reports.length > 0 ? (
              reports?.map((report: Report, index: number) => (
                <tr key={index} className="bg-white border-b">
                  <th className="px-3 py-2 text-sm lg:text-lg md:text-lg text-gray-900">
                    {index + 1}
                  </th>
                  <td className="px-3 py-2 text-sm lg:text-lg md:text-lg font-normal text-gray-900 whitespace-nowrap">
                    {report.student.first_name} {report.student.last_name}
                  </td>
                  <td className="px-3 py-2 text-sm lg:text-lg md:text-lg font-normal text-gray-900 whitespace-nowrap">
                    {report.student.admission_number}
                  </td>
                  <td className="px-3 py-2 text-sm lg:text-lg md:text-lg font-normal text-gray-900 whitespace-nowrap">
                    {report.overall_grading.mean_grade}
                  </td>

                  <td className="lg:px-3 md:px-3 px-1 py-2 flex items-center font-bold">
                    {report.overall_grading.position}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-4">
                  <div className="flex items-center justify-center space-x-6 text-#1F4772">
                    <TbDatabaseOff size={25} />
                    <span>
                      {(error as any)?.data?.error || "No data to show"}
                    </span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MeritList;
