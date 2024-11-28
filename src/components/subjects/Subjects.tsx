"use client";
import { DefaultLayout } from "@/src/components/layouts/DefaultLayout";
import { GoPlus } from "react-icons/go";
import { FaPlus } from "react-icons/fa6";
import { useGetStudentsQuery } from "@/redux/queries/students/studentsApi";
import { FiPrinter } from "react-icons/fi";
import { useDeleteSubjectsMutation, useGetSubjectsQuery } from "@/redux/queries/subjects/subjectsApi";
import { useState, useEffect } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import { AddSubject } from "./NewSubject";
import Spinner from "../layouts/spinner";
import PageLoadingSpinner from "../layouts/PageLoadingSpinner";
import { SerializedError } from "@reduxjs/toolkit";
import EditSubject from "./editSubject";
import DeleteSubject from "./deleteSubject";
import { PAGE_SIZE } from "@/src/constants/constants";
import ContentSpinner from "../perfomance/contentSpinner";
import { FiDelete } from "react-icons/fi";
import { IoIosClose } from "react-icons/io";
import { toast } from "react-toastify";
import DeleteConfirmationModal from "../students/DeleteModal";
interface Subject {
  id: number;
  subject_name: string;
  subject_type: string;
  category: {
    id:number;
    name:string;
  }
}
interface ApiError {
  status: number;
  data: {
    error: string;
  };
}
const Subjects = () => {
  const pageSize = PAGE_SIZE;
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const pageParam = searchParams.get("page");
  const [currentPage, setCurrentPage] = useState<number>(parseInt(pageParam || "1"));
  const [selectedSubjects, setSelectedSubjects] = useState<number[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const router = useRouter();
  const {
    isLoading: loadingSubjects,
    data: subjectsData,
    error,
    refetch,
  } = useGetSubjectsQuery(
    { page: currentPage || 1, page_size: pageSize },
    { refetchOnMountOrArgChange: true }
  );
  const [deleteSubjects, { isLoading: deleting }] = useDeleteSubjectsMutation();
  useEffect(() => {
    const page = parseInt(pageParam || "1");
    if (page !== currentPage) {
      setCurrentPage(page);
    }
  }, [pageParam, currentPage]);

  useEffect(() => {
    refetch();
  }, [currentPage, refetch]);

  const totalPages = Math.ceil((subjectsData?.count || 0) / pageSize);
  const refetchSubjects = () => {
    refetch();
  };
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.set("page", page.toString());
    router.push(`/subjects/?${currentParams.toString()}`);
  };

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  const handleSelect = (subjectId: number) => {
    setSelectedSubjects((prevSelected) =>
      prevSelected.includes(subjectId)
        ? prevSelected.filter((id) => id !== subjectId)
        : [...prevSelected, subjectId]
    );
  };
  const handleDelete = async () => {
    const data = selectedSubjects;
    console.log("data", data);

    try {
      const response = await deleteSubjects(data).unwrap();
      const successMessage =
        response.message || "Selected Subjects deleted successfully!";
      toast.success(successMessage);
    } catch (error: any) {
      console.log("error", error);
      if (error?.data?.error) {
        toast.error(error.data.error);
      }
    } finally {
      refetchSubjects();
      setSelectedSubjects([]);
      handleCloseDeleteModal();
    }
  };
  const cancelSelection = () => {
    setSelectedSubjects([]);
  };
  const handleOpenDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };
  

  if (error) {
    const apiError = error as ApiError | SerializedError;
    const errorMessage = "data" in apiError && apiError.data?.error  ? apiError.data.error : "Error loading Subjects. Please try again later.";
  }

  // console.log("subjectsData", subjectsData);
  return (
    <>
        <div className=" space-y-5  py-5  ">
      
        <div className=" p-3  flex justify-between">
          <h2 className="font-semibold text-black md:text-xl text-md lg:text-xl">Subjects</h2>
          <AddSubject refetchSubjects={refetchSubjects} />
           </div>
     
        <div className=" relative overflow-x-auto p-2 bg-white shadow-md border ">
        {selectedSubjects.length > 0 && (
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
            confirmationMessage="Are you sure you want to delete the selected subject(s)?"
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
                        selectedSubjects.length === subjectsData?.results.length
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedSubjects(
                            subjectsData?.results.map((subject: Subject) => subject.id)
                          );
                        } else {
                          setSelectedSubjects([]);
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
                  Type
                </th>
                <th scope="col" className="px-4 border-r py-3 text-[10px]">
                  Category
                </th>
                <th scope="col" className="px-4  py-3 text-[10px]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loadingSubjects ? (
                <tr>
                  <td colSpan={8} className="text-center py-4">
                    <ContentSpinner />
                  </td>
                </tr>
              ) : subjectsData?.results && subjectsData?.results.length > 0 ? (
                subjectsData?.results.map((subject: Subject, index: number) => (
                  <tr key={subject.id} className="bg-white border-b ">
                     <th className="px-3 py-2 text-gray-900 text-center border-r">
                          <input
                            id="checkbox-table-search-1"
                            type="checkbox"
                            checked={selectedSubjects.includes(subject.id)}
                            onChange={() => handleSelect(subject.id)}
                            className="w-4 h-4 bg-gray-100 border-gray-300 rounded 
                                   text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600
                                    dark:ring-offset-gray-800 focus:ring-2
                                     dark:bg-gray-700 dark:border-gray-600"
                          />
                        </th>
                    <td className="px-3 py-2 font-normal border-r text-sm lg:text-sm md:text-sm  whitespace-nowrap">
                      {subject.subject_name}
                    </td>
                    <td className="px-3 py-2  border-r text-sm lg:text-sm md:text-sm">{subject.subject_type}</td>
                    <td className="px-3 py-2  border-r text-sm lg:text-sm md:text-sm">{subject.category.name}</td>

                    <td className="px-3 py-2 flex items-center space-x-5">
                      <EditSubject subjectId={subject.id} refetchSubjects={refetchSubjects} />
                      {/* <DeleteSubject subjectId={subject.id} refetchSubjects={refetchSubjects} /> */}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-4">
                    No subjects found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex lg:justify-end md:justify-end justify-center mt-4 mb-4 px-6">
          <nav className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              className={`px-4 py-2  lg:text-sm md:text-sm text-xs border rounded ${
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
                  : "bg-primary text-white border-gray-300 "
              }`}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </nav>
        </div>
      </div>
    </>
  );
};
export default Subjects;
