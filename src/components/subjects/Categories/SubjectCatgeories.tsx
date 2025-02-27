"use client";
import {
    useDeleteSubjectCategoriesMutation,
    useGetSubjectCategoriesQuery
} from "@/redux/queries/subjects/subjectsApi";
import { PAGE_SIZE } from "@/src/constants/constants";
import { ClassLevel } from "@/src/definitions/classlevels";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { FiDelete } from "react-icons/fi";
import { IoIosClose } from "react-icons/io";
import { toast } from "react-toastify";
import { useDebouncedCallback } from "use-debounce";


import { usePermissions } from "@/src/hooks/hasAdminPermission";
import PageLoadingSpinner from "../../layouts/PageLoadingSpinner";
import ContentSpinner from "../../perfomance/contentSpinner";
import DeleteConfirmationModal from "../../students/DeleteModal";
import EditSubjectCategory from "./EditSubjectCategory";
import { AddSubjectCategory } from "./NewSubjectCategory";



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
const Categories = () => {
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
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
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
    isLoading: loadingSubjectCategories,
    data: categories,
    error,
    refetch,
  } = useGetSubjectCategoriesQuery(
    queryParams,
    { refetchOnMountOrArgChange: true }
  );
  const [deleteSubjectCategories, { isLoading: deleting }] = useDeleteSubjectCategoriesMutation();
  console.log("categories", categories)
   const handleSearch = useDebouncedCallback((value: string) => {
      console.log(`Debounced Search Term: ${value}`);
      setFilters((prev) => ({ ...prev, subject_name: value }));
    }, 100);
    

  const totalPages = Math.ceil((categories?.count || 0) / pageSize);
  const refetchSubjectCategories = () => {
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

  const handleSelect = (categoryId: number) => {
    setSelectedCategories((prevSelected) =>
      prevSelected.includes(categoryId)
        ? prevSelected.filter((id) => id !== categoryId)
        : [...prevSelected, categoryId]
    );
  };
  const handleDelete = async () => {
    const data = selectedCategories;
    console.log("data", data);

    try {
      const response = await deleteSubjectCategories(data).unwrap();
      const successMessage =
        response.message || "Selected Categories deleted successfully!";
      toast.success(successMessage);
    } catch (error: any) {
      console.log("error", error);
      if (error?.data?.error) {
        toast.error(error.data.error);
      }
    } finally {
        refetchSubjectCategories();
        setSelectedCategories([]);
      handleCloseDeleteModal();
    }
  };
  const cancelSelection = () => {
    setSelectedCategories([]);
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
            Subject Categories
          </h2>

          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
           
            <div className="flex items-center self-end gap-4 ">
          
              {hasAdminPermissions() && (
                <div>
              <AddSubjectCategory refetchSubjectCategories={refetchSubjectCategories} />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className=" relative overflow-x-auto  p-2  ">
          {selectedCategories.length > 0 && (
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
            confirmationMessage="Are you sure you want to delete the selected Category(s)?"
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
                      selectedCategories.length === categories?.results.length
                    }
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedCategories(
                            categories?.results.map(
                            (subject: Subject) => subject.id
                          )
                        );
                      } else {
                        setSelectedCategories([]);
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
                
                {hasAdminPermissions() && (
                <th scope="col" className="px-4  py-3 text-[10px]">
                  Actions
                </th>
                )}
              </tr>
            </thead>
            <tbody>
              {loadingSubjectCategories ? (
                <tr>
                  <td colSpan={8} className="text-center py-4">
                    <ContentSpinner />
                  </td>
                </tr>
             ) : error ? (
                               <tr className="">
                                 <td colSpan={8} className=" py-4">
                                   <div className="flex items-center justify-center space-x-6 text-#1F4772">
                                    
                                     <span>
                                       {(error as any)?.data?.error ||
                                         "Internal Server Error"}
                                     </span>
                                   </div>
                                 </td>
                               </tr>
                    ): categories?.results && categories?.results.length > 0 ? (
                        categories?.results.map((cat: any, index: number) => (
                  <tr key={cat.id} className="bg-white border-b ">
                   {hasAdminPermissions() && (
                    <th className="px-3 py-2 text-gray-900 text-center border-r">
                      <input
                        id="checkbox-table-search-1"
                        type="checkbox"
                        checked={selectedCategories.includes(cat.id)}
                        onChange={() => handleSelect(cat.id)}
                        className="w-4 h-4 bg-gray-100 border-gray-300 rounded 
                                   text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600
                                    dark:ring-offset-gray-800 focus:ring-2
                                     dark:bg-gray-700 dark:border-gray-600"
                      />
                    </th>
                   )}
                    <td className="px-3 py-2 font-normal border-r text-sm lg:text-lg md:text-lg  whitespace-nowrap">
                      {cat.name}
                    </td>
                   
                    {hasAdminPermissions() && (
                    <td className="px-3 py-2 flex items-center space-x-5">
                      
                      <EditSubjectCategory 
                      categoryId={cat.id}
                      refetchSubjectCategories={refetchSubjectCategories} 
                      />
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
export default Categories;
