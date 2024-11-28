"use client";
import { useDeleteTeachersMutation, useGetTeachersQuery } from "@/redux/queries/teachers/teachersApi";
import { Teacher } from "@/src/definitions/teachers";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import { CreateTeacher } from "./NewTeacher";
import AssignTeacher from "./assignSubjectsAndClasses";
import EditTeacherSubjects from "./eidtTeacherSubjects";
import EditTeacher from "./editTeacher";
import DeleteTeacher from "./deleteTeacher";
import { IoEyeOutline } from "react-icons/io5";
import { IoEyeSharp } from "react-icons/io5";
import { DefaultLayout } from "../layouts/DefaultLayout";
import PageLoadingSpinner from "../layouts/PageLoadingSpinner";
import { PAGE_SIZE } from "@/src/constants/constants";
import ContentSpinner from "../perfomance/contentSpinner";
import { FiDelete } from "react-icons/fi";
import { IoIosClose } from "react-icons/io";
import { toast } from "react-toastify";
import DeleteConfirmationModal from "../students/DeleteModal";
const Teachers = () => {
  const pageSize = PAGE_SIZE;
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const pageParam = searchParams.get("page");
  const [currentPage, setCurrentPage] = useState<number>(
    parseInt(pageParam || "1")
  );
  const [selectedTeachers, setSelectedTeachers] = useState<number[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const router = useRouter();
  const {
    isLoading: loadingTeachers,
    data: teachersData,
    refetch,
  } = useGetTeachersQuery(
    { page: currentPage || 1, page_size: pageSize },
    { refetchOnMountOrArgChange: true }
  );
  const [deleteTeachers, { isLoading: deleting }] = useDeleteTeachersMutation();

  useEffect(() => {
    const page = parseInt(pageParam || "1");
    if (page !== currentPage) {
      setCurrentPage(page);
    }
  }, [pageParam, currentPage]);

  useEffect(() => {
    refetch();
  }, [currentPage, refetch]);

  const totalPages = Math.ceil((teachersData?.count || 0) / pageSize);
// console.log("teachers", teachersData)
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
  
  console.log("teachersData", teachersData);
  return (
    // <div className="lg:mt-[110px] sm:mt-[110px] mt-[50px] space-y-5 shadow-md border py-5 bg-white overflow-x-auto ">
    <div className="space-y-5  py-3  ">
      <div className=" p-3 flex justify-between">
      <h2 className="font-semibold text-black text-xl">Teachers</h2>
        <CreateTeacher refetchTeachers={refetchTeachers} />
      </div>
      <div className=" relative overflow-x-auto p-2 bg-white shadow-md border  ">
      {selectedTeachers.length > 0 && (
            <div className="flex items-center space-x-3 py-3">
              <button
                onClick={cancelSelection}
                className=" text-sm flex items-center inline-flex space-x-3 px-3 py-1 shadow-sm border border-1 text-gray-700 rounded-full hover:bg-gray-700 hover:text-white cursor-pointer"
              >
                <IoIosClose size={20} className="" />
                <span>Cancel</span>
              </button>
              <button
                type="button"
                onClick={handleOpenDeleteModal}
                disabled={deleting}
                className=" text-sm flex items-center inline-flex space-x-3 px-3 py-1 shadow-sm border border-1 text-red-700 rounded-full hover:bg-red-700 hover:text-white cursor-pointer"
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
            <th scope="col" className="px-4 py-3 border-r  text-center">
                    <input
                      id="checkbox-all"
                      type="checkbox"
                      checked={
                        selectedTeachers.length === teachersData?.results.length
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedTeachers(
                            teachersData?.results.map((teacher: Teacher) => teacher.id)
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
              <th scope="col" className="px-4 border-r py-3 text-[10px]">
                Name
              </th>
              <th scope="col" className="px-4 border-r py-3 text-[10px]">
                Staff No
              </th>
              <th scope="col" className="px-4 border-r py-3 text-[10px]">
                Phone
              </th>
              <th scope="col" className="px-4 border-r py-3 text-[10px]">
                email
              </th>

              <th scope="col" className="px-4 border-r py-3 text-[10px] justify-center">
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
            ) : teachersData?.results && teachersData?.results.length > 0 ? (
              teachersData?.results.map((teacher: Teacher, index: number) => (
                <tr key={teacher.id} className="bg-white border-b">
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
                    <AssignTeacher teacher_id={teacher.id} />
                    <div className="p-1 rounded-sm bg-blue-100">
                    <IoEyeSharp
                      className=" text-blue-500 hover:text-primary cursor-pointer"
                      size={17}
                      onClick={() => handleViewDetails(teacher.id)} 
                    />
                    </div>

                    <EditTeacher
                      teacherId={teacher.id}
                      refetchTeachers={refetchTeachers}
                    />
                    {/* <DeleteTeacher
                      teacherId={teacher.id}
                      refetchTeachers={refetchTeachers}
                    /> */}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-4">
                  No records found.
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
            className={`px-4 py-2 lg:text-sm md:text-sm text-xs border rounded ${
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
            className={`px-4 py-2 border rounded ${
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
