"use client";
import { useGetClassesQuery } from "@/redux/queries/classes/classesApi";
import { useGetMarksDataQuery } from "@/redux/queries/marks/marksApi";
import { useGetSubjectsQuery } from "@/redux/queries/subjects/subjectsApi";
import { ClassLevel } from "@/src/definitions/classlevels";
import { MarksInterface } from "@/src/definitions/marks";
import { Subject } from "@/src/definitions/subjects";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { TbDatabaseOff } from "react-icons/tb";
import { DefaultLayout } from "../layouts/DefaultLayout";
import PageLoadingSpinner from "../layouts/PageLoadingSpinner";
import DeleteMarkRecord from "./deleteMarks";
import EditMarks from "./editMarks";
import DataSpinner from "../layouts/dataSpinner";
const MarksList = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const subjectId = searchParams.get("subject");
  const classLevelId = searchParams.get("class_level");
  const admissionNumber = searchParams.get("admission_number");

  const [filters, setFilters] = useState({
    subject: subjectId || "",
    class_level: classLevelId || "",
    admission_number: admissionNumber || "",
  });
  const queryParams = useMemo(() => {
    const params: any = {};

    if (admissionNumber) {
      params.admission_number = admissionNumber;
    }

    if (subjectId) {
      params.subject = subjectId;
    }

    if (classLevelId) {
      params.class_level = classLevelId;
    }

    return params;
  }, [subjectId, classLevelId, admissionNumber]);
  const {
    isLoading: loading,
    data,
    error,
    refetch,
  } = useGetMarksDataQuery(queryParams, { skip: false });
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
  };

  const handleApplyFilters = () => {
    const params = new URLSearchParams();
    if (filters.admission_number) {
      params.set("admission_number", filters.admission_number);
    }
    if (filters.subject) {
      params.set("subject", filters.subject);
    }
    if (filters.class_level) {
      params.set("class_level", filters.class_level);
    }
    router.push(`?${params.toString()}`);
  };
  const handleResetFilters = () => {
    setFilters({
      subject: "",
      class_level: "",
      admission_number: "",
    });
    router.push("?");
  };
const refetchMarks=()=>{
  refetch();
}
if (loading) {
  return (
    <div className="mx-auto w-full md:max-w-screen-2xl lg:max-w-screen-2xl p-3 md:p-4 2xl:p-5">
      <PageLoadingSpinner />
    </div>
  );
}
  return (
    <div className="space-y-5 shadow-md border py-2  bg-white">
      <div className=" p-3  space-y-3">
        <h2 className="font-semibold text-black text-xl">Marks Records</h2>
        <div>
          
          <p className="text-[13px] lg:text-md md:text-md">
            To view marks for a student, you select the subject and class, and
            admission number. Note: For teachers in order to use admission
            number you have to select subject and class first then enter
            admission number.
          </p>
        </div>
      </div>
      <div className="flex justify-between lg:justify-end px-3 lg:space-x-5 py-3 ">
          <button
            onClick={handleApplyFilters}
            className="lg:py-2 lg:px-4 p-2 text-[13px] lg:text-lg  rounded-md border bg-primary text-white"
          >
            Apply Filters
          </button>
          <button
            onClick={handleResetFilters}
            className="lg:py-2 lg:px-4 p-2 text-[13px] lg:text-lg  rounded-md border bg-white text-primary"
          >
            Reset Filters
          </button>
        </div>
      <div className="flex flex-col gap-3 lg:gap-0 lg:flex-row lg:items-center lg:justify-end lg:space-x-5 p-2 ">
        <div className="relative w-full lg:w-64 md:w-full xl:w-64 ">
          <label
            htmlFor="subject"
            className="block text-gray-700 text-sm  font-semibold mb-2"
          >
            Subject
          </label>
          <select
            name="subject"
            value={filters.subject || ""}
            onChange={handleSelectChange}
            className="w-full lg:w-64 md:w-full xl:w-64 appearance-none py-2 px-4 text-lg rounded-md border border-primary focus:outline-none"
            // className="w-64  py-2 px-4 rounded-md border border-[#1F4772] focus:outline-none focus:bg-white"
          >
            <option value="">Select Subject</option>
            {subjectsData?.map((subject: Subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.subject_name}
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
            className="w-full lg:w-64 md:w-full xl:w-64  py-2 px-4 rounded-md border border-primary focus:outline-none focus:bg-white"
          />
        </div>
      
      </div>
      <div className=" relative overflow-x-auto p-2  ">
        <table className="w-full bg-white text-sm border text-left rtl:text-right text-gray-500 ">
          <thead className="text-sm text-gray-700 uppercase border-b bg-gray-50 rounded-t-md">
            <tr>
              <th scope="col" className="px-6 py-3">
                #
              </th>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Subject
              </th>
              <th scope="col" className="px-6 py-3">
                Cat
              </th>
              <th scope="col" className="px-6 py-3">
                Exam
              </th>
              <th scope="col" className="px-6 py-3">
                Total
              </th>
              <th scope="col" className="px-6 py-3">
                Grade
              </th>
              <th scope="col" className="px-6 py-3">
                Points
              </th>
              <th scope="col" className="px-6 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
             <tr>
             <td colSpan={8} className="text-center py-4">
                    <DataSpinner />
                  </td>
           </tr>
            ) : error ? (
              <tr>
                <td colSpan={8} className=" py-4">
                  <div className="flex items-center justify-center space-x-6 text-#1F4772">
                    <TbDatabaseOff size={25} />
                    <span>
                      {(error as any).data.error || "No data to show"}
                    </span>
                  </div>
                </td>
              </tr>
            ) : data && data.length > 0 ? (
              data.map((marksData: MarksInterface, index: number) => (
                <tr key={marksData.id} className="bg-white border-b">
                  <th className="px-3 py-2 text-sm lg:text-lg md:text-lg text-gray-900">{index + 1}</th>
                  <td className="px-3 py-2 text-sm lg:text-lg md:text-lg font-medium text-gray-900 whitespace-nowrap">
                    {marksData.student.first_name} {marksData.student.last_name}
                  </td>
                  <td className="px-3 py-2 text-sm lg:text-lg md:text-lg">
                    {marksData.student_subject?.subject.subject_name}
                  </td>
                  <td className="px-3 py-2 text-sm lg:text-lg md:text-lg">
                    {marksData.cat_mark}
                  </td>
                  <td className="px-3 py-2 text-sm lg:text-lg md:text-lg">
                    {marksData.exam_mark}
                  </td>
                  <td className="px-3 py-2 text-sm lg:text-lg md:text-lg">
                    {marksData.total_score}
                  </td>
                  <td className="px-3 py-2 text-sm lg:text-lg md:text-lg">
                    {marksData.grade}
                  </td>
                  <td className="px-3 py-2 text-sm lg:text-lg md:text-lg">
                    {marksData.points}
                  </td>
                  <td className="px-3 py-2 flex items-center space-x-5">
                     <EditMarks marksId={marksData.id} refetchMarks={refetchMarks} />
                     <DeleteMarkRecord marksId={marksData.id} refetchMarks={refetchMarks} />
                    </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-4">
                  No records found.
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
