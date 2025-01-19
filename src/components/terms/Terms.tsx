"use client";
import { useGetAllClassesQuery, useGetClassesQuery } from "@/redux/queries/classes/classesApi";
import { ClassLevel } from "@/src/definitions/classlevels";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { usePermissions } from "@/src/hooks/hasAdminPermission";

import { IoRefresh } from "react-icons/io5";
import PageLoadingSpinner from "../layouts/PageLoadingSpinner";
import {
  useDeleteTermsMutation,
  useGetTermsQuery,
} from "@/redux/queries/terms/termsApi";
import { BsChevronDown } from "react-icons/bs";
import { PiGearLight } from "react-icons/pi";
import DeleteTerm from "./DeleteTerm";
import ClickOutside from "../ClickOutside";
import EditTerm from "./EditTerm";
import { getStatusColor } from "@/src/utils/getStatus";
import CustomPopover from "../Popover";
import EditTermStatus from "./updateTermStatus";
import CreateTerm from "./NewTerm";
import { PAGE_SIZE } from "@/src/constants/constants";
import { FiDelete } from "react-icons/fi";
import { IoIosClose } from "react-icons/io";
import { toast } from "react-toastify";
import DeleteConfirmationModal from "../students/DeleteModal";
import ContentSpinner from "../perfomance/contentSpinner";
import { TbDatabaseOff } from "react-icons/tb";
const Terms = () => {
  const pageSize = PAGE_SIZE;
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const { hasAdminPermissions ,loading:loadingPermissions} = usePermissions();
  const pathname = usePathname();
   const initialFilters = useMemo(
      () => ({
        class_level: searchParams.get("class_level") || "",
      }),
      [searchParams]
    );
    const initialPage = parseInt(searchParams.get("page") || "1", 10);
  const [filters, setFilters] = useState(initialFilters);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [selectedTerms, setSelectedTerms] = useState<number[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("page", currentPage.toString());
    if (filters.class_level)
      params.set("class_level", filters.class_level);
    
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
    isLoading: loadingTerms,
    data: termsData,
    refetch,
    error
  } = useGetTermsQuery(
    queryParams,
    { refetchOnMountOrArgChange: true }
  );
  const {
    isLoading: loadingClasses,
    data: classesData,
    refetch: refetchClasses,
  } = useGetAllClassesQuery({}, { refetchOnMountOrArgChange: true });
  const [deleteTerms, { isLoading: deleting }] = useDeleteTermsMutation();

  const handleFilterChange = (
     e: ChangeEvent<HTMLSelectElement | HTMLInputElement>
   ) => {
     const { name, value } = e.target;
    
       setFilters((prev) => ({ ...prev, [name]: value }));
     
   };
 

  const totalPages = Math.ceil((termsData?.count || 0) / pageSize);

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
  const refetchTerms = () => {
    refetch();
  };
  const handleSelect = (termId: number) => {
    setSelectedTerms((prevSelected) =>
      prevSelected.includes(termId)
        ? prevSelected.filter((id) => id !== termId)
        : [...prevSelected, termId]
    );
  };
  const handleDelete = async () => {
    const data = selectedTerms;
    console.log("data", data);

    try {
      const response = await deleteTerms(data).unwrap();
      const successMessage =
        response.message || "Selected Terms deleted successfully!";
      toast.success(successMessage);
    } catch (error: any) {
      console.log("error", error);
      if (error?.data?.error) {
        toast.error(error.data.error);
      }
    } finally {
      refetchTerms();
      setSelectedTerms([]);
      handleCloseDeleteModal();
    }
  };
  const cancelSelection = () => {
    setSelectedTerms([]);
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

  console.log("termsData", termsData?.results);
  return (
    <div className="space-y-5 bg-white shadow-md  px-3 py-4  ">
      <div className="p-3 flex flex-col gap-4 md:gap-0 lg:gap-0 lg:justify-between md:justify-between md:flex-row lg:flex-row  ">
        <h2 className="font-semibold text-black md:text-xl text-md lg:text-xl">
          All Terms
        </h2>

        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
        <div className="relative w-full lg:w-56 md:w-56 xl:w-55 ">
                <select
                  name="class_level"
                  value={filters.class_level || ""}
                  onChange={handleFilterChange}
                  className="w-full lg:w-56 md:w-56 xl:w-56 
                  text-sm md:text-md lg:text-md appearance-none p-2 font-normal rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
                >
                  <option value="">-- Select class ---</option>
                  {classesData?.map((classLevel: ClassLevel) => (
                    <option key={classLevel.id} value={classLevel.id}>
                      {classLevel.name} {classLevel?.stream?.name} - ({classLevel.calendar_year})
                    </option>
                  ))}
                </select>
                <BsChevronDown
                  color="gray"
                  size={18}
                  className="absolute top-[50%] right-4 transform -translate-y-1/2 text-[#1F4772] pointer-events-none"
                />
              </div>
              <div className="flex items-center self-end gap-4 ">
              {hasAdminPermissions() && (
                <div>
                  <CreateTerm refetchTerms={refetchTerms} />
                </div>
              )}
              </div>
        </div>
      </div>
      <div className=" relative mx-auto   w-full overflow-x-auto  p-2">
        {selectedTerms.length > 0 && (
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
          confirmationMessage="Are you sure you want to delete the selected Term(s)?"
          deleteMessage="This action cannot be undone."
        />
        <table className="  table-auto   bg-white   w-full md:w-2xl lg:w-2xl  text-xs border text-gray-500 p-3 md:p-4 2xl:p-5">
          <thead className=" uppercase border-b bg-gray-50 rounded-t-md">
            <tr>
            {hasAdminPermissions() && (
              <th scope="col" className="px-3 py-2 border-r  text-center">
                <input
                  id="checkbox-all"
                  type="checkbox"
                  checked={selectedTerms.length === termsData?.results.length}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedTerms(
                        termsData?.results.map((term: any) => term.id)
                      );
                    } else {
                      setSelectedTerms([]);
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
              <th scope="col" className="px-3 py-2 border-r text-left text-black ">
                Name
              </th>

              <th scope="col" className="px-3 py-2  border-r text-left text-black">
                Status
              </th>
              {hasAdminPermissions() && (
              <th scope="col" className="px-3 py-2 text-left border  text-black">
                Actions
              </th>
              )}
            </tr>
          </thead>
          <tbody>
            {loadingTerms ? (
              <tr>
                <td colSpan={8} className="text-center py-4">
                  <ContentSpinner />
                </td>
              </tr>
             ) : error ? (
                         <tr>
                           <td colSpan={8} className=" py-4">
                             <div className="flex items-center justify-center space-x-6 text-#1F4772">
                               <TbDatabaseOff size={25} className="text-red-500" />
                               <span className="text-red-500 text-lg">
                                 {(error as any)?.data?.error || "No data to show"}
                               </span>
                             </div>
                           </td>
                         </tr>
                       ) : termsData?.results && termsData?.results.length > 0 ? (
              termsData?.results.map((term: any) => (
                <tr key={term.id} className="bg-white border-b">
                  {hasAdminPermissions() && (
                  <th className="p-2 text-gray-900 text-center border-r">
                    <input
                      id="checkbox-table-search-1"
                      type="checkbox"
                      checked={selectedTerms.includes(term.id)}
                      onChange={() => handleSelect(term.id)}
                      className="w-4 h-4 bg-gray-100 border-gray-300 rounded 
                                   text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600
                                    dark:ring-offset-gray-800 focus:ring-2
                                     dark:bg-gray-700 dark:border-gray-600"
                    />
                  </th>
                  )}
                  <td className="px-3 py-2 border-r  font-normal text-sm lg:text-lg md:text-lg  whitespace-nowrap">
                    {term.term} - ({term.class_level.name}{" "}
                    {term.class_level?.stream?.name} -
                    {term.class_level.calendar_year} )
                  </td>

                  <td className="px-3 py-2 border-r ">
                    <div
                      className={`p-1  items-center inline-flex rounded-md text-xs lg:text-sm md:text-sm ${
                        getStatusColor(term.status).bgColor
                      } ${getStatusColor(term.status).textColor}`}
                    >
                      {term.status}
                    </div>
                  </td>
                  {hasAdminPermissions() && (
                  <td className="px-3 py-2   text-left  ">
                    <div className="flex items-center space-x-3">
                      <EditTerm termId={term.id} refetchTerms={refetchTerms} />
                    </div>
                  </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-4">
                  No Terms found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex lg:justify-center   md:justify-center justify-center mt-4 mb-4 px-6 py-4">
        <nav className="flex items-center space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            className={`px-4 py-2 lg:text-sm md:text-sm text-xs  border rounded ${
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
              className={`px-4 py-2 lg:text-sm md:text-sm text-xs  border rounded ${
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
            className={`px-4 py-2 border lg:text-sm md:text-sm text-xs  rounded ${
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
export default Terms;
