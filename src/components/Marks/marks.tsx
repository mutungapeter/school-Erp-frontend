"use client";
import { useGetClassesQuery } from "@/redux/queries/classes/classesApi";

import { useGetStudentsBySubjectAndClassQuery } from "@/redux/queries/students/studentsApi";
import { ClassLevel } from "@/src/definitions/classlevels";
import { useGetSubjectsQuery } from "@/redux/queries/subjects/subjectsApi";

import { StudentSubject } from "@/src/definitions/students";
import { Subject } from "@/src/definitions/subjects";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { TbDatabaseOff } from "react-icons/tb";
import { IoMdSearch } from "react-icons/io";
import DataSpinner from "../layouts/dataSpinner";
import PageLoadingSpinner from "../layouts/PageLoadingSpinner";
import { AddMark } from "./recordMarks";
import { BsChevronDown, BsFiletypeCsv } from "react-icons/bs";
import { useDebouncedCallback } from "use-debounce";
import { FaSearch } from "react-icons/fa";
import { UploadMarks } from "./uploadMarks";
import { VscRefresh } from "react-icons/vsc";
import { CiSearch } from "react-icons/ci";
import ContentSpinner from "../perfomance/contentSpinner";
import { useGetTermsQuery } from "@/redux/queries/terms/termsApi";
import { TermInterface } from "@/src/definitions/terms";
const Marks = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedClassLevel, setSelectedClassLevel] = useState<number | null>(
    null
  );
  const initialFilters = useMemo(
    () => ({
      subject_id: searchParams.get("subject_id") || "",
      class_level_id: searchParams.get("class_level_id") || "",
      term_id: searchParams.get("term_id") || "",
      admission_number: searchParams.get("admission_number") || "",
    }),
    [searchParams]
  );
  const [filters, setFilters] = useState(initialFilters);
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.subject_id) {
      params.set("subject_id", filters.subject_id);
    }
    if (filters.class_level_id) {
      params.set("class_level_id", filters.class_level_id);
    }
    if (filters.term_id) {
      params.set("term_id", filters.term_id);
    }
    if (filters.admission_number) {
      params.set("admission_number", filters.admission_number);
    }

    router.push(`?${params.toString()}`);
  }, [filters]);

  const {
    isLoading: loading,
    data,
    error,
    refetch,
  } = useGetStudentsBySubjectAndClassQuery(
    {
      subject_id: filters.subject_id || "",
      class_level_id: filters.class_level_id || "",
      term_id: filters.term_id || "",
      admission_number: filters.admission_number || "",
    },
    {
      skip: false,
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
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

  const studentsData = data && data.length > 0 ? data : null;
  const handleSearch = useDebouncedCallback((value: string) => {
    console.log(`Debounced Search Term: ${value}`);
    setFilters((prev) => ({ ...prev, admission_number: value }));
  }, 100);

  const handleFilterChange = (
    e: ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    if (name === "admission_number") {
      handleSearch(value);
    } else if (name === "class_level_id") {
      const parsedValue = value ? parseInt(value, 10) : null;
      setSelectedClassLevel(parsedValue);
      setFilters((prev) => ({
        ...prev,
        class_level_id: value,
        term_id: "",
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
      class_level_id: "",
      admission_number: "",
      subject_id: "",
      term_id: "",
    });
    const params = new URLSearchParams();
    router.push("?");
  };
  const selectedTerm = filters.term_id
    ? filteredTerms?.find((term: any) => term.id === parseInt(filters.term_id))
    : null;
  console.log("data", data);
  console.log("error", error);
  console.log("studentsData", studentsData);
  return (
    <>
      <div className="space-y-5 shadow-md border py-2  bg-white  ">
        <div className="py-2 px-3  flex lg:flex-row md:flex-row lg:justify-between md:justify-between flex-col space-y-3 lg:space-y-0 md:space-y-0">
          <h2 className="font-semibold text-black text-xl">Recording Marks</h2>
          <div className="flex justify-end lg:justify-none md:justify-none items-center mt-4">
            <UploadMarks />
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:gap-0 lg:flex-row lg:items-center md:justify-end lg:justify-end  lg:space-x-5 px-2 ">
          {/* <div className="flex lg:space-x-4 space-x-2 md:space-x-4 items-center"> */}
          <div className="relative w-full lg:w-55 md:w-55 xl:w-55 ">
            <select
              name="subject_id"
              value={filters.subject_id || ""}
              onChange={handleFilterChange}
              className="w-full lg:w-55 md:w-55 xl:w-55 
                text-sm md:text-lg lg:text-lg appearance-none py-2 px-4 font-normal rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
            >
              <option value="">-- Select subject ---</option>
              {subjectsData?.map((subject: Subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.subject_name}
                </option>
              ))}
            </select>
            <BsChevronDown
              color="gray"
              size={17}
              className="absolute top-[55%] right-4 transform -translate-y-1/2 text-[#1F4772] pointer-events-none"
            />
          </div>
          <div className="relative w-full lg:w-55 md:w-55 xl:w-55 ">
            <select
              name="class_level_id"
              value={filters.class_level_id || ""}
              onChange={handleFilterChange}
              className="w-full lg:w-55 md:w-55 xl:w-55 font-normal text-sm md:text-lg lg:text-lg appearance-none py-2 px-4 rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
            >
              <option value="">--- Select class ---</option>
              {classesData?.map((classLevel: ClassLevel) => (
                <option key={classLevel.id} value={classLevel.id}>
                  {classLevel.form_level.name} {classLevel?.stream?.name} -{" "}
                  {classLevel.calendar_year}
                </option>
              ))}
            </select>
            <BsChevronDown
              color="gray"
              size={17}
              className="absolute top-[55%] right-4 transform -translate-y-1/2 text-[#1F4772] pointer-events-none"
            />
          </div>

          {/* </div> */}
          <div className="relative w-full lg:w-55 md:w-55 xl:w-55">
            <select
              name="term_id"
              value={filters.term_id || ""}
              onChange={handleFilterChange}
              className="w-full lg:w-55 md:w-55 xl:w-55 appearance-none py-2 px-4 text-sm md:text-lg lg:text-lg font-normal rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-xs md:placeholder:text-sm lg:placeholder:text-sm"
            >
              <option value="">--- Select term ---</option>
              {filteredTerms?.map((term: TermInterface) => (
                <option key={term.id} value={term.id}>
                  {term.term}
                </option>
              ))}
            </select>
            <BsChevronDown
              color="gray"
              size={15}
              className="absolute top-[50%] right-4 transform -translate-y-1/2 text-[#1F4772] pointer-events-none"
            />
          </div>
        </div>
        <div className="flex flex-col gap-3 lg:gap-0 lg:flex-row lg:items-center md:justify-end lg:justify-end  lg:space-x-5 px-2 ">
          <div className="flex flex-col space-y-3 md:space-y-0  lg:flex-row md:flex-row lg:space-x-4 md:space-x-4  lg:items-center md:items-center">
            <div className="relative w-full lg:w-64 md:w-64 xl:w-64 transition-all ease-in-out duration-300 ">
              <IoMdSearch
                size={25}
                style={{ strokeWidth: 3 }}
                className="absolute stroke-2 text-[#1E9FF2] top-[50%] left-3 transform -translate-y-1/2  pointer-events-none"
              />

              <input
                type="text"
                name="admission_number"
                value={filters.admission_number || ""}
                onChange={handleFilterChange}
                placeholder="admission number"
                className="w-full lg:w-56 md:w-56 xl:w-56  p-2 transition-all ease-in-out duration-300 pl-10 pr-4 rounded-full border border-1 border-[#1E9FF2] focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-lg lg:placeholder:text-ld"
              />
            </div>
            <div
              onClick={handleResetFilters}
              className=" p-2 cursor-pointer max-w-max   inline-flex space-x-2 items-center text-[13px]  lg:text-lg md:text-xs  rounded-lg border text-white bg-primary"
            >
              <VscRefresh className="text-white" />
              <span className="text-sm">Reset Filters</span>
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
                  Subject
                </th>

                <th
                  scope="col"
                  className="px-6 py-4 text-xs lg:text-sm md:text-sm"
                >
                  Actions
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
              ) : data && data.length > 0 ? (
                data?.map((studentSubject: StudentSubject, index: number) => (
                  <tr key={index} className="bg-white border-b">
                    <th className="px-3 py-2 text-sm lg:text-lg md:text-lg text-gray-900">
                      {index + 1}
                    </th>
                    <td className="px-3 py-2 text-sm lg:text-lg md:text-lg font-normal text-gray-900 whitespace-nowrap">
                      {studentSubject.student.first_name}{" "}
                      {studentSubject.student.last_name}
                    </td>
                    <td className="px-3 py-2 text-sm lg:text-lg md:text-lg font-normal text-gray-900 whitespace-nowrap">
                      {studentSubject?.subject?.subject_name}
                    </td>

                    <td className="lg:px-3 md:px-3 px-1 py-2 flex items-center ">
                      <AddMark
                        studentSubject={studentSubject}
                        terms={filteredTerms}
                        term={selectedTerm}
                      />
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
    </>
  );
};
export default Marks;
