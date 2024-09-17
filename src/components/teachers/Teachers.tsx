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
import { useGetTeachersQuery } from "@/redux/queries/teachers/teachersApi";
import { Teacher } from "@/src/definitions/teachers";
import { CreateTeacher } from "./NewTeacher";
import AssignTeacher from "./assignSubjectsAndClasses";

const Teachers = () => {
  const pageSize = 5;
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const pageParam = searchParams.get("page");
  const [currentPage, setCurrentPage] = useState<number>(
    parseInt(pageParam || "1")
  );
  const router = useRouter();
  const {
    isLoading: loadingTeachers,
    data: teachersData,
    refetch,
  } = useGetTeachersQuery(
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

  const totalPages = Math.ceil((teachersData?.count || 0) / pageSize);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.set("page", page.toString());
    router.push(`/teachers/?${currentParams.toString()}`);
  };

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }
const refetchTeachers=()=>{
    refetch();
}
const handleViewDetails = (id: number) => {
  router.push(`/teachers/${id}/`);
};
  console.log("teachersData", teachersData);
  return (
  
      <div className="mt-[110px] flex flex-col gap-5 ">
        <div className="flex items-center justify-between">
          <CreateTeacher refetchTeachers={refetchTeachers} />
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
                  Staff No
                </th>
                <th scope="col" className="px-6 py-3">
                  Phone
                </th>
                <th scope="col" className="px-6 py-3">
                  email
                </th>
               
               
                <th scope="col" className="px-6 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loadingTeachers ? (
                <tr>
                  <td colSpan={5} className="text-center py-4">
                    Loading...
                  </td>
                </tr>
              ) : teachersData?.results && teachersData?.results.length > 0 ? (
                teachersData?.results.map((teacher: Teacher, index: number) => (
                  <tr key={teacher.id} className="bg-white border-b">
                    <th className="px-6 py-4 text-gray-900">{index + 1}</th>
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                      {teacher.user.first_name} {teacher.user.last_name}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                      {teacher.staff_no}
                    </td>
                    <td className="px-6 py-4">{teacher.user.phone_number}</td>
                    <td className="px-6 py-4">{teacher.user.email}</td>
                   
                    <td className="px-6 py-4 flex items-center space-x-5">
           
                      <AssignTeacher teacher_id={teacher.id} />
                      <div className="py-1 px-2 rounded-md bg-[#1F4772] text-white text-sm cursor-pointer  text-center"
                    onClick={()=>handleViewDetails(teacher.id)}
                    >
                        View subjects
                      </div>
                    <div className="p-1 rounded-md bg-green-100">
                      
                     <FaEdit color="green" size={17} />
                        </div>
                        <div className="p-1 rounded-md bg-red-100">
                            <RiDeleteBinLine color="red" size={17} />
                        </div>
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
        <div className="flex justify-center mt-4">
          <nav className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              className={`px-4 py-2 border rounded ${
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
                className={`px-4 py-2 border rounded ${
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
              className={`px-4 py-2 border rounded ${
                currentPage === totalPages
                  ? "bg-[gray-300] text-gray-500 cursor-not-allowed"
                  : "bg-[#1F4772] text-white border-gray-300 hover:bg-gray-100"
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
