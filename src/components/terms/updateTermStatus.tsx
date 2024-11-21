"use client";
import {
  useGetTeacherQuery,
  useUpdateTeacherMutation,
} from "@/redux/queries/teachers/teachersApi";
import { useEffect, useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io";

import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues, useForm } from "react-hook-form";
import { BiSolidEdit } from "react-icons/bi";
import { toast } from "react-toastify";
import { z } from "zod";
import Spinner from "../layouts/spinner";
import { BsChevronDown } from "react-icons/bs";
import "react-datepicker/dist/react-datepicker.css";
import "../style.css";
import { useGetTermQuery, useUpdateTermMutation, useUpdateTermStatusMutation } from "@/redux/queries/terms/termsApi";
import DatePicker from "react-datepicker";
import { formatYear } from "@/src/utils/dates";
import { IoRefresh } from "react-icons/io5";
import { RxDotsVertical } from "react-icons/rx";

interface Props {
  termId: number;
  refetchTerms: () => void;
}
const EditTermStatus = ({ termId, refetchTerms }: Props) => {
  console.log("termId", termId);
  const [isOpen, setIsOpen] = useState(false);
  const [updateTermStatus, { isLoading: Updating }] = useUpdateTermStatusMutation();
  const { data: termData, isLoading: isFetching } =useGetTermQuery(termId);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  
  const handleUpdateStatus = async () => {
    if (!selectedStatus) {
        toast.error("Please select a status before saving.");
        return;
      }
    try {
      await updateTermStatus({ id: termId, status: selectedStatus  }).unwrap();
      toast.success("Term status updated successfully!");
      refetchTerms();
      handleCloseModal();
    } catch (error: any) {
      toast.error(error?.data?.error || "Failed to update term status.");
    }
  };
 

  const handleOpenModal = () => setIsOpen(true);
  const handleCloseModal = () =>{
    // reset()
    setIsOpen(false)
  };

  return (
    <>
    
      <div
       onClick={handleOpenModal}
       className=" cursor-pointer">
                        <RxDotsVertical size={17} className="text-primary" />
                      
                      </div>

      {isOpen && (
          <div className="relative z-9999 animate-fadeIn" aria-labelledby="modal-title" role="dialog" aria-modal="true">
 
          <div 
          onClick={handleCloseModal}
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity animate-fadeIn" aria-hidden="true"></div>
        
          <div className="fixed inset-0 z-9999 w-screen overflow-y-auto">
            <div className="flex min-h-full items-start justify-center p-4 text-center sm:items-start sm:p-0">
             
              <div className="relative transform animate-fadeIn overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-16 w-full sm:max-w-2xl p-4  md:p-6 lg:p-6 md:max-w-2xl">
                 {Updating && <Spinner />}
            
              <div className="flex justify-between items-center pb-3">
              <p className="text-2xl md:text-lg lg:text-lg font-semibold text-black">
                  Update Term Status
                </p>
              </div>

              <div className="space-y-4">
              <div className="relative">
                    
                    <select
                      id="status"
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      disabled={Updating}
                      defaultValue=""
                      className="w-full appearance-none py-2 px-4 text-lg rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
                    >
                      <option value="">Status</option>
                      <option value="Active">Active</option>
                      <option value="Ended">Ended</option>
                      <option value="Upcoming">Upcoming</option>
                    </select>
                    <BsChevronDown 
                      color="gray" 
                      size={20}
                      className="absolute top-[70%] right-4 transform -translate-y-1/2 text-[#1F4772] pointer-events-none"
                    />
                    
                  </div>
                 
                </div>
                <div className="flex items-center justify-between mt-6">
                <button
  type="button"
  onClick={handleCloseModal}
  className="bg-gray-400 text-white rounded-md py-2 px-3 md:px-6 md:py-3 lg:px-6 lg:py-3 text-sm lg:text-sm md:text-sm hover:bg-gray-500 focus:outline-none"
>
  Cancel
</button>

                <button
                    onClick={handleUpdateStatus}
                    className={`py-2 px-3 md:px-6 md:py-3 lg:px-6 lg:py-3 rounded-md ${
                      Updating ? "bg-gray-500 cursor-not-allowed" : "bg-[#36A000] text-white"
                    }`}
                    disabled={Updating}
                  >
                    {Updating ? "Updating..." : "Save Changes"}
                  </button>
                  </div>
              </div>
          
          </div>
        </div>
        </div>
      
      )}
    </>
  );
};
export default EditTermStatus;
