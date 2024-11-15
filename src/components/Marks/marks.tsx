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

import DataSpinner from "../layouts/dataSpinner";
import PageLoadingSpinner from "../layouts/PageLoadingSpinner";
import { AddMark } from "./recordMarks";
import { BsChevronDown, BsFiletypeCsv } from "react-icons/bs";
import { useDebouncedCallback } from "use-debounce";
import { SiMicrosoftexcel } from "react-icons/si";
import { UploadMarks } from "./uploadMarks";
const Marks = () => {
  const router = useRouter();
  const searchParams = useSearchParams();


  const initialFilters = useMemo(
    () => ({
      subject_id: searchParams.get("subjectId") || "",
      class_level_id: searchParams.get("classLevelId") || "",
      admission_number: searchParams.get("admission_number") || "",
    }),
    [searchParams]
  );
  const [filters, setFilters] = useState(initialFilters);
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.subject_id)
      params.set("subject_id", filters.subject_id);
    if (filters.class_level_id)
      params.set("class_level_id", filters.class_level_id);
    if (filters.admission_number)
      params.set("admission_number", filters.admission_number);

    router.push(`?${params.toString()}`);
  }, [filters]);

  const queryParams = useMemo(
    () => ({
      ...filters,
    }),
    [ filters]
  );
  const {
    isLoading: loading,
    data,
    error,
    refetch,
  } = useGetStudentsBySubjectAndClassQuery(queryParams, { skip: false });

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

  

  const studentsData = data && data.length > 0 ? data : null;
  const handleSearch = useDebouncedCallback((value: string) => {
    console.log(`Debounced Search Term: ${value}`);
    setFilters((prev) => ({ ...prev, admission_number: value }));
  }, 200);
  const handleSelectChange = (
    e: ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));

    // router.push(`marks/?${params.toString()}`);
  };
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
    setFilters({ class_level_id: "", admission_number: "", subject_id: "" });
    router.push("?");
  };

  if (loading) {
    return (
      <div className="mx-auto w-full md:max-w-screen-2xl lg:max-w-screen-2xl p-3 md:p-4 2xl:p-5">
        <PageLoadingSpinner />
      </div>
    );
  }
  // console.log("data", data);
  // console.log("studentsData", studentsData);
  return (
    <>
      <div className="space-y-5 shadow-md border py-2  bg-white  ">
        <div className="p-2  flex lg:flex-row md:flex-row lg:justify-between flex-col space-y-3 lg:space-y-0 md:space-y-0">
          
            <h2 className="font-semibold text-black text-xl">
              Recording Marks
            </h2>
          <div className="flex flex-row space-x-3 items-center mt-4">
           <UploadMarks />
            {/* <div className="flex items-center bg-green-700 space-x-2 px-2 py-1 rounded-sm cursor-pointer">
            <BsFiletypeCsv  size={16} className="text-white" />
            <h5 className="text-white text-xs lg:text-sm md:text-sm">upload csv</h5>
            </div> */}
        
          </div>
          
        </div>
       
        <div className="flex flex-col gap-3 lg:gap-0 lg:flex-row lg:items-center lg:justify-end  lg:space-x-5 px-2 ">
         <div className="flex space-x-4 items-center">

          <div className="relative w-32  lg:w-32 md:w-32 xl:w-32 ">      
            <select
              name="subject_id"
              value={filters.subject_id || ""}
              onChange={handleFilterChange}
              className="w-32 lg:w-32 md:w-32 xl:w-32 text-sm md:text-md lg:text-md appearance-none py-2 px-4 text-lg rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
            
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
                      size={17}
              className="absolute top-[50%] right-4 transform -translate-y-1/2 text-[#1F4772] pointer-events-none"
            />
          </div>
          <div className="relative w-32   lg:w-32 md:w-32 xl:w-32 ">
            <select
              name="class_level_id"
              value={filters.class_level_id || ""}
              onChange={handleFilterChange}
              className="w-32  lg:w-32 md:w-32 xl:w-32 text-sm md:text-md lg:text-md appearance-none py-2 px-4 text-lg rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
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
                      size={17}
              className="absolute top-[50%] right-4 transform -translate-y-1/2 text-[#1F4772] pointer-events-none"
            />
          </div>
         </div>
         <div className="flex space-x-4 items-center">

          <div className="relative w-40  lg:w-40 md:w-40 xl:w-40  ">
          
            <input
              type="text"
              name="admission_number"
              value={filters.admission_number || ""}
              onChange={handleFilterChange}
              placeholder="Admission Number"
              className="w-40  lg:w-40 md:w-40 xl:w-40 text-xs md:text-md lg:text-md py-2 px-4 rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
            />
          </div>
          <div>

          <button
              onClick={handleResetFilters}
              className="py-1 px-2  text-[13px] lg:text-lg shadow-md rounded-md border bg-primary text-white"
            >
              Reset Filters
            </button>
          </div>
         </div>
          
        </div>
        <div className=" relative overflow-x-auto p-2  ">
          <table className="w-full bg-white text-sm border text-left rtl:text-right text-gray-500 ">
            <thead className="text-sm text-gray-700 uppercase border-b bg-gray-50 rounded-t-md">
              <tr>
                <th scope="col" className="px-6  py-4 text-xs lg:text-sm md:text-sm">
                  #
                </th>
                <th scope="col" className="px-6 py-4 text-xs lg:text-sm md:text-sm">
                  Name
                </th>
                <th scope="col" className="px-6 py-4 text-xs lg:text-sm md:text-sm">
                  Subject
                </th>

                <th scope="col" className="px-6 py-4 text-xs lg:text-sm md:text-sm">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-4">
                    <DataSpinner />
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={4} className=" py-4">
                    <div className="flex items-center justify-center space-x-6 text-#1F4772">
                      <TbDatabaseOff size={25} />
                      <span>
                        {(error as any).data.error || "No data to show"}
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
                      <AddMark studentSubject={studentSubject} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-4">
                    {studentsData?.length === 0 || !studentsData
                      ? "No students found."
                      : "No subjects found."}
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
