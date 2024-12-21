"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";


import { useDeleteStreamsMutation, useGetStreamsQuery } from "@/redux/queries/streams/streamsApi";
import { Stream } from "@/src/definitions/streams";
import { CreateStream } from "./NewStream";
import DeleteStream from "./deleteStream";
import EditStream from "./editStream";
import { DefaultLayout } from "../layouts/DefaultLayout";
import PageLoadingSpinner from "../layouts/PageLoadingSpinner";
import { PAGE_SIZE } from "@/src/constants/constants";

import { toast } from "react-toastify";
import { FiDelete } from "react-icons/fi";
import { IoIosClose } from "react-icons/io";
import DeleteConfirmationModal from "../students/DeleteModal";
import ContentSpinner from "../perfomance/contentSpinner";

const Streams = () => {
  const pageSize = PAGE_SIZE;
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const pageParam = searchParams.get("page");
  const [currentPage, setCurrentPage] = useState<number>(
    parseInt(pageParam || "1")
  );
  const [selectedStreams, setSelectedStreams] = useState<number[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const router = useRouter();
  const {
    isLoading: loadingStreams,
    data: streamsData,
    refetch,
  } = useGetStreamsQuery(
    { page: currentPage || 1, page_size: pageSize },
    { refetchOnMountOrArgChange: true }
  );
  const [deleteStreams, { isLoading: deleting }] = useDeleteStreamsMutation()
  useEffect(() => {
    const page = parseInt(pageParam || "1");
    if (page !== currentPage) {
      setCurrentPage(page);
    }
  }, [pageParam, currentPage]);

  useEffect(() => {
    refetch();
  }, [currentPage, refetch]);

  const totalPages = Math.ceil((streamsData?.count || 0) / pageSize);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.set("page", page.toString());
    router.push(`/streams/?${currentParams.toString()}`);
  };

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }
  const refetchStreams = () => {
    refetch();
  };
  const handleSelect = (streamId: number) => {
    setSelectedStreams((prevSelected) =>
      prevSelected.includes(streamId)
        ? prevSelected.filter((id) => id !== streamId)
        : [...prevSelected, streamId]
    );
  };
  
  const handleDelete = async () => {
    const data = selectedStreams;
    // const data = { student_ids: selectedStudents };
    console.log("data", data);
  
    try {
      const response = await deleteStreams(data).unwrap();
      const successMessage =
        response.message || "Selected Streams deleted successfully!";
      toast.success(successMessage);
    } catch (error: any) {
      console.log("error", error);
      if (error?.data?.error) {
        toast.error(error.data.error);
      }
    } finally {
      refetchStreams();
      setSelectedStreams([]);
      handleCloseDeleteModal();
    }
  };
  const cancelSelection = () => {
    setSelectedStreams([]);
  };
  const handleOpenDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };
  
  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };
  console.log("streamsData", streamsData);
  return (
    <>
       <div className=" space-y-5  py-2   ">
       
        <div className="p-3 flex justify-between">
          <h2 className="font-semibold text-black md:text-xl text-md lg:text-xl">
            Streams
          </h2>
          <div>
          <CreateStream refetchStreams={refetchStreams} />
          </div>

        </div>
        <div className=" relative overflow-x-auto   shadow-md   bg-white ">
        {selectedStreams.length > 0 && (
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
            confirmationMessage="Are you sure you want to delete the selected Stream(s)?"
            deleteMessage="This action cannot be undone."
          />
         
          <table className="w-full bg-white text-sm border text-left rtl:text-right text-gray-500 ">
            <thead className="text-black uppercase border-b bg-gray-50 rounded-t-md">
              <tr>
              <th scope="col" className="px-4 py-3 border-r  text-center">
                    <input
                      id="checkbox-all"
                      type="checkbox"
                      checked={
                        selectedStreams.length === streamsData?.results.length
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedStreams(
                            streamsData?.results.map(
                              (stream: Stream) => stream.id
                            )
                          );
                        } else {
                          setSelectedStreams([]);
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
                <th scope="col" className="p-2 border-r text-xs md:text-sm lg:text-sm">
                  Name
                </th>
               
                <th scope="col" className="p-2  py-3 text-xs md:text-sm lg:text-sm">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loadingStreams ? (
                <tr>
                  <td colSpan={5} className="text-center py-4">
                    <ContentSpinner />
                  </td>
                </tr>
              ) : streamsData?.results && streamsData?.results.length > 0 ? (
                streamsData.results.map((stream: Stream, index: number) => (
                  <tr key={stream.id} className="bg-white border-b">
                    <th className="px-3 py-2 text-gray-900 text-center border-r">
                          <input
                            id="checkbox-table-search-1"
                            type="checkbox"
                            checked={selectedStreams.includes(stream.id)}
                            onChange={() => handleSelect(stream.id)}
                            className="w-4 h-4 bg-gray-100 border-gray-300 rounded 
                                   text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600
                                    dark:ring-offset-gray-800 focus:ring-2
                                     dark:bg-gray-700 dark:border-gray-600"
                          />
                        </th>
                    <td className="px-3 py-2 font-normal border-r text-sm lg:text-sm md:text-sm text-gray-900 whitespace-nowrap">
                      {stream.name} 
                    </td>
                   
                    <td className="px-3 py-2 flex items-center space-x-5">
                     <EditStream  streamId={stream.id} refetchStreams={refetchStreams} />
                       {/* <DeleteStream streamId={stream.id} refetchStreams={refetchStreams} /> */}
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
export default Streams;
