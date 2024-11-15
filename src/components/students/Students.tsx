"use client";
import { useGetClassesQuery } from "@/redux/queries/classes/classesApi";
import { ClassLevel } from "@/src/definitions/classlevels";
import { useGetStudentsQuery } from "@/redux/queries/students/studentsApi";
import { Student } from "@/src/definitions/students";
import { formattedDate } from "@/src/utils/dates";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { IoEyeSharp } from "react-icons/io5";
import { TbDatabaseOff } from "react-icons/tb";
import DeleteStudent from "./deleteStudent";
import EditStudent from "./editStudent";
import { CreateStudent } from "./NewStudent";
import PromoteStudents from "./promoteStudents/PromoteStudents";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
// import { DefaultLayout } from "../layouts/DefaultLayout";
import { BsChevronDown } from "react-icons/bs";
import { useDebouncedCallback } from "use-debounce";
import PageLoadingSpinner from "../layouts/PageLoadingSpinner";
import PromoteStudentsToAlumni from "./alumni/Alumni";
import { usePermissions } from "@/src/hooks/hasAdminPermission";
import AdminPermissions from "@/src/hooks/AdminProtected";
const Students = () => {
  const pageSize = 5;
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, loading, error:loadingUserError } = useAppSelector(
    (state: RootState) => state.auth
  );
  const { hasAdminPermissions } = usePermissions();
  const initialFilters = useMemo(
    () => ({
      class_level_id: searchParams.get("class_level_id") || "",
      admission_number: searchParams.get("admission_number") || "",
    }),
    [searchParams]
  );

  const initialPage = parseInt(searchParams.get("page") || "1", 10);
  const [filters, setFilters] = useState(initialFilters);
  const [currentPage, setCurrentPage] = useState(initialPage);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("page", currentPage.toString());
    if (filters.class_level_id)
      params.set("class_level_id", filters.class_level_id);
    if (filters.admission_number)
      params.set("admission_number", filters.admission_number);

    router.push(`?${params.toString()}`);
  }, [filters, currentPage]);

  const queryParams = useMemo(
    () => ({
      page: currentPage,
      page_size: pageSize,
      ...filters,
    }),
    [currentPage, filters]
  );

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

  const totalPages = Math.ceil((studentsData?.count || 0) / pageSize);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleSearch = useDebouncedCallback((value: string) => {
    console.log(`Debounced Search Term: ${value}`);
    setFilters((prev) => ({ ...prev, admission_number: value }));
  }, 200);
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
    setFilters({ class_level_id: "", admission_number: "" });
    setCurrentPage(1);
    router.push("?");
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

  if (loadingStudents) {
    return (
      <div className="mx-auto w-full md:max-w-screen-2xl lg:max-w-screen-2xl p-3 md:p-4 2xl:p-5">
        <PageLoadingSpinner />
      </div>
    );
  }
  console.log("students", studentsData)
  return (
    <>
      
      <div className=" space-y-5   ">
        <div className="flex items-center justify-between lg:px-3 md:px-3 lg:p-2 md:p-2 px-1 p-1  lg:mt-3  ">
          <h2 className="font-semibold text-black text-xl md:text-2xl lg:text-2xl">
            Students
          </h2>
        </div>
        {/* {hasAdminPermissions(user?.role) && (*/}
        {hasAdminPermissions() && (
        <div className="flex lg:justify-end md:justify-end justify-none flex-col md:flex-row lg:flex-row   justify-between space-y-2 md:space-x-3 space-x-0 lg:space-x-3 md:space-y-0 lg:space-y-0">
          <div className="grid grid-cols-2 gap-2">
            <CreateStudent refetchStudents={refetchStudents} />
            <PromoteStudents refetchStudents={refetchStudents} />
          </div>

          <div>
            <PromoteStudentsToAlumni refetchStudents={refetchStudents} />
          </div>
        </div>
        )}

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
                  // onChange={handleSelectChange}
                  onChange={handleFilterChange}
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
                  size={20}
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
                  // onChange={handleSelectChange}
                  onChange={handleFilterChange}
                  placeholder="Find by Admission Number"
                  className="w-full lg:w-64 md:w-full xl:w-64  py-2 px-4 rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
                />
              </div>
              <div className="flex flex-row justify-between lg:justify-none lg:mt-6 lg:space-x-5 md:space-x-3 md:mt-6 md:justify-between ">
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
                          {(error as any)?.data?.error || "Internal Server Error"}
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : studentsData?.results &&
                  studentsData?.results.length > 0 ? (
                  studentsData.results.map(
                    (student: Student, index: number) => (
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
                          {/* {hasAdminPermissions() && ( */}
                            <AdminPermissions
                            rolesAllowed={["Admin", "Principal"]}
                            >
                            <>
                          <EditStudent
                            studentId={student.id}
                            refetchStudents={refetchStudents}
                          />

                          <DeleteStudent
                            studentId={student.id}
                            refetchStudents={refetchStudents}
                          />
                            </>
                            </AdminPermissions>
                          {/* )} */}
                        </td>
                      </tr>
                    )
                  )
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-4">
                    <span>
                          {(error as any)?.data?.error || "Apply Filters to fetch students records"}
                        </span>
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
