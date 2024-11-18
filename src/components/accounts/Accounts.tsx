"use client";
// import { DefaultLayout } from "@/src/components/layouts/DefaultLayout";
import { GoPlus } from "react-icons/go";
import { FaPlus } from "react-icons/fa6";
import { useGetStudentsQuery } from "@/redux/queries/students/studentsApi";
import { useState, useEffect } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import { FiPrinter } from "react-icons/fi";
import { Student } from "@/src/definitions/students";
import { formattedDate } from "@/src/utils/dates";
import { useGetUsersQuery } from "@/redux/queries/users/usersApi";
import { User } from "@/src/definitions/users";
import { CreateAccount } from "./NewAccount";
import EditAccount from "./editAccount";
import DeleteAccount from "./deleteAccount";
import PageLoadingSpinner from "../layouts/PageLoadingSpinner";
import DefaultLayout from "../adminDashboard/Layouts/DefaultLayout";
import { PAGE_SIZE } from "@/src/constants/constants";


const Accounts = () => {
  const pageSize = PAGE_SIZE;
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const pageParam = searchParams.get("page");
  const [currentPage, setCurrentPage] = useState<number>(
    parseInt(pageParam || "1")
  );
  const router = useRouter();
  const {
    isLoading: loadingUsers,
    data: usersData,
    refetch,
  } = useGetUsersQuery(
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

  const totalPages = Math.ceil((usersData?.count || 0) / pageSize);

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
  const refetchUsers = () => {
    refetch();
  };
  
  if (loadingUsers) {
    return (
      <div className="mx-auto w-full md:max-w-screen-2xl lg:max-w-screen-2xl p-3 md:p-4 2xl:p-5">
        <PageLoadingSpinner />
      </div>
    );
  }
  console.log("usersData", usersData);
  return (
    <>
       <div className="space-y-5 shadow-md border py-2  bg-white ">
        
        <div className="p-3   flex justify-between">
          <h2 className="font-semibold text-black lg:text-xl md:text-lg text-sm ">
            Accounts
          </h2>
          <CreateAccount refetchUsers={refetchUsers} />

        </div>
        <div className=" relative overflow-x-auto p-2  ">
          <table className="w-full bg-white text-sm border text-left rtl:text-right text-gray-500 ">
            <thead className="text-sm text-gray-700 uppercase border-b bg-gray-50 rounded-t-md">
              <tr>
                <th scope="col" className="lg:px-6 lg:py-3 md:px-6 md:py-3 px-3 py-2 text-[10px] font-semibold">
                  #
                </th>
                <th scope="col" className="lg:px-6 lg:py-3 md:px-6 md:py-3 px-3 py-2 text-[10px] font-semibold">
                  Name
                </th>
                <th scope="col" className="lg:px-6 lg:py-3 md:px-6 md:py-3 px-3 py-2 text-[10px] font-semibold">
                Email
                </th>
                <th scope="col" className="lg:px-6 lg:py-3 md:px-6 md:py-3 px-3 py-2 text-[10px] font-semibold">
                 Phone
                </th>
                <th scope="col" className="lg:px-6 lg:py-3 md:px-6 md:py-3 px-3 py-2 text-[10px] font-semibold">
                  username
                </th>
                <th scope="col" className="lg:px-6 lg:py-3 md:px-6 md:py-3 px-3 py-2 text-[10px] font-semibold">
                  Role
                </th>
                <th scope="col" className="lg:px-6 lg:py-3 md:px-6 md:py-3 px-3 py-2 text-[10px] font-semibold">
                  Created At
                </th>
                {/* <th scope="col" className="px-6 py-4 text-xs">
                  Last Login 
                </th> */}
                
                <th scope="col" className="lg:px-6 lg:py-3 md:px-6 md:py-3 px-3 py-2 text-[10px] font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loadingUsers ? (
                <tr>
                  <td colSpan={5} className="text-center py-4">
                    Loading...
                  </td>
                </tr>
              ) : usersData?.results && usersData?.results.length > 0 ? (
                usersData.results.map((user: User, index: number) => (
                  <tr key={user.id} className="bg-white border-b text-sm">
                    <th className="px-3 py-2 text-sm lg:text-sm md:text-sm text-gray-900">{index + 1}</th>
                    <td className="px-3 py-2 text-sm lg:text-sm md:text-sm  font-medium text-gray-900 whitespace-nowrap">
                      {user.first_name} {user.last_name}
                    </td>
                    <td className="px-3 py-2 text-xs lg:text-sm md:text-sm ">{user.email}</td>
                    <td className="px-3 py-2 text-xs lg:text-sm md:text-sm ">{user.phone_number}</td>
                    <td className="px-3 py-2 text-xs lg:text-sm md:text-sm ">{user.username}</td>
                    <td className="px-3 py-2 text-xs lg:text-sm md:text-sm ">{user.role}</td>

                  <td className="px-3 py-2 text-xs lg:text-sm md:text-sm">{formattedDate(new Date(user.date_joined))}</td>
                  {/* <td className="px-3 py-2 text-xs lg:text-sm md:text-sm">{formattedDate(new Date(user.last_login))}</td> */}
                    <td className="px-3 py-2  flex items-center space-x-5">
                     <EditAccount accountId={user.id} refetchUsers={refetchUsers} />
                     <DeleteAccount accountId={user.id}  refetchUsers={refetchUsers} />
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
              className={`lg:px-4 lg:py-2 md:px-4 md:py-2 py-1 px-2 border lg:text-sm md:text-sm text-xs rounded ${
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
                className={`lg:px-4 lg:py-2 md:px-4 md:py-2 py-1 px-2 lg:text-sm md:text-sm text-xs border rounded ${
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
              className={`lg:px-4 lg:py-2 md:px-4 md:py-2 py-1 px-2 lg:text-sm md:text-sm text-xs border rounded ${
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
    </>
  );
};
export default Accounts;
