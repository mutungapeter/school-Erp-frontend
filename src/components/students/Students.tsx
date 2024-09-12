"use client";
import { DefaultLayout } from "@/src/components/layouts/DefaultLayout";
import { GoPlus } from "react-icons/go";
import { FaPlus } from "react-icons/fa6";
import { useGetStudentsQuery } from "@/redux/queries/students/studentsApi";
import { useState, useEffect } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import { FiPrinter } from "react-icons/fi";
import { Student } from "@/src/definitions/students";
import { CreateStudent } from "./NewStudent";
import { formattedDate } from "@/src/utils/dates";


const Students = () => {
  const pageSize = 5;
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const pageParam = searchParams.get("page");
  const [currentPage, setCurrentPage] = useState<number>(
    parseInt(pageParam || "1")
  );
  const router = useRouter();
  const {
    isLoading: loadingStudents,
    data: studentsData,
    refetch,
  } = useGetStudentsQuery(
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

  const totalPages = Math.ceil((studentsData?.count || 0) / pageSize);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.set("page", page.toString());
    router.push(`/students/?${currentParams.toString()}`);
  };

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }
  const refetchStudents = () => {
    refetch();
  };

  console.log("studentsData", studentsData);
  return (
    <DefaultLayout>
      <div className="lg:mt-[110px] sm:mt-[110px] mt-[50px] flex flex-col gap-5 ">
        <div className="flex flex-col gap-3 lg:gap-0 sm:gap-0 lg:flex-row sm:flex-row  sm:items-center sm:justify-between lg:items-center lg:justify-between">
        <CreateStudent refetchStudents={refetchStudents} />

        <div className="flex flex-col gap-3 lg:flex-row sm:flex-row sm:items-center sm:space-x-5 lg:items-center lg:space-x-5">
          <div className="flex  items-center space-x-2 py-2 px-4 rounded-md border border-[#36A000] bg-[#36A000]">
            <h2 className="text-white">Print</h2>
            <FiPrinter color="white" />
            </div>
        <select className="w-64  py-2 px-4 rounded border border-[#1F4772] focus:outline-none focus:bg-white">
            <option value="">All students</option>
            <option value="10A">10A</option>
            <option value="11B">11B</option>
            <option value="9C">9C</option>
          </select>

          <input
            type="text"
            placeholder="Find by Adm No"
            className="w-35  py-2 px-4 rounded-md border border-[#1F4772] focus:outline-none focus:bg-white  "
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
                  Adm No
                </th>
                <th scope="col" className="px-6 py-3">
                  Class
                </th>
                <th scope="col" className="px-6 py-3">
                  Stream
                </th>
                <th scope="col" className="px-6 py-3">
                  Gender
                </th>
                <th scope="col" className="px-6 py-3">
                  DOB
                </th>
                <th scope="col" className="px-6 py-3">
                  Adm Date
                </th>
                <th scope="col" className="px-6 py-3">
                  Adm Type
                </th>
                <th scope="col" className="px-6 py-3">
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
              ) : studentsData?.results && studentsData?.results.length > 0 ? (
                studentsData.results.map((student: Student, index: number) => (
                  <tr key={student.id} className="bg-white border-b">
                    <th className="px-6 py-4 text-gray-900">{index + 1}</th>
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                      {student.first_name} {student.last_name}
                    </td>
                    <td className="px-6 py-4">{student.admission_number}</td>
                    <td className="px-6 py-4">{student.class_level.form_level.name}</td>
                    <td className="px-6 py-4">{student.class_level.stream ? student.class_level.stream.name : "-"}</td>
                    <td className="px-6 py-4">{student.gender}</td>
                    <td className="px-6 py-4">{formattedDate(new Date(student.birth_date))}</td>
                    <td className="px-6 py-4">{formattedDate(new Date(student.created_at))}</td>
                    <td className="px-6 py-4">{student.admission_type}</td>
                    <td className="px-6 py-4 flex items-center space-x-5">
                      <FaEdit color="#1F4772" />
                      <RiDeleteBinLine color="#1F4772" />
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
    </DefaultLayout>
  );
};
export default Students;
