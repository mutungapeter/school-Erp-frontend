"use client";
import { useGetClassesQuery } from "@/redux/queries/classes/classesApi";

import { useGetStudentsBySubjectAndClassQuery } from "@/redux/queries/students/studentsApi";
import { useGetSubjectsQuery } from "@/redux/queries/subjects/subjectsApi";

import { ClassLevel } from "@/src/definitions/classlevels";
import { StudentSubject } from "@/src/definitions/students";
import { Subject } from "@/src/definitions/subjects";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { TbDatabaseOff } from "react-icons/tb";

import DataSpinner from "../layouts/dataSpinner";
import PageLoadingSpinner from "../layouts/PageLoadingSpinner";
import { AddMark } from "./recordMarks";
import { BsChevronDown } from "react-icons/bs";
const Marks = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const subjectId = searchParams.get("subject_id");
  const classLevelId = searchParams.get("class_level_id");

  const admissionNumber = searchParams.get("admission_number");
  const [filters, setFilters] = useState({
    subject_id: subjectId || "",
    class_level_id: classLevelId || "",
    admission_number: admissionNumber || "",
  });
  const [view, setView] = useState<"individual" | "group">("group");
  const queryParams = useMemo(() => {
    const params: any = {};

    if (admissionNumber) {
      params.admission_number = admissionNumber;
    }

    if (subjectId) {
      params.subject_id = subjectId;
    }

    if (classLevelId) {
      params.class_level_id = classLevelId;
    }

    return params;
  }, [subjectId, classLevelId, admissionNumber]);
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

  useEffect(() => {
    if (!loading && refetch) {
      if (admissionNumber) {
        refetch();
      } else if (subjectId && classLevelId) {
        refetch();
      } else if (subjectId && classLevelId) {
        refetch();
      }
    }
  }, [
    subjectId,
    classLevelId,
    admissionNumber,
    loading,

    loadingClasses,
    loadingSubjects,

    refetch,
  ]);

  const studentsData = data && data.length > 0 ? data : null;

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
  const handleApplyFilters = () => {
    const params = new URLSearchParams();
    if (filters.admission_number) {
      params.set("admission_number", filters.admission_number);
    }
    if (filters.subject_id) {
      params.set("subject_id", filters.subject_id);
    }
    if (filters.class_level_id) {
      params.set("class_level_id", filters.class_level_id);
    }
    router.push(`?${params.toString()}`);
  };
  const handleResetFilters = () => {
    setFilters({
      subject_id: "",
      class_level_id: "",
      admission_number: "",
    });
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
        <div className=" p-3  flex lg:flex-row md:flex-row lg:justify-between flex-col space-y-2 lg:space-y-0 md:space-y-0">
          <div className="space-y-2     w-full">
            <h2 className="font-semibold text-black text-xl">
              Recording Marks for a student
            </h2>
            <div>
              <p className="text-[13px] lg:text-md md:text-md ">
                To record marks for a student, you can choose to record for and
                individual or for given class/group . Select the filters as
                needed.
              </p>
            </div>
          </div>
          
        </div>
        <div className="flex justify-between lg:justify-end px-3 lg:space-x-5 mt-6 ">
            <button
              onClick={handleApplyFilters}
              className="lg:py-2 lg:px-4 p-2 text-[13px] lg:text-lg  rounded-md border bg-primary text-white"
            >
              Apply Filters
            </button>
            <button
              onClick={handleResetFilters}
              className="lg:py-2 lg:px-4 p-2 text-[13px] lg:text-lg shadow-md rounded-md border bg-white text-primary"
            >
              Reset Filters
            </button>
          </div>
        <div className="flex flex-col gap-3 lg:gap-0 lg:flex-row lg:items-center lg:justify-end  lg:space-x-5 px-2 ">
          <div className="relative w-full lg:w-64 md:w-64 xl:w-64 ">
            <label
              htmlFor="subject"
              className="block text-gray-900 md:text-lg text-sm lg:text-lg  font-normal  mb-2"
            >
              Subject
            </label>
            <select
              name="subject_id"
              value={filters.subject_id || ""}
              onChange={handleSelectChange}
              className="w-full lg:w-64 md:w-64 xl:w-64 appearance-none py-2 px-4 text-lg rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
              // className="w-64  py-2 px-4 rounded-md border border-[#1F4772] focus:outline-none focus:bg-white"
            >
              <option value="">Select Subject</option>
              {subjectsData?.map((subject: Subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.subject_name}
                </option>
              ))}
            </select>
            <BsChevronDown 
                      color="gray" 
                      size={20}
              className="absolute top-[70%] right-4 transform -translate-y-1/2 text-[#1F4772] pointer-events-none"
            />
          </div>
          <div className="relative w-full lg:w-64 md:w-64 xl:w-64 ">
            <label
              htmlFor="class"
             className="block text-gray-900 md:text-lg text-sm lg:text-lg  font-normal  mb-2"
            >
              Class
            </label>
            <select
              name="class_level_id"
              value={filters.class_level_id || ""}
              onChange={handleSelectChange}
              className="w-full lg:w-64 md:w-full xl:w-64 appearance-none py-2 px-4 text-lg rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
              // className="w-64  py-2 px-4 rounded-md border border-[#1F4772] focus:outline-none focus:bg-white"
            >
              <option value="">Select Class</option>
              {classesData?.map((classLevel: ClassLevel) => (
                <option key={classLevel.id} value={classLevel.id}>
                  {classLevel.form_level.name} {classLevel?.stream?.name}
                </option>
              ))}
            </select>
            <BsChevronDown 
                      color="gray" 
                      size={20}
              className="absolute top-[70%] right-4 transform -translate-y-1/2 text-[#1F4772] pointer-events-none"
            />
          </div>
          <div className="relative w-full lg:w-64 md:w-64 xl:w-64 ">
            <label
              htmlFor="class"
              className="block text-gray-900 md:text-lg text-sm lg:text-lg  font-normal  mb-2"
            >
              Admission No
            </label>
            <input
              type="text"
              name="admission_number"
              value={filters.admission_number || ""}
              onChange={handleSelectChange}
              placeholder="Find by Admission Number"
              className="w-full lg:w-64 md:w-64 xl:w-64  py-2 px-4 rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
            />
          </div>
        </div>
        <div className=" relative overflow-x-auto p-2  ">
          <table className="w-full bg-white text-sm border text-left rtl:text-right text-gray-500 ">
            <thead className="text-sm text-gray-700 uppercase border-b bg-gray-50 rounded-t-md">
              <tr>
                <th scope="col" className="px-6 py-4">
                  #
                </th>
                <th scope="col" className="px-6 py-4">
                  Name
                </th>
                <th scope="col" className="px-6 py-4">
                  Subject
                </th>

                <th scope="col" className="px-6 py-4">
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
                    <td className="px-3 py-2 text-sm lg:text-lg md:text-lg font-medium text-gray-900 whitespace-nowrap">
                      {studentSubject.student.first_name}{" "}
                      {studentSubject.student.last_name}
                    </td>
                    <td className="px-3 py-2 text-sm lg:text-lg md:text-lg font-medium text-gray-900 whitespace-nowrap">
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
