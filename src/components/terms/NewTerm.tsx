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
import { useCreateTermMutation, useGetTermQuery, useUpdateTermMutation } from "@/redux/queries/terms/termsApi";
import DatePicker from "react-datepicker";
import { formatYear } from "@/src/utils/dates";
import { FaPlusCircle } from "react-icons/fa";
import { IoCloseOutline } from "react-icons/io5";
interface Props {
  refetchTerms: () => void;
}
const CreateTerm = ({  refetchTerms }: Props) => {
 
  const [isOpen, setIsOpen] = useState(false);
  const [
    createTerm,
    { 
      data,         
      error,        
      isLoading: isCreating,    
      isSuccess,   
      isError,     
      reset: resetMutation,      
    },
  ] = useCreateTermMutation();
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const schema = z.object({
    //   term: z.string().min(1, "Term name is required"),
    term: z.enum(["Term 1", "Term 2", "Term 3"], {
        required_error: "Term is required",
    }),
      calendar_year: z.number().min(4, "Enter a valid year"),
      
    });
  

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const handleTermNameChange= (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValue("term", e.target.value);
  };
  const handleDateChange = (date: Date | null) => {
    const formattedDate = date ? Number(formatYear(date)) : null;
    setValue("calendar_year", formattedDate, { shouldValidate: true }); 
    setSelectedDate(date);
};
  const onSubmit = async (data: FieldValues) => {
    const {term, calendar_year} = data;
   
    try {
      await createTerm(data).unwrap();
      toast.success("Term Created successfully!");
      handleCloseModal();
      refetchTerms();
    } catch (error: any) {
      if (error?.data?.error) {
        console.log("error", error);
        toast.error(error.data.error);
      }
    }
  };

  const handleOpenModal = () => setIsOpen(true);
  const handleCloseModal = () =>{
    reset()
    setIsOpen(false)
  };

  return (
    <>
     <div
        onClick={handleOpenModal}
        className=" cursor-pointer text-center justify-center px-2 py-2 md:py-2 md:px-4 lg:py-2 lg:px-4 bg-green-700 rounded-md  flex items-center space-x-2 "
      >
        <FaPlusCircle size={17} className="text-white   " />
        <span className=" lg:text-sm md:text-sm text-xs text-white">New Term</span>
      </div>


      {isOpen && (
          <div className="relative z-9999 animate-fadeIn" aria-labelledby="modal-title" role="dialog" aria-modal="true">
 
          <div 
          onClick={handleCloseModal}
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity animate-fadeIn" aria-hidden="true"></div>
        
          <div className="fixed inset-0 z-9999 w-screen overflow-y-auto">
            <div className="flex min-h-full items-start justify-center p-4 text-center sm:items-start sm:p-0">
             
              <div className="relative transform animate-fadeIn overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-16 w-full sm:max-w-lg p-4  md:p-6 lg:p-6 md:max-w-lg">
                 {isSubmitting && <Spinner />}
            
              <div className="flex justify-between items-center pb-3">
              <p className="text-2xl md:text-lg lg:text-lg font-semibold text-black">
                Add  New Term
                </p>
                <div className="flex justify-end cursor-pointer">
                    <IoCloseOutline
                      size={35}
                      onClick={handleCloseModal}
                      className=" text-gray-500 "
                    />
                  </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="relative">
                  <label
                    htmlFor="Term"
                    className="block text-gray-900 md:text-lg text-sm lg:text-lg  font-normal  mb-2"
                  >
                    Term
                  </label>
                  <select
                    id="term"
                    {...register("term")}
                    className="w-full appearance-none py-2 px-4 text-lg rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
                  >
                    <option value="">Term</option>
                    <option value="Term 1">Term 1</option>
                    <option value="Term 2">Term 2</option>
                    <option value="Term 3">Term 3</option>
                  </select>
                  <BsChevronDown 
                      color="gray" 
                      size={20}
                    className="absolute top-[60%] right-4 transform -translate-y-1/2 text-[#1F4772] pointer-events-none"
                  />
                  {errors.term && (
                    <p className="text-red-500 text-sm">
                      {String(errors.term.message)}
                    </p>
                  )}
                </div>
                  <div className="relative ">
                <label
                  htmlFor="year"
                 className="block text-gray-900
                  md:text-lg text-sm lg:text-lg 
                   font-normal  mb-2"
                >
                  Calendar year
                </label>
                <DatePicker
                selected={selectedDate}
                  onChange={handleDateChange}
                  showYearPicker
                  dateFormat="yyyy"
                  className="py-2 px-4 rounded-md  border border-1
                  border-gray-400 focus:outline-none 
                  focus:border-[#1E9FF2] focus:bg-white 
                  placeholder:text-sm md:placeholder:text-sm 
                 lg:placeholder:text-sm w-full "
                />
                {errors.calendar_year && (
                    <p className="text-red-500 text-sm">
                      {String(errors.calendar_year.message)}
                    </p>
                  )}
                </div>
            
                <div className="flex justify-start lg:justify-end md:justify-end mt-7 py-6">
                    <button
                      type="submit"
                      disabled={isCreating}
                      className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4
                       focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm space-x-4
                       text-white rounded-md  px-5 py-2"
                    >
                      {/* <LiaEdit className="text-white " size={18} /> */}
                      <span>{isCreating ? "Saving..." : "Save Term"}</span>
                    </button>
                  </div>
              </form>
          
          </div>
        </div>
        </div>
        </div>
      )}
    </>
  );
};
export default CreateTerm;
