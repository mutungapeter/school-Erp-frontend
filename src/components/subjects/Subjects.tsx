"use client";
import { DefaultLayout } from "@/src/components/layouts/DefaultLayout";
import { GoPlus } from "react-icons/go";
import { FaPlus } from "react-icons/fa6";
import { useGetStudentsQuery } from "@/redux/queries/students/studentsApi";
import { FiPrinter } from "react-icons/fi";
import { useGetSubjectsQuery } from "@/redux/queries/subjects/subjectsApi";
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
  const pageSize = 5;
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const pageParam = searchParams.get("page");
  const [currentPage, setCurrentPage] = useState<number>(
    parseInt(pageParam || "1")
  );
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
  if (loadingSubjects) {
    return (
      <div className="mx-auto w-full md:max-w-screen-2xl lg:max-w-screen-2xl p-3 md:p-4 2xl:p-5">

      <PageLoadingSpinner />
    </div>
    );
  }

  if (error) {
    const apiError = error as ApiError | SerializedError;
    const errorMessage = "data" in apiError && apiError.data?.error  ? apiError.data.error : "Error loading Subjects. Please try again later.";
  }

  // console.log("subjectsData", subjectsData);
  return (
    <>
        <div className=" space-y-5 shadow-md border py-5 bg-white ">
      
        <div className=" p-3  flex justify-between">
          <h2 className="font-semibold text-black md:text-xl text-md lg:text-xl">Subjects</h2>
          <AddSubject refetchSubjects={refetchSubjects} />
           </div>
        {loadingSubjects && <Spinner />}
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
                  Type
                </th>
                <th scope="col" className="px-6 py-4">
                  Category
                </th>
                <th scope="col" className="px-6 py-4">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loadingSubjects ? (
                <tr>
                  <td colSpan={5} className="text-center py-4">
                    Loading...
                  </td>
                </tr>
              ) : subjectsData?.results && subjectsData?.results.length > 0 ? (
                subjectsData?.results.map((subject: Subject, index: number) => (
                  <tr key={subject.id} className="bg-white border-b ">
                    <th className="px-3 py-2 text-gray-900">{index + 1}</th>
                    <td className="px-3 py-2 font-medium text-sm lg:text-lg md:text-lg text-gray-900 whitespace-nowrap">
                      {subject.subject_name}
                    </td>
                    <td className="px-3 py-2 text-sm lg:text-lg md:text-lg">{subject.subject_type}</td>
                    <td className="px-3 py-2 text-sm lg:text-lg md:text-lg">{subject.category.name}</td>

                    <td className="px-3 py-2 flex items-center space-x-5">
                      <EditSubject subjectId={subject.id} refetchSubjects={refetchSubjects} />
                      <DeleteSubject subjectId={subject.id} refetchSubjects={refetchSubjects} />
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
                    ? "bg-[#1F4772] text-white"
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
                  : "bg-[#1F4772] text-white border-gray-300 "
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
