"use client";
import { useAppSelector } from "@/redux/hooks";
import { useGetAllActiveClassesQuery } from "@/redux/queries/classes/classesApi";
import {
  useDeleteStudentsMutation,
  useGetStudentsQuery,
} from "@/redux/queries/students/studentsApi";
import { RootState } from "@/redux/store";
import { PAGE_SIZE } from "@/src/constants/constants";
import { ClassLevel } from "@/src/definitions/classlevels";
import { Student } from "@/src/definitions/students";
import AdminPermissions from "@/src/hooks/AdminProtected";
import { usePermissions } from "@/src/hooks/hasAdminPermission";
import { formattedDate } from "@/src/utils/dates";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { BsChevronDown } from "react-icons/bs";
import { CiSearch } from "react-icons/ci";
import { IoEyeSharp } from "react-icons/io5";
import { TbDatabaseOff } from "react-icons/tb";
import { useDebouncedCallback } from "use-debounce";
import PromoteStudentsToAlumni from "./alumni/Alumni";
import EditStudent from "./editStudent";
import { CreateStudent } from "./NewStudent";
import PromoteStudentsToNextClass from "./promoteStudents/PromoteStudents";
import { SlSocialDropbox } from "react-icons/sl";
import { FiDelete } from "react-icons/fi";
import { IoIosClose } from "react-icons/io";
import { toast } from "react-toastify";
import PageLoadingSpinner from "../layouts/PageLoadingSpinner";
import ContentSpinner from "../perfomance/contentSpinner";
import DeleteConfirmationModal from "./DeleteModal";
import PromoteStudentsToNextTerm from "./promoteStudents/promoteStudentsToNextTerm";
import AdmitStudents from "./UploadStudents";

const Students = () => {
  const pageSize = PAGE_SIZE;
  const searchParams = useSearchParams();
  const router = useRouter();
  const {
    user,
    loading,
    error: loadingUserError,
  } = useAppSelector((state: RootState) => state.auth);
  const { hasAdminPermissions, loading: loadingPermissions } = usePermissions();
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
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
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
  } = useGetAllActiveClassesQuery({}, { refetchOnMountOrArgChange: true });

  const [deleteStudents, { isLoading: deleting }] = useDeleteStudentsMutation();
  const totalPages = Math.ceil((studentsData?.count || 0) / pageSize);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

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
    } else {
      setFilters((prev) => ({ ...prev, [name]: value }));
    }
  };
console.log("classesData",classesData)
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
  const handleSelect = (studentId: number) => {
    setSelectedStudents((prevSelected) =>
      prevSelected.includes(studentId)
        ? prevSelected.filter((id) => id !== studentId)
        : [...prevSelected, studentId]
    );
  };

  const handleDelete = async () => {
    const data = selectedStudents;
    // const data = { student_ids: selectedStudents };
    console.log("data", data);

    try {
      const response = await deleteStudents(data).unwrap();
      const successMessage =
        response.message || "Selected students deleted successfully!";
      toast.success(successMessage);
    } catch (error: any) {
      console.log("error", error);
      if (error?.data?.error) {
        toast.error(error.data.error);
      }
    } finally {
      refetchStudents();
      setSelectedStudents([]);
      handleCloseDeleteModal();
    }
  };
  const cancelSelection = () => {
    setSelectedStudents([]);
  };
  const handleOpenDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };
  if (loadingPermissions) {
    return <PageLoadingSpinner />;
  }
  console.log("students", studentsData);
  return (
    <>
      <div className=" space-y-5 bg-white shadow-md p-3  ">
        
        <div className=" p-3  flex flex-col md:flex-row md:items-center lg:items-center md:gap-0 lg:gap-0 gap-4 lg:justify-between md:justify-between">
          <h2 className="font-semibold text-black text-xl md:text-2xl lg:text-2xl">
            All Students
          </h2>

          <div className="flex flex-col md:flex-row lg:flex-row lg:items-center md:items-center gap-4 md:gap-4 lg:gap-4 w-full md:w-auto">
            <div className="flex items-center self-end gap-4 ">
              {hasAdminPermissions() && (
                <>
                  <div>
                    <PromoteStudentsToAlumni
                      refetchStudents={refetchStudents}
                    />
                  </div>
                  <div>
                    <PromoteStudentsToNextTerm
                      refetchStudents={refetchStudents}
                    />
                  </div>
                  <div>
                    <PromoteStudentsToNextClass
                      refetchStudents={refetchStudents}
                    />
                  </div>
                  <div>
                    <AdmitStudents refetchStudents={refetchStudents} />
                  </div>
                  <div>
                    <CreateStudent refetchStudents={refetchStudents} />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:gap-0 md:gap-0 lg:flex-row md:flex-row  md:items-center p-2 md:justify-end lg:items-center lg:justify-end">
          <div className="flex flex-col gap-3 px-2 lg:p-0 lg:flex-row md:flex-row md:items-center md:space-x-2 lg:items-center lg:space-x-5">
            <div className="relative w-full lg:w-56 md:w-56 xl:w-55 ">
              <select
                name="class_level_id"
                value={filters.class_level_id || ""}
                onChange={handleFilterChange}
                className="w-full lg:w-56 md:w-56 xl:w-56 
                  text-sm md:text-md lg:text-md appearance-none py-2 px-4 font-normal rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
              >
                <option value="">-- Select class ---</option>
                {classesData?.map((classLevel: ClassLevel) => (
                  <option key={classLevel.id} value={classLevel.id}>
                    {classLevel.name} {classLevel?.stream?.name} - (
                    {classLevel.calendar_year})
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

        <div className=" rounded-sm  p-2">
          {selectedStudents?.length > 0 && (
            <div className="flex items-center space-x-3 py-3">
              <button
                onClick={cancelSelection}
                className=" text-sm  items-center inline-flex space-x-3 px-3 py-1 shadow-sm border border-1 text-gray-700 rounded-full hover:bg-gray-700 hover:text-white cursor-pointer"
              >
                <IoIosClose size={20} className="" />
                <span>Cancel</span>
              </button>
              <button
                type="button"
                onClick={handleOpenDeleteModal}
                disabled={deleting}
                className=" text-sm  items-center inline-flex space-x-3 px-3 py-1 shadow-sm border border-1 text-red-700 rounded-full hover:bg-red-700 hover:text-white cursor-pointer"
              >
                <FiDelete size={20} className="" />
                <span className="">{deleting ? "Deleting..." : "Delete"}</span>
              </button>
            </div>
          )}
          <DeleteConfirmationModal
            isOpen={isDeleteModalOpen}
            onClose={handleCloseDeleteModal}
            onDelete={handleDelete}
            confirmationMessage="Are you sure you want to delete the selected student(s)?"
            deleteMessage="This action cannot be undone."
          />
          <div className=" relative overflow-x-auto p-2  ">
            <table className="w-full bg-white text-sm border text-left rtl:text-right text-gray-500 ">
              <thead className="text-sm text-gray-700 uppercase border-b bg-gray-50 rounded-t-md">
                <tr>
                {hasAdminPermissions() && (
                  <th scope="col" className="px-4 py-3 border-r  text-center">
                    <input
                      id="checkbox-all"
                      type="checkbox"
                      checked={
                        selectedStudents?.length === studentsData?.results.length
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedStudents(
                            studentsData?.results.map(
                              (student: Student) => student.id
                            )
                          );
                        } else {
                          setSelectedStudents([]);
                        }
                      }}
                      className="w-4 h-4
                                    bg-gray-100 border-gray-300
                                     rounded text-primary-600 
                                     focus:ring-primary-500 dark:focus:ring-primary-600
                                      dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700
                                       dark:border-gray-600"
                    />
                  </th>
                )}
                  <th
                    scope="col"
                    className="px-4 py-3 text-left border-r  text-[10px]"
                  >
                    Name
                  </th>
                  <th scope="col" className="px-4 border-r py-3 text-[10px]">
                    Adm No
                  </th>
                  <th scope="col" className="px-4 border-r py-3 text-[10px]">
                    Class
                  </th>
                  <th scope="col" className="px-4 border-r py-3 text-[10px]">
                    Gender
                  </th>
                  <th scope="col" className="px-4 border-r py-3 text-[10px]">
                    KCPE MARKS
                  </th>
                  <th scope="col" className="px-4 border-r py-3 text-[10px]">
                    Adm Date
                  </th>
                  <th scope="col" className="px-4 border-r py-3 text-[10px]">
                    Adm Type
                  </th>

                  <th scope="col" className="px-4 py-3 text-[10px]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {loadingStudents ? (
                  <tr>
                    <td colSpan={8} className="text-center py-4">
                      <ContentSpinner />
                    </td>
                  </tr>
                ) : error ? (
                  <tr className="">
                    <td colSpan={10} className=" py-4">
                      <div className="flex flex-col gap-4 items-center min-h-[40vh] justify-center space-x-6 text-#1F4772">
                       <SlSocialDropbox className="text-gray-500" size={50} />
                        <span>
                          {(error as any)?.data?.error ||
                            "Internal Server Error"}
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : studentsData?.results &&
                  studentsData?.results.length > 0 ? (
                  studentsData.results.map((student: Student) => (
                    <tr key={student.id} className="bg-white border-b">
                      {hasAdminPermissions() && (
                      <th className="px-3 py-2 text-gray-900 text-center border-r">
                        <input
                          id="checkbox-table-search-1"
                          type="checkbox"
                          checked={selectedStudents.includes(student.id)}
                          onChange={() => handleSelect(student.id)}
                          className="w-4 h-4 bg-gray-100 border-gray-300 rounded 
                                   text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600
                                    dark:ring-offset-gray-800 focus:ring-2
                                     dark:bg-gray-700 dark:border-gray-600"
                        />
                      </th>
                      )}
                      <td className="px-3 py-2 text-left font-normal text-sm border-r lg:text-sm md:text-sm text-gray-900 whitespace-nowrap">
                        {student.first_name} {student.last_name}
                      </td>
                      <td className="px-3 py-2 text-sm lg:text-sm border-r md:text-sm">
                        {student.admission_number}
                      </td>
                      <td className="px-3 py-2 text-sm lg:text-sm border-r md:text-sm">
                        {student?.class_level?.name}
                        {student?.class_level?.stream
                          ? student.class_level.stream.name
                          : ""}{" "}
                        - ({student.class_level.calendar_year})
                      </td>
                      <td className="px-3 py-2 text-sm lg:text-sm border-r md:text-sm">
                        {student.gender}
                      </td>
                      <td className="px-3 py-2 text-sm lg:text-sm border-r md:text-sm">
                        {student.kcpe_marks}
                      </td>
                      <td className="px-3 py-2 text-xs text-left lg:text-sm border-r md:text-sm">
                        {formattedDate(new Date(student.created_at))}
                      </td>
                      <td className="px-3 py-2 text-sm text-left lg:text-sm border-r md:text-sm">
                        {student.admission_type}
                      </td>
                      <td className="px-3 py-2 flex items-center space-x-5">
                        <div className="p-2 rounded-full text-center cursor-pointer bg-purple-600">
                          <IoEyeSharp
                            className=" text-white cursor-pointer"
                            size={17}
                            onClick={() => handleViewDetails(student.id)}
                          />
                        </div>
                        {/* {hasAdminPermissions() && ( */}
                        <AdminPermissions rolesAllowed={["Admin", "Principal"]}>
                          <>
                            <EditStudent
                              studentId={student.id}
                              refetchStudents={refetchStudents}
                            />

                            {/* <DeleteStudent
                                studentId={student.id}
                                refetchStudents={refetchStudents}
                              /> */}
                          </>
                        </AdminPermissions>
                        {/* )} */}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-4">
                      <span>
                        {(error as any)?.data?.error ||
                          "Apply Filters to fetch students records"}
                      </span>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {studentsData?.results?.length > 0 && (
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
          )}
        </div>
      </div>
    </>
  );
};
export default Students;
