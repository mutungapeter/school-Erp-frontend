"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";


import { useGetStreamsQuery } from "@/redux/queries/streams/streamsApi";
import { Stream } from "@/src/definitions/streams";
import { CreateStream } from "./NewStream";



const Streams = () => {
  const pageSize = 5;
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const pageParam = searchParams.get("page");
  const [currentPage, setCurrentPage] = useState<number>(
    parseInt(pageParam || "1")
  );
  const router = useRouter();
  const {
    isLoading: loadingStreams,
    data: streamsData,
    refetch,
  } = useGetStreamsQuery(
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

  console.log("streamsData", streamsData);
  return (
    <>
      <div className="lg:mt-[110px] sm:mt-[110px] mt-[50px] flex flex-col gap-5 ">
        <div className="flex flex-col gap-3 lg:gap-0 sm:gap-0 lg:flex-row sm:flex-row  sm:items-center sm:justify-between lg:items-center lg:justify-between">
        <CreateStream refetchStreams={refetchStreams} />

        <div className="flex flex-col gap-3 lg:flex-row sm:flex-row sm:items-center sm:space-x-5 lg:items-center lg:space-x-5">
          
        <select className="w-64  py-2 px-4 rounded border border-[#1F4772] focus:outline-none focus:bg-white">
            <option value="">Filter</option>
            <option value="">All</option>
            <option value="10A">Teacher</option>
            <option value="11B">Principal</option>          
          </select>

          <input
            type="text"
            placeholder="Find by  username"
            className="w-35  py-2 px-4 rounded-md border border-[#1F4772] focus:outline-none focus:bg-white  "
          />
        </div>
        </div>
        <div className=" relative overflow-x-auto rounded-md bg-white shadow-md">
          <table className="min-w-full bg-white text-sm border text-left rounded-md rtl:text-right text-gray-500 ">
            <thead className="text-xs text-gray-700 uppercase border-b bg-green-100 rounded-t-md">
              <tr>
                <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                  #
                </th>
                <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                  Name
                </th>
               
               
                
                <th scope="col" className="px-6 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loadingStreams ? (
                <tr>
                  <td colSpan={5} className="text-center py-4">
                    Loading...
                  </td>
                </tr>
              ) : streamsData?.results && streamsData?.results.length > 0 ? (
                streamsData.results.map((stream: Stream, index: number) => (
                  <tr key={stream.id} className="bg-white border-b">
                    <th className="px-6 py-4 text-gray-900">{index + 1}</th>
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                      {stream.name} 
                    </td>
                   
                    <td className="px-6 py-4 flex items-center space-x-5">
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
    </>
  );
};
export default Streams;
