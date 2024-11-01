"use client";
import { useGetClassesQuery } from "@/redux/queries/classes/classesApi";
import { useGetStudentsQuery } from "@/redux/queries/students/studentsApi";
import { ClassLevel } from "@/src/definitions/classlevels";
import { Student } from "@/src/definitions/students";
import { formattedDate } from "@/src/utils/dates";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { IoEyeSharp } from "react-icons/io5";
import { TbDatabaseOff } from "react-icons/tb";
import DeleteStudent from "./deleteStudent";
import EditStudent from "./editStudent";
import { CreateStudent } from "./NewStudent";
import PromoteStudents from "./promoteStudents/PromoteStudents";
// import { DefaultLayout } from "../layouts/DefaultLayout";
import PageLoadingSpinner from "../layouts/PageLoadingSpinner";
import DefaultLayout from "../adminDashboard/Layouts/DefaultLayout";
import { BsChevronDown } from "react-icons/bs";
const Students = () => {
  const pageSize = 5;
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const pageParam = searchParams.get("page");
  const [currentPage, setCurrentPage] = useState<number>(
    parseInt(pageParam || "1")
  );
  const router = useRouter();

  const classLevelId = searchParams.get("class_level_id");

  const admissionNumber = searchParams.get("admission_number");
  const [filters, setFilters] = useState({
    class_level_id: classLevelId || "",
    admission_number: admissionNumber || "",
  });
  const queryParams = useMemo(() => {
    const params: any = {
      page: currentPage,
      page_size: pageSize,
    };

    if (admissionNumber) {
      params.admission_number = admissionNumber;
    }

    if (classLevelId) {
      params.class_level_id = classLevelId;
    }

    return params;
  }, [classLevelId, admissionNumber]);

  const {
    isLoading: loadingStudents,
    data: studentsData,
    refetch,
    error,
  } = useGetStudentsQuery(queryParams, { refetchOnMountOrArgChange: true });
  const {
    isLoading: loadingClasses,
    data: classesData,
    refetch: refetchClasses,
  } = useGetClassesQuery({}, { refetchOnMountOrArgChange: true });

  useEffect(() => {
    const page = parseInt(pageParam || "1");
    if (page !== currentPage) {
      setCurrentPage(page);
    }
  }, [pageParam, currentPage]);

  useEffect(() => {
    refetch();
  }, [currentPage, refetch]);
  useEffect(() => {
    setFilters({
      class_level_id: classLevelId || "",
      admission_number: admissionNumber || "",
    });
  }, [classLevelId, admissionNumber]);
  useEffect(() => {
    refetch();
  }, [filters, refetch]);

  useEffect(() => {
    if (!loadingStudents && refetch) {
      if (admissionNumber) {
        refetch();
      } else if (classLevelId) {
        refetch();
      }
    }
  }, [classLevelId, admissionNumber, loadingClasses, refetch]);
  const totalPages = Math.ceil((studentsData?.count || 0) / pageSize);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.set("page", page.toString());
    router.push(`?${currentParams.toString()}`);
  };

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }
  const refetchStudents = () => {
    refetch();
  };
  const handleViewDetails = (id: number) => {
    router.push(`/students/${id}/`);
  };
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

    if (filters.class_level_id) {
      params.set("class_level_id", filters.class_level_id);
    }
    router.push(`?${params.toString()}`);
  };
  const handleResetFilters = () => {
    setFilters({
      class_level_id: "",
      admission_number: "",
    });
    router.push("?");
  };
  if (loadingStudents) {
    return (
      <div className="mx-auto w-full md:max-w-screen-2xl lg:max-w-screen-2xl p-3 md:p-4 2xl:p-5">

        <PageLoadingSpinner />
      </div>
      
    );
  }
  return (
 
    <>

    
      {/* <div className="lg:mt-[110px] sm:mt-[110px] mt-[50px] space-y-5 shadow-md border py-2 bg-white overflow-x-auto "> */}
      <div className=" space-y-5  py-2  ">
        <div className="flex flex-col space-y-3 lg:space-y-0 md:space-y-0 lg:flex-row lg:px-3 md:px-3 lg:p-3 md:p-3 px-1 p-1 lg:justify-between lg:items-center  lg:justify-none lg:mt-6  ">
          <h2 className="font-semibold text-black text-xl">
            Students
          </h2>
          <div className="flex  items-center justify-between space-x-3">
            <CreateStudent refetchStudents={refetchStudents} />
            <PromoteStudents refetchStudents={refetchStudents} />
          </div>
        </div>
        <div className="bg-white shadow-md rounded-sm  p-2">
        <div className="flex flex-col gap-3 lg:gap-0 md:gap-0 lg:flex-row md:flex-row  md:items-center p-2 md:justify-end lg:items-center lg:justify-end">
          <div className="flex flex-col gap-3 p-2 lg:p-0 lg:flex-row md:flex-row md:items-center md:space-x-2 lg:items-center lg:space-x-5">
            <div className="relative w-full lg:w-64 md:w-full xl:w-64 ">
              <label
                htmlFor="class"
                className="block text-gray-700 text-sm lg:text-lg md:text-lg  font-semibold mb-2"
              >
                Class
              </label>
              <select
                name="class_level_id"
                value={filters.class_level_id || ""}
                onChange={handleSelectChange}
                className="w-full lg:w-64 md:w-full xl:w-64 appearance-none py-2 px-4 text-lg rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
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
                      size={25}
                className="absolute top-[70%] right-4 transform -translate-y-1/2 text-[#1F4772] pointer-events-none"
              />
            </div>
            <div className="relative w-full lg:w-64 md:w-full xl:w-64 ">
              <label
                htmlFor="class"
                className="block text-gray-700 text-sm lg:text-lg md:text-lg font-semibold mb-2"
              >
                Admission No
              </label>
              <input
                type="text"
                name="admission_number"
                value={filters.admission_number || ""}
                onChange={handleSelectChange}
                placeholder="Find by Admission Number"
                className="w-full lg:w-64 md:w-full xl:w-64  py-2 px-4 rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
              />
            </div>
            <div className="flex flex-row justify-between lg:justify-none lg:mt-6 lg:space-x-5 md:space-x-3 md:mt-6 md:justify-between ">
              <button
                onClick={handleApplyFilters}
                className="lg:py-2 lg:px-4 md:py-2 md:px-2 p-2 md:text-xs text-[13px] lg:text-lg  rounded-md border bg-primary text-white"
              >
                Apply Filters
              </button>
              <button
                onClick={handleResetFilters}
                className="lg:py-2 lg:px-4 p-2 text-[13px] md:py-2 md:px-2 lg:text-lg md:text-xs  rounded-md border bg-white text-primary"
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
                <th scope="col" className="px-6 py-3 text-xs">
                  #
                </th>
                <th scope="col" className="px-4 py-3 text-xs">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-xs">
                  Adm No
                </th>
                <th scope="col" className="px-6 py-3 text-xs">
                  Class
                </th>
                <th scope="col" className="px-6 py-3 text-xs">
                  Gender
                </th>
                <th scope="col" className="px-6 py-3 text-xs">
                  KCPE MARKS
                </th>
                <th scope="col" className="px-6 py-3 text-xs">
                  Adm Date
                </th>
                <th scope="col" className="px-6 py-3 text-xs">
                  Adm Type
                </th>
                <th scope="col" className="px-6 py-3 text-xs">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loadingStudents ? (
                <tr>
                  <td colSpan={5} className="text-center py-4">
                    Loading...
                  </td>
                </tr>
              ) : error ? (
                <tr className="">
                  <td colSpan={4} className=" py-4">
                    <div className="flex items-center justify-center space-x-6 text-#1F4772">
                      <TbDatabaseOff size={25} />
                      <span>
                        {(error as any).data.error || "No data to show"}
                      </span>
                    </div>
                  </td>
                </tr>
              ) : studentsData?.results && studentsData?.results.length > 0 ? (
                studentsData.results.map((student: Student, index: number) => (
                  <tr key={student.id} className="bg-white border-b">
                    <th className="px-6 py-4 text-gray-900">{index + 1}</th>
                    <td className="px-3 py-2 font-medium text-sm lg:text-sm md:text-sm text-gray-900 whitespace-nowrap">
                      {student.first_name} {student.last_name}
                    </td>
                    <td className="px-3 py-2 text-sm lg:text-sm md:text-sm">
                      {student.admission_number}
                    </td>
                    <td className="px-3 py-2 text-sm lg:text-sm md:text-sm">
                      {student.class_level.form_level.name}
                      {student.class_level.stream
                        ? student.class_level.stream.name
                        : ""}
                    </td>
                    <td className="px-3 py-2 text-sm lg:text-sm md:text-sm">
                      {student.gender}
                    </td>
                    <td className="px-3 py-2 text-sm lg:text-sm md:text-sm">
                      {student.kcpe_marks}
                    </td>
                    <td className="px-3 py-2 text-sm lg:text-sm md:text-sm">
                      {formattedDate(new Date(student.created_at))}
                    </td>
                    <td className="px-3 py-2 text-sm lg:text-sm md:text-sm">
                      {student.admission_type}
                    </td>
                    <td className="px-3 py-2 flex items-center space-x-5">
                     <div className="p-1 rounded-sm bg-blue-100">
                     <IoEyeSharp
                        className=" text-blue-500 hover:text-primary cursor-pointer"
                        size={17}
                        onClick={() => handleViewDetails(student.id)}
                      />
                     </div>
                      <EditStudent
                        studentId={student.id}
                        refetchStudents={refetchStudents}
                      />

                      <DeleteStudent
                        studentId={student.id}
                        refetchStudents={refetchStudents}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-4">
                    No students found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex lg:justify-end md:justify-end justify-center mt-4 mb-4 px-6 py-4">
          <nav className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              className={`px-4 py-2 border lg:text-sm md:text-sm text-xs rounded ${
                currentPage === 1
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-white text-black border-gray-300 hover:bg-gray-100"
              }`}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            {pages.map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-4 py-2 lg:text-sm md:text-sm text-xs border rounded ${
                  page === currentPage
                    ? "bg-primary text-white"
                    : "bg-white text-black border-gray-300 hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              className={`px-4 py-2 lg:text-sm md:text-sm text-xs border rounded ${
                currentPage === totalPages
                  ? "bg-[gray-300] text-gray-500 cursor-not-allowed"
                  : "bg-primary text-white border-gray-300 hover:bg-gray-100"
              }`}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </nav>
        </div>
        </div>
        
      </div>
      </>
    
  );
};
export default Students;
