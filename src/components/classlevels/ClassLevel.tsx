"use client";
import {
  useDeleteClassLevelsMutation,
  useGetAllClassesQuery,
} from "@/redux/queries/classes/classesApi";
import { PAGE_SIZE } from "@/src/constants/constants";
import { ClassLevel } from "@/src/definitions/classlevels";
import { usePermissions } from "@/src/hooks/hasAdminPermission";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { FiDelete } from "react-icons/fi";
import { toast } from "react-toastify";
import PageLoadingSpinner from "../layouts/PageLoadingSpinner";
import ContentSpinner from "../perfomance/contentSpinner";
import { CreateClassLevel } from "./NewClasslevel";
import EditClassLevel from "./editClassLevels";
import { formatYear } from "@/src/utils/dates";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../style.css";
import { PiCalendarDotsLight } from "react-icons/pi";
import { IoIosClose } from "react-icons/io";
import DeleteConfirmationModal from "../students/DeleteModal";

const Classes = () => {
  const pageSize = PAGE_SIZE;
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { hasAdminPermissions, loading: loadingPermissions } = usePermissions();
  const [selectedClassLevels, setSelectedClassLevels] = useState<number[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const initialFilters = useMemo(
    () => ({
      calendar_year: searchParams.get("calendar_year") || "",
    }),
    [searchParams]
  );
  const initialPage = parseInt(searchParams.get("page") || "1", 15);
  const [filters, setFilters] = useState(initialFilters);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const router = useRouter();
  useEffect(() => {
    const params = new URLSearchParams();
    params.set("page", currentPage.toString());
    if (filters.calendar_year)
      params.set("calendar_year", filters.calendar_year);

    router.replace(`?${params.toString()}`);
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
    isLoading: loadingClasses,
    data: classesData,
    refetch,
    error,
  } = useGetAllClassesQuery(queryParams, { refetchOnMountOrArgChange: true });
  const [deleteClassLevels, { isLoading: deleting }] =
    useDeleteClassLevelsMutation();

  const handleFilterChange = (date: Date | null) => {
    const year = date ? date.getFullYear().toString() : "";
    setFilters((prev) => ({
      ...prev,
      calendar_year: year,
    }));
  };

  const totalPages = Math.ceil((classesData?.count || 0) / pageSize);

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
  const refetchClasses = () => {
    refetch();
  };
  const handleSelect = (classLevelId: number) => {
    setSelectedClassLevels((prevSelected) =>
      prevSelected.includes(classLevelId)
        ? prevSelected.filter((id) => id !== classLevelId)
        : [...prevSelected, classLevelId]
    );
  };

  const handleDelete = async () => {
    const data = selectedClassLevels;
    // const data = { student_ids: selectedStudents };
    console.log("data", data);

    try {
      const response = await deleteClassLevels(data).unwrap();
      const successMessage =
        response.message || "Selected classes deleted successfully!";
      toast.success(successMessage);
    } catch (error: any) {
      console.log("error", error);
      if (error?.data?.error) {
        toast.error(error.data.error);
      }
    } finally {
      refetchClasses();
      setSelectedClassLevels([]);
      handleCloseDeleteModal();
    }
  };
  const cancelSelection = () => {
    setSelectedClassLevels([]);
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
  console.log("classesData", classesData?.results);
  return (
    <div className=" space-y-5 bg-white  px-3 py-4   ">
    <div className=" p-3  flex flex-col md:flex-row md:items-center lg:items-center md:gap-0 lg:gap-0 gap-4 lg:justify-between md:justify-between">
        <h2 className="font-semibold text-black md:text-xl text-md lg:text-xl">
          All Classes
        </h2>
        <div className="flex items-center self-end gap-4 ">
          
        {hasAdminPermissions() && (
          <div>
            <CreateClassLevel refetchClasses={refetchClasses} />
          </div>
        )}
          </div>
        <div className="relative ">
          <label
            htmlFor="year"
            className="block  text-sm  md:text-lg lg:text-lg font-normal  mb-2"
          >
            Calendar Year
          </label>
          <DatePicker
            selected={
              filters.calendar_year
                ? new Date(Number(filters.calendar_year), 0, 1)
                : null
            }
            onChange={handleFilterChange}
            showYearPicker
            dateFormat="yyyy"
            showIcon
            icon={<PiCalendarDotsLight className="text-gray-currentColor" />}
            yearDropdownItemNumber={5}
            placeholderText="YYYY"
            isClearable
            className="w-full appearance-none py-2 px-4 text-lg rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
          />
        </div>
      </div>
      <div className=" relative overflow-x-auto px-1  ">
        {selectedClassLevels.length > 0 && (
          <div className="flex items-center space-x-3 py-3 px-3">
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
          confirmationMessage="Are you sure you want to delete the selected Class(es)?"
          deleteMessage="This action cannot be undone."
        />
        <table className="w-full bg-white text-sm border text-left rtl:text-right text-gray-500 ">
          <thead className=" text-black uppercase border-b bg-gray-50 rounded-t-md">
            <tr>
              {hasAdminPermissions() && (
                <th scope="col" className="p-2 border-r  text-center">
                  <input
                    id="checkbox-all"
                    type="checkbox"
                    checked={
                      selectedClassLevels.length ===
                      classesData?.results?.length
                    }
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedClassLevels(
                          classesData?.results.map(
                            (classLevel: ClassLevel) => classLevel.id
                          )
                        );
                      } else {
                        setSelectedClassLevels([]);
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
                className="p-2 border-r  text-xs md:text-sm lg:text-sm"
              >
                Class
              </th>
              <th
                scope="col"
                className="p-2 border-r  text-xs md:text-sm lg:text-sm"
              >
                Grade
              </th>

              <th
                scope="col"
                className="p-2 border-r text-xs md:text-sm lg:text-sm"
              >
                Year
              </th>
              {hasAdminPermissions() && (
                <th scope="col" className="p-2  text-xs md:text-sm lg:text-sm">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {loadingClasses ? (
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
            ) : classesData?.results && classesData?.results.length > 0 ? (
              classesData?.results.map((cl: ClassLevel, index: number) => (
                <tr key={cl.id} className="bg-white border-b">
                  {hasAdminPermissions() && (
                    <th className="p-2 text-gray-900 text-center border-r">
                      <input
                        id="checkbox-table-search-1"
                        type="checkbox"
                        checked={selectedClassLevels.includes(cl.id)}
                        onChange={() => handleSelect(cl.id)}
                        className="w-4 h-4 bg-gray-100 border-gray-300 rounded 
                                   text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600
                                    dark:ring-offset-gray-800 focus:ring-2
                                     dark:bg-gray-700 dark:border-gray-600"
                      />
                    </th>
                  )}
                  <td className="p-2 font-normal border-r text-sm lg:text-lg md:text-lg  whitespace-nowrap">
                    {cl.name} {cl.stream?.name}
                  </td>
                  <td className="p-2 font-normal border-r text-sm lg:text-lg md:text-lg  whitespace-nowrap">
                    {cl.level}
                  </td>

                  <td className="p-2 font-normal border-r text-sm lg:text-lg md:text-lg  ">
                    {cl?.calendar_year}
                  </td>
                  {hasAdminPermissions() && (
                    <td className="p-2 flex items-center space-x-5">
                      <EditClassLevel
                        classLevelId={cl.id}
                        refetchClassLevels={refetchClasses}
                      />
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-4">
                  No Classes to show.
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
export default Classes;
