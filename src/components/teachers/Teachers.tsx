"use client";
import { useGetTeachersQuery } from "@/redux/queries/teachers/teachersApi";
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
  const refetchTeachers = () => {
    refetch();
  };
  const handleViewDetails = (id: number) => {
    router.push(`/teachers/${id}/`);
  };
  if (loadingTeachers) {
    return (
      <div className="mx-auto w-full md:max-w-screen-2xl lg:max-w-screen-2xl p-3 md:p-4 2xl:p-5">

      <PageLoadingSpinner />
    </div>
    );
  }
  console.log("teachersData", teachersData);
  return (
    // <div className="lg:mt-[110px] sm:mt-[110px] mt-[50px] space-y-5 shadow-md border py-5 bg-white overflow-x-auto ">
    <div className="space-y-5 shadow-md border py-3 bg-white  ">
      <div className=" p-3 flex justify-between">
      <h2 className="font-semibold text-black text-xl">Teachers</h2>
        <CreateTeacher refetchTeachers={refetchTeachers} />
      </div>
      <div className=" relative overflow-x-auto p-2  ">
        <table className="w-full bg-white text-sm border text-left rtl:text-right text-gray-500 ">
          <thead className="text-sm text-gray-700 uppercase border-b bg-gray-50 rounded-t-md">
            <tr>
              <th scope="col" className="px-3 py-2">
                #
              </th>
              <th scope="col" className="px-3 py-2">
                Name
              </th>
              <th scope="col" className="px-3 py-2">
                Staff No
              </th>
              <th scope="col" className="px-3 py-2">
                Phone
              </th>
              <th scope="col" className="px-3 py-2">
                email
              </th>

              <th scope="col" className="px-3 justify-center py-2">
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
                  <th className="px-3 py-2 text-gray-900">{index + 1}</th>
                  <td className="px-3 py-2 text-sm lg:text-md md:text-md font-medium text-gray-900 whitespace-nowrap">
                    {teacher.user.first_name} {teacher.user.last_name}
                  </td>
                  <td className="px-3 py-2 text-sm lg:text-md md:text-md">
                    {teacher.staff_no}
                  </td>
                  <td className="px-3 py-2 text-sm lg:text-md md:text-md">
                    {teacher.user.phone_number}
                  </td>
                  <td className="px-3 py-2 text-sm lg:text-md md:text-md ">
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
                    <DeleteTeacher
                      teacherId={teacher.id}
                      refetchTeachers={refetchTeachers}
                    />
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
