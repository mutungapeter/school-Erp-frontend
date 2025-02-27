"use client";
import {
    useCreateSubjectCategoryMutation
} from "@/redux/queries/subjects/subjectsApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { FaPlus } from "react-icons/fa6";
import { IoCloseOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import { z } from "zod";

import Spinner from "../../layouts/spinner";
interface AddSubjectCategory {
    refetchSubjectCategories: () => void;
}
export const AddSubjectCategory = ({ refetchSubjectCategories }: AddSubjectCategory) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const [createSubjectCategory, { data, error, isSuccess, isLoading: isCreating }] =
  useCreateSubjectCategoryMutation();

  const schema = z.object({
    name: z.string().min(1, "Subject category name is required"),
    
 

  });
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { isSubmitting, isSubmitSuccessful, errors },
  } = useForm({
    resolver: zodResolver(schema),
  });
  
  const selectedClasses = watch("classes", []);
 
  const onSubmit =  async(data: FieldValues) => {
    console.log("Form Data Before Submission:", data); 
    const { name } = data;
    try {
      await createSubjectCategory(data).unwrap();
      toast.success("Subject category added successfully!");
      handleCloseModal();
      refetchSubjectCategories();
    } catch (error: any) {
      if (error?.data?.error) {
        toast.error(error.data.error);
      } else {
        toast.error("Failed to add subject. Please try again.");
      }
    }
    console.log("data",data)
  };
  const handleOpenModal = () => {
    setIsOpen(true);
  };
  const handleCloseModal = () => {
    setIsOpen(false);
    reset();
  };


  return (
    <>
      <div
        onClick={handleOpenModal}
        className=" cursor-pointer text-center p-2
         bg-green-700 rounded-full   "
      >
        <FaPlus size={18} className="text-white   " />
      
      </div>

      {isOpen && (
        <div
          className="relative z-9999 animate-fadeIn"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div
            onClick={handleCloseModal}
            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity animate-fadeIn"
            aria-hidden="true"
          ></div>

          <div className="fixed inset-0 z-9999 w-screen overflow-y-auto">
            <div className="flex min-h-full items-start justify-center p-4 text-center sm:items-start sm:p-0">
              <div className="relative transform animate-fadeIn overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 w-full sm:max-w-xl p-4 md:p-6 lg:p-6 md:max-w-xl">
                {isSubmitting && <Spinner />}
                {isCreating && <Spinner />}

                <div className="flex justify-between items-center pb-3">
                  <p className="lg:text-2xl md:text-2xl text-xl font-bold text-black">
                    Add New Subject Category
                  </p>
                  <div className="flex justify-end cursor-pointer">
                    <IoCloseOutline
                      size={30}
                      onClick={handleCloseModal}
                      className=" text-gray-500 "
                    />
                  </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-gray-900 md:text-lg text-sm lg:text-lg  font-normal  mb-2"
                    >
                      Subject Category Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      placeholder="Enter category name"
                      {...register("name")}
                      className="w-full py-2 px-4 rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm">
                        {String(errors.name.message)}
                      </p>
                    )}
                  </div>

                 

                  <div className="flex justify-start lg:justify-end md:justify-end mt-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className=" inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4
                       focus:outline-none focus:ring-blue-300 font-medium text-sm space-x-4
                       text-white rounded-md  px-5 py-2"
                    >
                      {/* <LiaEdit className="text-white " size={18} /> */}
                      <span>
                        {isSubmitting ? "Submitting..." : "Save Category"}
                      </span>
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
