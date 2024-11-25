"use client";
import { useGetClassesQuery } from "@/redux/queries/classes/classesApi";
import { useGetMarksDataQuery } from "@/redux/queries/marks/marksApi";
import { useGetSubjectsQuery } from "@/redux/queries/subjects/subjectsApi";
import { ClassLevel } from "@/src/definitions/classlevels";
import { MarksInterface } from "@/src/definitions/marks";
import { Subject } from "@/src/definitions/subjects";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { TbDatabaseOff } from "react-icons/tb";
import { DefaultLayout } from "../layouts/DefaultLayout";
import PageLoadingSpinner from "../layouts/PageLoadingSpinner";
import DeleteMarkRecord from "./deleteMarks";
import EditMarks from "./editMarks";
import { VscRefresh } from "react-icons/vsc";
import { CiSearch } from "react-icons/ci";
import DataSpinner from "../layouts/dataSpinner";
import { BsChevronDown } from "react-icons/bs";
import { useGetTermsQuery } from "@/redux/queries/terms/termsApi";
import { TermInterface } from "@/src/definitions/terms";
import ContentSpinner from "../perfomance/contentSpinner";
const MarksList = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialFilters = useMemo(
    () => ({
      class_level: searchParams.get("class_level") || "",
      admission_number: searchParams.get("admission_number") || "",
      term: searchParams.get("term") || "",
      subject: searchParams.get("subject") || "",
    }),
    [searchParams]
  );
  const [filters, setFilters] = useState(initialFilters);
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.class_level){
      params.set("class_level", filters.class_level)
    };
    if (filters.admission_number) {
      params.set("admission_number", filters.admission_number)
    };
    if (filters.term){
      params.set("term", filters.term)
    };
    if (filters.subject){
      params.set("subject", filters.subject)
    };

    router.replace(`?${params.toString()}`);
  }, [filters]);

  const {
    isLoading: loading,
    data,
    error,
    refetch,
  } = useGetMarksDataQuery(
    {
      class_level: filters.class_level || "",
      term: filters.term || "",
      admission_number: filters.admission_number || "",
      subject: filters.subject || "",
    },
    { 
      skip: false,
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true
     }
  );
  const {
    isLoading: loadingClasses,
    data: classesData,
    refetch: refetchClasses,
  } = useGetClassesQuery({}, { refetchOnMountOrArgChange: true });

  const {
    isLoading: loadingSubjects,
    data: subjectsData,
    refetch: refetchSubjects,
  } = useGetSubjectsQuery({}, { refetchOnMountOrArgChange: true });

  const {
    isLoading: loadingTerms,
    data: termsData,
    refetch: refetchTerms,
  } = useGetTermsQuery({}, { refetchOnMountOrArgChange: true });

  const handleSearch = useDebouncedCallback((value: string) => {
    // console.log(`Debounced Search Term: ${value}`);
    setFilters((prev) => ({ ...prev, admission_number: value }));
  }, 100);
  const studentsData = data && data.length > 0 ? data : null;

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
      subject: "",
      term: "",
    });
    const params = new URLSearchParams();
    router.push("?");
  };
  const refetchMarks = () => {
    refetch();
  };
  // if (loading) {
  //   return (
  //     <div className="mx-auto w-full md:max-w-screen-2xl lg:max-w-screen-2xl p-3 md:p-4 2xl:p-5">
  //       <PageLoadingSpinner />
  //     </div>
  //   );
  // }
  console.log("terms", termsData)
  return (
    <div className="space-y-5 shadow-md border py-2  bg-white">
      <div className=" p-3  space-y-3">
        <h2 className="font-semibold text-black text-xl">Marks Records</h2>
      </div>

      <div className="flex flex-col gap-3 lg:gap-0 lg:flex-row lg:items-center lg:justify-end md:justify-end  lg:space-x-5 px-2 ">
        <div className="flex lg:space-x-4 space-x-2 md:space-x-4 items-center">
          <div className="relative w-34 lg:w-40 md:w-40 xl:w-40 ">
            <select
              name="subject"
              value={filters.subject || ""}
              onChange={handleFilterChange}
              className="w-34 lg:w-40 md:w-40 xl:w-40   appearance-none py-2 px-4 text-xs md:text-sm lg:text-sm  font-semibold rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
            >
              <option value="">Subject</option>
              {subjectsData?.map((subject: Subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.subject_name}
                </option>
              ))}
            </select>
            <BsChevronDown
              color="gray"
              size={20}
              className="absolute top-[50%] right-4 transform -translate-y-1/2 text-[#1F4772] pointer-events-none"
            />
          </div>
          <div className="relative w-34 lg:w-40 md:w-40 xl:w-40  ">
            <select
              name="class_level"
              value={filters.class_level || ""}
              onChange={handleFilterChange}
              className="w-34 lg:w-40 md:w-40 xl:w-40
             appearance-none py-2 px-4
               text-xs md:text-sm lg:text-sm font-semibold rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
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
        </div>
        <div className="flex flex-col space-y-3 md:space-y-0 md:space-y-0 lg:flex-row md:flex-row lg:space-x-4 md:space-x-4  lg:items-center md:items-center">
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
        
      </div>
      <div className="flex flex-col space-y-3 md:space-y-0 md:space-y-0 lg:flex-row md:flex-row lg:space-x-4 md:space-x-4 px-4 lg:justify-end md:justify-end   lg:items-center md:items-center">
          <div className="relative w-full lg:w-64 md:w-64 xl:w-64  ">
            <CiSearch
              size={20}
              className="absolute text-gray-500 top-[50%] left-3 transform -translate-y-1/2 text-[#1F4772] pointer-events-none"
            />
            <input
              type="text"
              name="admission_number"
              value={filters.admission_number || ""}
              onChange={handleFilterChange}
              placeholder="Admission Number"
              className="w-full lg:w-64 md:w-64 xl:w-64 text-sm md:text-lg lg:text-lg font-normal py-2 pl-8 pr-4 rounded-md border border-1 border-gray-400 focus:outline-none  focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm placeholder:font-semibold lg:placeholder:text-sm"
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
      <div className=" relative overflow-x-auto p-2  ">
        <table className="w-full bg-white text-sm border text-left rtl:text-right text-gray-500 ">
          <thead className="text-sm text-gray-700 uppercase border-b bg-gray-50 rounded-t-md">
            <tr>
              <th scope="col" className="px-6 py-3 text-xs">
                #
              </th>
              <th scope="col" className="px-6 py-3 text-xs">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-xs">
                Subject
              </th>
              <th scope="col" className="px-6 py-3 text-xs">
                Cat
              </th>
              <th scope="col" className="px-6 py-3 text-xs">
                Exam
              </th>
              <th scope="col" className="px-6 py-3 text-xs">
                Total
              </th>
              <th scope="col" className="px-6 py-3 text-xs">
                Grade
              </th>
              <th scope="col" className="px-6 py-3 text-xs">
                Points
              </th>
              <th scope="col" className="px-6 py-3 text-xs">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="text-center py-4">
                  <ContentSpinner />
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={8} className=" py-4">
                  <div className="flex items-center justify-center space-x-6 text-#1F4772">
                    <TbDatabaseOff size={25} />
                    <span>
                      {(error as any)?.data?.error || "No data to show"}
                    </span>
                  </div>
                </td>
              </tr>
            ) : data && data.length > 0 ? (
              data.map((marksData: MarksInterface, index: number) => (
                <tr key={marksData.id} className="bg-white border-b">
                  <th className="px-3 py-2 text-sm lg:text-lg md:text-lg text-gray-900">
                    {index + 1}
                  </th>
                  <td className="px-3 py-2 text-sm lg:text-lg md:text-lg font-normal text-gray-900 whitespace-nowrap">
                    {marksData.student.first_name} {marksData.student.last_name}
                  </td>
                  <td className="px-3 py-2 text-sm lg:text-sm md:text-sm">
                    {marksData.student_subject?.subject.subject_name}
                  </td>
                  <td className="px-3 py-2 text-sm lg:text-sm md:text-sm">
                    {marksData.cat_mark}
                  </td>
                  <td className="px-3 py-2 text-sm lg:text-sm md:text-sm">
                    {marksData.exam_mark}
                  </td>
                  <td className="px-3 py-2 text-sm lg:text-sm md:text-sm">
                    {marksData.total_score}
                  </td>
                  <td className="px-3 py-2 text-sm lg:text-lg md:text-sm">
                    {marksData.grade}
                  </td>
                  <td className="px-3 py-2 text-sm lg:text-sm md:text-sm">
                    {marksData.points}
                  </td>
                  <td className="px-3 py-2 flex items-center space-x-5">
                    <EditMarks
                      marksId={marksData.id}
                      refetchMarks={refetchMarks}
                    />
                    <DeleteMarkRecord
                      marksId={marksData.id}
                      refetchMarks={refetchMarks}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-4">
                  <span className="text-sm lg:text-lg md:text-lg text-red-500">
                   No data to show
                  </span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default MarksList;
