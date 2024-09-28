"use client";
import { useGetClassesQuery } from "@/redux/queries/classes/classesApi";

import { useGetStudentsBySubjectAndClassQuery } from "@/redux/queries/students/studentsApi";
import { useGetSubjectsQuery } from "@/redux/queries/subjects/subjectsApi";

import { ClassLevel } from "@/src/definitions/classlevels";
import { Student, StudentSubject } from "@/src/definitions/students";
import { Subject } from "@/src/definitions/subjects";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { LuBookOpenCheck } from "react-icons/lu";
import { TbDatabaseOff } from "react-icons/tb";
import { IoMdArrowDropdown } from "react-icons/io";
import { AddMark } from "./recordMarks";
import Link from "next/link"
const Marks = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const subjectId = searchParams.get("subject_id");
  const classLevelId = searchParams.get("class_level_id");

  const admissionNumber = searchParams.get("admission_number");
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
  } = useGetStudentsBySubjectAndClassQuery(
    queryParams,
    { skip: false }
  );
  console.log("error", error);
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
      } else if (subjectId && classLevelId ) {
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
    const params = new URLSearchParams(searchParams.toString());
    params.set(name, value);

    if (name === "class_level_id") {
      const selectedClass = classesData.find(
        (classLevel: ClassLevel) => classLevel.id === Number(value)
      );
     
    }
    if (value) {
        params.set(name, value);
      } else {
        params.delete(name); 
      }
    
    router.push(`marks/?${params.toString()}`);
  };


  const handleViewChange = (newView: "individual" | "group") => {
    const params = new URLSearchParams(searchParams.toString());

    if (newView === "individual") {
      params.delete("class_level_id");
      params.delete("subject_id");

    } else if (newView === "group") {
      params.delete("admission_number");
    }

    setView(newView);
    router.push(`?${params.toString()}`);
  };
console.log('data', data)
console.log("studentsData", studentsData)
  return (
    <>
      <div className="mt-[60px] sm:mt-[110px] lg:mt-[110px] flex flex-col gap-5">
        <div className="flex flex-col lg:gap-0 gap-3 lg:flex lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4  p-1 border border-[#1F4772] rounded-md  lg:w-1/3 w-full">
            <div className="bg-[#C8D9EB] p-3 rounded-full flex items-center justify-center">
              <LuBookOpenCheck color="#1F4772" size={30} />
            </div>
            <div className=" flex flex-col gap-2 ">
              <h2 className="text-[#1F4772] font-bold text-lg underline underline-offset-4 decoration-[#1F4772] decoration-3">
                Recording Marks for a student
              </h2>

              <p className="text-[13px]">
                To record marks for  a student, you can choose to record for and individual  or for given class/group
                . Select the filters as needed.
              </p>
            </div>
          </div>
          <div className="flex justify-between lg:justify-none lg:space-x-5 ">
            <button
              onClick={() => handleViewChange("group")}
              className={`lg:py-2 lg:px-4 p-2 rounded-md border text-[13px] lg:text-lg ${
                view === "group"
                  ? "bg-[#1F4772] text-white"
                  : "bg-white text-[#1F4772]"
              }`}
            >
              Record For a  Group
            </button>
            <button
              onClick={() => handleViewChange("individual")}
              className={`lg:py-2 lg:px-4 p-2 text-[13px] lg:text-lg  rounded-md border ${
                view === "individual"
                  ? "bg-[#1F4772] text-white"
                  : "bg-white text-[#1F4772]"
              }`}
            >
              Record For Individual
            </button>
          </div>
          <div className="flex w-full lg:w-auto">
            <Link href="/marks/list" className="cursor-pointer">
    <div className="inline-flex items-center cursor-pointer text-center lg:py-2 lg:px-4 p-2 text-[13px] lg:text-lg border border-primary bg-primary rounded-md w-max">
      <h2 className="text-white text-center">View Marks</h2>
    </div>
    </Link>
  </div>
        </div>
        
        {view === "individual" ? (
          <div className="flex flex-col gap-3">
            <div className="flex w-full items-center justify-end">
              <input
                type="text"
                name="admission_number"
                value={admissionNumber || ""}
                onChange={handleSelectChange}
                placeholder="Find by Admission Number"
                className="w-full lg:w-64 md:w-full xl:w-64  py-2 px-4 rounded-md border border-[#1F4772] focus:outline-none focus:bg-white"
              />
            </div>
            <div className="relative overflow-x-auto rounded-md">
              <table className="w-full bg-white text-sm border text-left rounded-md rtl:text-right text-gray-500">
                <thead className="text-xs text-gray-700 uppercase border-b bg-gray-50 rounded-t-md">
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
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="text-center py-4">
                        Loading...
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
                    data.map((studentSubject: StudentSubject, index: number) => (
                      <tr key={index} className="bg-white border-b">
                        <th className="px-6 py-4 text-gray-900">{index + 1}</th>
                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                          {studentSubject.student.first_name} {studentSubject.student.last_name}
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                          {studentSubject?.subject?.subject_name}
                        </td>
                        <td className="px-6 py-4 flex items-center space-x-5">
                          
                        <AddMark studentSubject={studentSubject} />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="text-center py-4">
                        No students found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-3 lg:gap-0 lg:flex-row lg:items-center lg:justify-end lg:space-x-5  ">
            <div className="relative w-full lg:w-64 md:w-full xl:w-64 ">
                  <label
                    htmlFor="subject"
                    className="block text-gray-700 text-sm  font-semibold mb-2"
                  >
                   Subject
                  </label>
              <select
                name="subject_id"
                value={subjectId || ""}
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
                name="class_level_id"
                value={classLevelId || ""}
                onChange={handleSelectChange}
                className="w-full lg:w-64 md:w-full xl:w-64 appearance-none py-2 px-4 text-lg rounded-md border border-primary focus:outline-none"
                // className="w-64  py-2 px-4 rounded-md border border-[#1F4772] focus:outline-none focus:bg-white"
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
            </div>
            <div className=" relative overflow-x-auto rounded-md">
              <table className="w-full bg-white text-sm border text-left rounded-md rtl:text-right text-gray-500 ">
                <thead className="text-xs text-gray-700 uppercase border-b bg-gray-50 rounded-t-md">
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
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="text-center py-4">
                        Loading...
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
                    data?.map(
                      (studentSubject: StudentSubject, index: number) => (
                        <tr key={index} className="bg-white border-b">
                          <th className="px-6 py-4 text-gray-900">
                            {index + 1}
                          </th>
                          <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                            {studentSubject.student.first_name} {studentSubject.student.last_name}
                          </td>
                          <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                          {studentSubject?.subject?.subject_name}
                          </td>

                          <td className="px-6 py-4 flex items-center space-x-5">
                            
                          <AddMark studentSubject={studentSubject} />
                          </td>
                        </tr>
                      )
                    )
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
          </>
        )}
      </div>
    </>
  );
};
export default Marks;
