"use client";
import {
  useDeleteTeachersMutation,
  useGetTeachersQuery,
} from "@/redux/queries/teachers/teachersApi";
import { PAGE_SIZE } from "@/src/constants/constants";
import { Teacher } from "@/src/definitions/teachers";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { FiDelete } from "react-icons/fi";
import { GoSearch } from "react-icons/go";
import { IoIosClose } from "react-icons/io";
import { IoEyeSharp } from "react-icons/io5";
import { toast } from "react-toastify";
import { useDebouncedCallback } from "use-debounce";
import PageLoadingSpinner from "../layouts/PageLoadingSpinner";
import ContentSpinner from "../perfomance/contentSpinner";
import DeleteConfirmationModal from "../students/DeleteModal";
import { CreateTeacher } from "./NewTeacher";
import AssignTeacher from "./assignSubjectsAndClasses";
import EditTeacher from "./editTeacher";
import { usePermissions } from "@/src/hooks/hasAdminPermission";
const Teachers = () => {
  const pageSize = PAGE_SIZE;
  const searchParams = useSearchParams();
  const { hasAdminPermissions, loading: loadingPermissions } = usePermissions();
  const initialFilters = useMemo(
    () => ({
      staff_no: searchParams.get("staff_no") || "",
    }),
    [searchParams]
  );

  const initialPage = parseInt(searchParams.get("page") || "1", 15);
  const [filters, setFilters] = useState(initialFilters);
  const [currentPage, setCurrentPage] = useState(initialPage);

  const [selectedTeachers, setSelectedTeachers] = useState<number[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const params = new URLSearchParams();
    params.set("page", currentPage.toString());
    if (filters.staff_no) {
      params.set("staff_no", filters.staff_no);
    }

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
    isLoading: loadingTeachers,
    data: teachersData,
    refetch,
    error,
  } = useGetTeachersQuery(queryParams, { refetchOnMountOrArgChange: true });
  const [deleteTeachers, { isLoading: deleting }] = useDeleteTeachersMutation();

  const handleSearch = useDebouncedCallback((value: string) => {
    console.log(`Debounced Search Term: ${value}`);
    setFilters((prev) => ({ ...prev, staff_no: value }));
  }, 100);
  const handleFilterChange = (
    e: ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    if (name === "staff_no") {
      handleSearch(value);
    } else {
      setFilters((prev) => ({ ...prev, [name]: value }));
    }
  };

  const totalPages = Math.ceil((teachersData?.count || 0) / pageSize);
  // console.log("teachers", teachersData)
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.set("page", page.toString());
    router.replace(`?${currentParams.toString()}`);
  };

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }
  const refetchTeachers = () => {
    refetch();
  };
  const handleSelect = (teacherId: number) => {
    setSelectedTeachers((prevSelected) =>
      prevSelected.includes(teacherId)
        ? prevSelected.filter((id) => id !== teacherId)
        : [...prevSelected, teacherId]
    );
  };
  const handleDelete = async () => {
    const data = selectedTeachers;
    // const data = { student_ids: selectedStudents };
    console.log("data", data);

    try {
      const response = await deleteTeachers(data).unwrap();
      const successMessage =
        response.message || "Selected Teachers deleted successfully!";
      toast.success(successMessage);
    } catch (error: any) {
      console.log("error", error);
      if (error?.data?.error) {
        toast.error(error.data.error);
      }
    } finally {
      refetchTeachers();
      setSelectedTeachers([]);
      handleCloseDeleteModal();
    }
  };
  const handleViewDetails = (id: number) => {
    router.push(`/teachers/${id}/`);
  };
  const cancelSelection = () => {
    setSelectedTeachers([]);
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
  console.log("teachersData", teachersData);
  return (
    <div className="space-y-5  py-3 px-3 bg-white shadow-md  ">
      <div className=" p-3  flex flex-col md:flex-row md:items-center lg:items-center md:gap-0 lg:gap-0 gap-4 lg:justify-between md:justify-between">
        <h2 className="font-semibold text-black text-xl">All Teachers</h2>

        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <div className="flex items-center self-end gap-4 ">
            {hasAdminPermissions() && (
              <>
                <div>
                  <CreateTeacher refetchTeachers={refetchTeachers} />
                </div>
              </>
            )}
          </div>

          <div className=" relative w-full md:w-auto flex items-center gap-2  text-gray-500 focus-within:text-blue-600 rounded-full  ring-[1.5px] ring-gray-300 px-2 focus-within:ring-1 focus-within:ring-blue-600">
            <GoSearch size={20} className="" />
            <input
              type="text"
              placeholder="staff no"
              name="staff_no"
              value={filters.staff_no || ""}
              onChange={handleFilterChange}
              className=" w-full md:w-auto  text-gray-900 lg:w-[200px] text-sm p-2 bg-transparent outline-none  "
            />
          </div>
        </div>
      </div>
      <div className=" relative overflow-x-auto p-2    ">
        {selectedTeachers.length > 0 && (
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
          confirmationMessage="Are you sure you want to delete the selected Teacher(s)?"
          deleteMessage="This action cannot be undone."
        />
        <table className="w-full bg-white text-sm border text-left rtl:text-right text-gray-500 ">
          <thead className="text-sm text-gray-700 uppercase border-b bg-gray-50 rounded-t-md">
            <tr>
              {hasAdminPermissions() && (
                <th scope="col" className="px-3 py-2 border-r  text-center">
                  <input
                    id="checkbox-all"
                    type="checkbox"
                    checked={
                      selectedTeachers.length === teachersData?.results.length
                    }
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedTeachers(
                          teachersData?.results.map(
                            (teacher: Teacher) => teacher.id
                          )
                        );
                      } else {
                        setSelectedTeachers([]);
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
              <th scope="col" className="px-3 py-2 border-r  text-[10px]">
                Name
              </th>
              <th scope="col" className="px-3 py-2 border-r text-[10px]">
                Staff No
              </th>
              <th scope="col" className="px-3 py-2 border-r text-[10px]">
                Phone
              </th>
              <th scope="col" className="px-3 py-2 border-r  text-[10px]">
                email
              </th>

              <th
                scope="col"
                className="px-3 py-2border-r  text-[10px] justify-center"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loadingTeachers ? (
              <tr>
                <td colSpan={8} className="text-center py-4">
                  <ContentSpinner />
                </td>
              </tr>
            ) : error ? (
              <tr className="">
                <td colSpan={8} className=" py-4">
                  <div className="flex items-center justify-center space-x-6 text-#1F4772">
                    {/* <TbDatabaseOff size={25} /> */}
                    <span>
                      {(error as any)?.data?.error || "Internal Server Error"}
                    </span>
                  </div>
                </td>
              </tr>
            ) :
              teachersData?.results?.map((teacher: Teacher, index: number) => (
                <tr key={teacher.id} className="bg-white border-b">
                  {hasAdminPermissions() && (
                    <th className="px-3 py-2 text-gray-900 text-center border-r">
                      <input
                        id="checkbox-table-search-1"
                        type="checkbox"
                        checked={selectedTeachers.includes(teacher.id)}
                        onChange={() => handleSelect(teacher.id)}
                        className="w-4 h-4 bg-gray-100 border-gray-300 rounded 
                                   text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600
                                    dark:ring-offset-gray-800 focus:ring-2
                                     dark:bg-gray-700 dark:border-gray-600"
                      />
                    </th>
                  )}

                  <td className="px-2 md:px-3 lg:px-3 py-2 text-sm lg:text-sm border-r md:text-sm  text-gray-900 whitespace-nowrap">
                    {teacher.user.first_name} {teacher.user.last_name}
                  </td>
                  <td className="px-2 md:px-3 lg:px-3 py-2 text-sm lg:text-sm border-r md:text-sm">
                    {teacher.staff_no}
                  </td>
                  <td className="px-3 py-2 text-sm lg:text-sm border-r md:text-sm">
                    {teacher.user.phone_number}
                  </td>
                  <td className="px-3 py-2 text-sm lg:text-sm border-r md:text-sm ">
                    {teacher.user.email}
                  </td>

                  <td className="px-3 py-2  flex items-center space-x-5">
                   
                    <div
                      className="p-2 rounded-full text-center cursor-pointer bg-purple-600"
                      onClick={() => handleViewDetails(teacher.id)}
                    >
                      <IoEyeSharp className=" text-white" size={15} />
                    </div>
                    {hasAdminPermissions() && (
                    <div>
                      <EditTeacher
                        teacherId={teacher.id}
                        refetchTeachers={refetchTeachers}
                      />
                    </div>
                    )}
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
      <div className="flex lg:justify-end md:justify-end justify-center mt-4 mb-4 px-6 py-4">
        <nav className="flex items-center space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            className={`px-3 py-2 lg:text-sm md:text-sm text-xs border rounded ${
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
              className={`px-3 py-2 lg:text-sm md:text-sm text-xs border rounded ${
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
            className={`px-3 py-2 border rounded lg:text-sm md:text-sm text-xs${
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
  );
};
export default Teachers;
