"use client";
import { IoMdSearch } from "react-icons/io";
import { useGetAllClassesQuery, useGetClassesQuery } from "@/redux/queries/classes/classesApi";
import { useDeleteMarksMutation, useGetMarksDataQuery } from "@/redux/queries/marks/marksApi";
import { useGetSubjectsQuery } from "@/redux/queries/subjects/subjectsApi";
import { ClassLevel } from "@/src/definitions/classlevels";
import { MarksInterface } from "@/src/definitions/marks";
import { Subject } from "@/src/definitions/subjects";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { TbDatabaseOff } from "react-icons/tb";
import { DefaultLayout } from "../layouts/DefaultLayout";
import PageLoadingSpinner from "../layouts/PageLoadingSpinner";
import DeleteMarkRecord from "./deleteMarks";
import EditMarks from "./editMarks";
import { VscRefresh } from "react-icons/vsc";
import { CiSearch } from "react-icons/ci";
import DataSpinner from "../layouts/dataSpinner";
import { BsChevronDown } from "react-icons/bs";
import { useGetTermsQuery } from "@/redux/queries/terms/termsApi";
import { TermInterface } from "@/src/definitions/terms";
import ContentSpinner from "../perfomance/contentSpinner";
import { FiDelete } from "react-icons/fi";
import { IoIosClose } from "react-icons/io";
import { toast } from "react-toastify";
import DeleteConfirmationModal from "../students/DeleteModal";
import { PAGE_SIZE } from "@/src/constants/constants";
const MarksList = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPage = parseInt(searchParams.get("page") || "1", 10);
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [selectedMarks, setSelectedMarks] = useState<number[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedClassLevel, setSelectedClassLevel] = useState<number | null>(null);

  const initialFilters = useMemo(
    () => ({
      class_level: searchParams.get("class_level") || "",
      admission_number: searchParams.get("admission_number") || "",
      term: searchParams.get("term") || "",
      subject: searchParams.get("subject") || "",
    }),
    [searchParams]
  );
  const [filters, setFilters] = useState(initialFilters);
  const pageSize = PAGE_SIZE;
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.class_level){
      params.set("class_level", filters.class_level)
    };
    if (filters.admission_number) {
      params.set("admission_number", filters.admission_number)
    };
    if (filters.term){
      params.set("term", filters.term)
    };
    if (filters.subject){
      params.set("subject", filters.subject)
    };

    router.replace(`?${params.toString()}`);
  }, [
    filters
  ]);
  const queryParams = useMemo(
    () => ({
      ...filters,
    }),
    [
    
       filters]
  );
  console.log("queryParams",queryParams)
  const {
    isLoading: loading,
    data,
    error,
    refetch,
  } = useGetMarksDataQuery(
   
    queryParams,
    { 
      skip: false,
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true
     }
  );
  const [deleteMarks, { isLoading: deleting }] = useDeleteMarksMutation();
  
  const {
    isLoading: loadingClasses,
    data: classesData,
    refetch: refetchClasses,
  } = useGetAllClassesQuery({}, { refetchOnMountOrArgChange: true });

  const {
    isLoading: loadingSubjects,
    data: subjectsData,
    refetch: refetchSubjects,
  } = useGetSubjectsQuery({}, { refetchOnMountOrArgChange: true });

  const {
    isLoading: loadingTerms,
    data: termsData,
    refetch: refetchTerms,
  } = useGetTermsQuery({}, { refetchOnMountOrArgChange: true });

  const handleSearch = useDebouncedCallback((value: string) => {
    // console.log(`Debounced Search Term: ${value}`);
    setFilters((prev) => ({ ...prev, admission_number: value }));
  }, 100);
  const studentsData = data && data.length > 0 ? data : null;

  const handleFilterChange = (
    e: ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    if (name === "admission_number") {
      handleSearch(value);
    } else if(name === "class_level") {
      setSelectedClassLevel(value ? parseInt(value, 10) : null);
      setFilters((prev) => ({ ...prev, class_level: value, term: "" }));
    }else{
      setFilters((prev) => ({ ...prev, [name]: value }));
    }
     
  };
 
  const filteredTerms = termsData?.filter(
    (term: any) => term.class_level.id === selectedClassLevel
  );
  const handleResetFilters = () => {
    setFilters({
      class_level: "",
      admission_number: "",
      subject: "",
      term: "",
    });
    const params = new URLSearchParams();
    router.push("?");
  };
  const refetchMarks = () => {
    refetch();
  };
  const handleSelect = (marksId: number) => {
    setSelectedMarks((prevSelected) =>
      prevSelected.includes(marksId)
        ? prevSelected.filter((id) => id !== marksId)
        : [...prevSelected, marksId]
    );
  };
  const handleDelete = async () => {
    const data = selectedMarks;
    console.log("data", data);

    try {
      const response = await deleteMarks(data).unwrap();
      const successMessage =
        response.message || "Selected Mark records deleted successfully!";
      toast.success(successMessage);
    } catch (error: any) {
      console.log("error", error);
      if (error?.data?.error) {
        toast.error(error.data.error);
      }
    } finally {
      refetchMarks();
      setSelectedMarks([]);
      handleCloseDeleteModal();
    }
  };
  const cancelSelection = () => {
    setSelectedMarks([]);
  };
  const handleOpenDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };
  


  const totalPages = Math.ceil((data?.count || 0) / pageSize);
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
  console.log("terms", termsData)
  return (
    <div className="space-y-5 shadow-md border py-2  bg-white">
      <div className=" p-3  space-y-3">
        <h2 className="font-semibold text-black text-xl">Marks Records</h2>
      </div>

      <div className="flex flex-col gap-3 lg:gap-0 lg:flex-row lg:items-center lg:justify-end md:justify-end  lg:space-x-5 px-2 ">
      <div className="relative w-full lg:w-55 md:w-55 xl:w-55 ">
            <select
              name="subject"
              value={filters.subject || ""}
              onChange={handleFilterChange}
              className="w-full lg:w-55 md:w-55 xl:w-55 
              text-sm md:text-lg lg:text-lg appearance-none py-2 px-4 font-normal rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
            >
              <option value="">--- Select subject ---</option>
              {subjectsData?.map((subject: Subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.subject_name}
                </option>
              ))}
            </select>
            <BsChevronDown
              color="gray"
              size={20}
              className="absolute top-[50%] right-4 transform -translate-y-1/2 text-[#1F4772] pointer-events-none"
            />
          </div>
          <div className="relative w-full lg:w-55 md:w-55 xl:w-55  ">
            <select
              name="class_level"
              value={filters.class_level || ""}
              onChange={handleFilterChange}
              className="w-full lg:w-55 md:w-55 xl:w-55 
                text-sm md:text-lg lg:text-lg appearance-none py-2 px-4 font-normal rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
             >
              <option value="">--- Select class ---</option>
              {classesData?.map((classLevel: ClassLevel) => (
                <option key={classLevel.id} value={classLevel.id}>
                  {classLevel.form_level.name} {classLevel?.stream?.name} - {classLevel.calendar_year}
                </option>
              ))}
            </select>
            <BsChevronDown
              color="gray"
              size={20}
              className="absolute top-[50%] right-4 transform -translate-y-1/2 text-[#1F4772] pointer-events-none"
            />
          </div>
        <div className="relative w-full lg:w-55 md:w-55 xl:w-55 ">
            <select
              name="term"
              value={filters.term || ""}
              onChange={handleFilterChange}
              className="w-full lg:w-55 md:w-55 xl:w-55 
              text-sm md:text-lg lg:text-lg appearance-none py-2 px-4 font-normal rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
           >
              <option value="">-- Select term ---</option>
              {filteredTerms?.map((term: TermInterface) => (
                <option key={term.id} value={term.id}>
                  {term.term} 
                </option>
              ))}
            </select>
            <BsChevronDown
              color="gray"
              size={20}
              className="absolute top-[50%] right-4 transform -translate-y-1/2 text-[#1F4772] pointer-events-none"
            />
          </div>
       
        
      </div>
      <div className="flex flex-col space-y-3 md:space-y-0  lg:flex-row md:flex-row lg:space-x-4 md:space-x-4 px-4 lg:justify-end md:justify-end   lg:items-center md:items-center">
          <div className="relative w-full lg:w-64 md:w-64 xl:w-64  ">
          <IoMdSearch
                  size={25}
                  style={{ strokeWidth: 3 }} 
                  className="absolute stroke-2 text-[#1E9FF2] top-[50%] left-3 transform -translate-y-1/2  pointer-events-none"
                />
            <input
              type="text"
              name="admission_number"
              value={filters.admission_number || ""}
              onChange={handleFilterChange}
              placeholder="admission no."
              className="w-full lg:w-56 md:w-56 xl:w-56  p-2 transition-all ease-in-out duration-300 pl-10 pr-4 rounded-full border border-1 border-[#1E9FF2] focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-md md:placeholder:text-lg lg:placeholder:text-lg"
              />
          </div>
          <div
            onClick={handleResetFilters}
            className="p-2 cursor-pointer max-w-max   inline-flex space-x-2 items-center text-[13px]  lg:text-sm md:text-xs  rounded-md border text-white bg-primary"
          >
            <VscRefresh className="text-white" />
            <span>Reset Filters</span>
          </div>
        </div>
      <div className=" relative overflow-x-auto p-2  ">
      {selectedMarks.length > 0 && (
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
            confirmationMessage="Are you sure you want to delete the selected Marks record(s)?"
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
                        selectedMarks.length === data?.length
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedMarks(
                            data?.map((marksRecord: MarksInterface) => marksRecord.id)
                          );
                        } else {
                          setSelectedMarks([]);
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
                Subject
              </th>
              <th scope="col" className="px-4 border-r py-3 text-[10px]">
                Cat
              </th>
              <th scope="col" className="px-4 border-r py-3 text-[10px]">
                Exam
              </th>
              <th scope="col" className="px-4 border-r py-3 text-[10px]">
                Total
              </th>
              <th scope="col" className="px-4 border-r py-3 text-[10px]">
                Grade
              </th>
              <th scope="col" className="px-4 border-r py-3 text-[10px]">
                Points
              </th>
              <th scope="col" className="px-4  py-3 text-[10px]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="text-center py-4">
                  <ContentSpinner />
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={8} className=" py-4">
                  <div className="flex items-center justify-center space-x-6 text-#1F4772">
                    <TbDatabaseOff size={25} />
                    <span>
                      {(error as any)?.data?.error || "No data to show"}
                    </span>
                  </div>
                </td>
              </tr>
            ) : data && data?.length > 0 ? (
              data?.map((marksData: MarksInterface, index: number) => (
                <tr key={marksData.id} className="bg-white border-b">
                 <th className="px-3 py-2 text-gray-900 text-center border-r">
                          <input
                            id="checkbox-table-search-1"
                            type="checkbox"
                            checked={selectedMarks.includes(marksData.id)}
                            onChange={() => handleSelect(marksData.id)}
                            className="w-4 h-4 bg-gray-100 border-gray-300 rounded 
                                   text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600
                                    dark:ring-offset-gray-800 focus:ring-2
                                     dark:bg-gray-700 dark:border-gray-600"
                          />
                        </th>
                  <td className="px-3 py-2 border-r text-sm lg:text-lg md:text-lg font-normal text-gray-900 whitespace-nowrap">
                    {marksData.student.first_name} {marksData.student.last_name}
                  </td>
                  <td className="px-3 py-2 border-r text-sm lg:text-sm md:text-sm">
                    {marksData.student_subject?.subject.subject_name}
                  </td>
                  <td className="px-3 py-2 border-r text-sm lg:text-sm md:text-sm">
                    {marksData.cat_mark}
                  </td>
                  <td className="px-3 py-2 border-r text-sm lg:text-sm md:text-sm">
                    {marksData.exam_mark}
                  </td>
                  <td className="px-3 py-2 border-r text-sm lg:text-sm md:text-sm">
                    {marksData.total_score}
                  </td>
                  <td className="px-3 py-2 border-r text-sm lg:text-lg md:text-sm">
                    {marksData.grade}
                  </td>
                  <td className="px-3 py-2  border-r text-sm lg:text-sm md:text-sm">
                    {marksData.points}
                  </td>
                  <td className="px-3 py-2 flex items-center space-x-5">
                    <EditMarks
                      marksId={marksData.id}
                      refetchMarks={refetchMarks}
                      terms={filteredTerms}
                    />
                    {/* <DeleteMarkRecord
                      marksId={marksData.id}
                      refetchMarks={refetchMarks}
                    /> */}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-4">
                  <span className="text-sm lg:text-lg md:text-lg text-red-500">
                   No data to show
                  </span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
    </div>
  );
};
export default MarksList;
