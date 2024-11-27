
import { useState } from "react";
import { RiDeleteBinLine } from "react-icons/ri";
import Spinner from "../layouts/spinner";
import { toast } from "react-toastify";
import { IoWarningOutline } from "react-icons/io5";
import { useDeleteStudentMutation } from "@/redux/queries/students/studentsApi";
import { useDeleteStreamMutation } from "@/redux/queries/streams/streamsApi";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { IoCloseOutline } from "react-icons/io5";
interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onDelete: () => void;
  }
const DeleteStudentModal = ({ isOpen, onClose, onDelete }:DeleteConfirmationModalProps) => {
    if (!isOpen) return null;
  return (
    <>
      
   
          <div className="relative z-9999 animate-fadeIn" aria-labelledby="modal-title" role="dialog" aria-modal="true">
 
          <div 
         
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity animate-fadeIn" aria-hidden="true"></div>
        
          <div className="fixed inset-0 z-9999 w-screen overflow-y-auto">
            <div className="flex min-h-full items-start justify-center p-4 text-center sm:items-start sm:p-0">
             
              <div className="relative transform animate-fadeIn overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 w-full sm:max-w-xl p-4 md:p-6 lg:p-6 md:max-w-xl">
                 
           <div className="space-y-6">
              <div className="flex justify-end cursor-pointer">
              <IoCloseOutline size={35}
             onClick={onClose}
               className=" text-gray-500 "
                />
              </div>

              <div className="flex flex-col  items-center text-center">
                <AiOutlineExclamationCircle size={40} className="text-currentColor" />
                <p className="lg:text-lg md:text-lg text-sm">
                Are you sure you want to delete the selected student(s)?
                  This action cannot be undone.
                </p>
              </div>
           </div>
              <div className="flex justify-center  space-x-5 text-center mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-white border shadow-md  rounded-md  py-2 px-3 md:px-6 md:py-3 lg:px-6 lg:py-3 text-xs lg:text-sm md:text-sm focus:outline-none"
                >
                  No, Cancel
                </button>
                <button
                  onClick={onDelete}
                //   disabled={deleting}
                  className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 rounded-md  py-2 px-3 md:px-6 md:py-3 lg:px-6 lg:py-3 text-xs lg:text-sm md:text-sm shadow-md focus:outline-none"
                >
                  Yes, I am Sure
                </button>
              </div>
       
          </div>
        </div>
          </div>
        </div>
    
    </>
  );
};
export default DeleteStudentModal;
