"use client";
import {
  useDeleteSubjectsMutation,
  useGetSubjectsQuery,
} from "@/redux/queries/subjects/subjectsApi";
import { PAGE_SIZE } from "@/src/constants/constants";
import { ClassLevel } from "@/src/definitions/classlevels";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { FiDelete } from "react-icons/fi";
import { GoSearch } from "react-icons/go";
import { IoIosClose } from "react-icons/io";
import { toast } from "react-toastify";
import { useDebouncedCallback } from "use-debounce";
import ContentSpinner from "../perfomance/contentSpinner";
import DeleteConfirmationModal from "../students/DeleteModal";
import EditSubject from "./editSubject";
import { AddSubject } from "./NewSubject";
import { usePermissions } from "@/src/hooks/hasAdminPermission";
import PageLoadingSpinner from "../layouts/PageLoadingSpinner";
interface Subject {
  id: number;
  subject_name: string;
  subject_type: string;
  category: {
    id: number;
    name: string;
  };
  class_levels:ClassLevel[];
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
  const { hasAdminPermissions ,loading:loadingPermissions} = usePermissions();
  const initialFilters = useMemo(
      () => ({

        subject_name: searchParams.get("subject_name") || "",
      }),
      [searchParams]
    );
  
    const initialPage = parseInt(searchParams.get("page") || "1", 15);
    const [filters, setFilters] = useState(initialFilters);
    const [currentPage, setCurrentPage] = useState(initialPage);
  const [selectedSubjects, setSelectedSubjects] = useState<number[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const params = new URLSearchParams();
    params.set("page", currentPage.toString());
    if (filters.subject_name){
      params.set("subject_name", filters.subject_name);
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
    isLoading: loadingSubjects,
    data: subjectsData,
    error,
    refetch,
  } = useGetSubjectsQuery(
    queryParams,
    { refetchOnMountOrArgChange: true }
  );
  const [deleteSubjects, { isLoading: deleting }] = useDeleteSubjectsMutation();
  console.log("subjectsData", subjectsData)
   const handleSearch = useDebouncedCallback((value: string) => {
      console.log(`Debounced Search Term: ${value}`);
      setFilters((prev) => ({ ...prev, subject_name: value }));
    }, 100);
    const handleFilterChange = (
      e: ChangeEvent<HTMLSelectElement | HTMLInputElement>
    ) => {
      const { name, value } = e.target;
      if (name === "subject_name") {
        handleSearch(value);
      } else {
        setFilters((prev) => ({ ...prev, [name]: value }));
      }
    };

  const totalPages = Math.ceil((subjectsData?.count || 0) / pageSize);
  const refetchSubjects = () => {
    refetch();
  };
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
  if (loadingPermissions) {
    return <PageLoadingSpinner />;
  }


  return (
    <>
      <div className=" space-y-5 bg-white shadow-md  py-4 px-3">
        <div className=" p-3  flex flex-col md:flex-row md:items-center lg:items-center md:gap-0 lg:gap-0 gap-4 lg:justify-between md:justify-between">
          <h2 className="font-semibold text-black md:text-xl text-md lg:text-xl">
            All Subjects
          </h2>

          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
            <div className="w-full md:w-auto flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
              <GoSearch size={20} className="text-gray-500" />
              <input
                type="text"
                placeholder="Search..."
                name="subject_name"
                  value={filters.subject_name || ""}
                  onChange={handleFilterChange}
                className="w-[200px] p-2 bg-transparent outline-none"
              />
            </div>
            <div className="flex items-center self-end gap-4 ">
              {/* <button className="flex items-center text-center p-2 justify-center rounded-full bg-green-700 shadow-md">
                <TbAdjustmentsHorizontal size={18} className="text-white" />
              </button> */}
              <AddSubject refetchSubjects={refetchSubjects} />
            </div>
          </div>
        </div>

        <div className=" relative overflow-x-auto p-2  ">
          {selectedSubjects.length > 0 && (
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
            confirmationMessage="Are you sure you want to delete the selected subject(s)?"
            deleteMessage="This action cannot be undone."
          />
          <table className="w-full bg-white text-sm border text-left rtl:text-right text-gray-500 ">
            <thead className="text-sm text-gray-700 uppercase border-b bg-gray-50 rounded-t-md">
              <tr>
              {hasAdminPermissions() && (
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
                          subjectsData?.results.map(
                            (subject: Subject) => subject.id
                          )
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
              )}
                <th scope="col" className="px-4 border-r py-3 text-[10px]">
                  Name
                </th>
                <th scope="col" className="px-4 border-r py-3 text-[10px]">
                  Type
                </th>
                <th scope="col" className="px-4 border-r py-3 text-[10px]">
                  Category
                </th>
                <th scope="col" className="px-4 border-r py-3 text-[10px]">
                  Class 
                </th>
                {hasAdminPermissions() && (
                <th scope="col" className="px-4  py-3 text-[10px]">
                  Actions
                </th>
                )}
              </tr>
            </thead>
            <tbody>
              {loadingSubjects ? (
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
                                       {(error as any)?.data?.error ||
                                         "Internal Server Error"}
                                     </span>
                                   </div>
                                 </td>
                               </tr>
                    ): subjectsData?.results && subjectsData?.results.length > 0 ? (
                subjectsData?.results.map((subject: Subject, index: number) => (
                  <tr key={subject.id} className="bg-white border-b ">
                   {hasAdminPermissions() && (
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
                   )}
                    <td className="px-3 py-2 font-normal border-r text-sm lg:text-lg md:text-lg  whitespace-nowrap">
                      {subject.subject_name}
                    </td>
                    <td className="px-3 py-2  border-r text-sm lg:text-lg md:text-lg">
                      {subject.subject_type}
                    </td>
                    <td className="px-3 py-2  border-r text-sm lg:text-lg md:text-lg">
                      {subject.category.name}
                    </td>
                    <td className="px-3 py-2  border-r text-sm lg:text-lg md:text-lg">
                    {subject.class_levels.map((classLevel) => `${classLevel.name} - ${classLevel.calendar_year}`).join(", ")}
                    </td>
                    {hasAdminPermissions() && (
                    <td className="px-3 py-2 flex items-center space-x-5">
                      <EditSubject
                        subjectId={subject.id}
                        refetchSubjects={refetchSubjects}
                      />
                      {/* <DeleteSubject subjectId={subject.id} refetchSubjects={refetchSubjects} /> */}
                    </td>
                    )}
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
