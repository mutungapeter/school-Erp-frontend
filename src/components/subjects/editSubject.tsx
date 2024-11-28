"use client";
import { useEffect, useState } from "react";

import {
  useGetSubjectCategoriesQuery,
  useGetSubjectQuery,
  useUpdateSubjectMutation
} from "@/redux/queries/subjects/subjectsApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues, useForm } from "react-hook-form";
import { BiSolidEdit } from "react-icons/bi";
import { toast } from "react-toastify";
import { z } from "zod";
import Spinner from "../layouts/spinner";
import { BsChevronDown } from "react-icons/bs";
import { IoCloseOutline } from "react-icons/io5";

interface Props {
    subjectId: number;
    refetchSubjects: () => void;
}
const EditSubject = ({ subjectId, refetchSubjects }: Props) => {
  console.log("studentId", subjectId);
  const [isOpen, setIsOpen] = useState(false);
  const [updateSubject, { isLoading: Updating }] = useUpdateSubjectMutation();
  const { data: subjectData, isLoading: isFetching } = useGetSubjectQuery(subjectId);
  const {
    isLoading: loadingSubjectCategories,
    data: subjectCategoriesData,
    refetch,
  } = useGetSubjectCategoriesQuery({}, { refetchOnMountOrArgChange: true });
 
  const schema = z.object({
    subject_name: z.string().min(1, "Subject name is required"),
    subject_type: z.enum(["Core", "Elective"], {
      errorMap: () => ({ message: "Select a valid subject type" }),
    }),
    category: z.number().min(1, "Select a subject category"),
  });
  

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (subjectData) {
      setValue("subject_name", subjectData.subject_name);
      setValue("subject_type", subjectData.subject_type);
      setValue("category", subjectData.category.id);
     
    }
  }, [subjectData, setValue]);

  const onSubmit = async (data: FieldValues) => {
    const id = subjectId;
    try {
      await updateSubject({ id, ...data }).unwrap();
      toast.success("Subject updated successfully!");
      handleCloseModal();
      refetchSubjects();
    } catch (error: any) {
      if (error?.data?.error) {
        console.log("error", error);
        toast.error(error.data.error);
      }
    }
  };
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValue("category", e.target.value);
  };
  const handleOpenModal = () => setIsOpen(true);
  const handleCloseModal = () => setIsOpen(false);

  return (
    <>
     <div
        className=" cursor-pointer flex inline-flex text-white items-center space-x-1 py-1 px-2 rounded-sm bg-primary"
        onClick={handleOpenModal}
      >
        <BiSolidEdit   size={15} className="text-white" />
        <span className="text-xs">Edit</span>
      </div>

      {isOpen && (
       <div className="relative z-9999 animate-fadeIn" aria-labelledby="modal-title" role="dialog" aria-modal="true">
 
       <div 
       onClick={handleCloseModal}
       className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity animate-fadeIn" aria-hidden="true"></div>
     
       <div className="fixed inset-0 z-9999 w-screen overflow-y-auto">
         <div className="flex min-h-full items-start justify-center p-4 text-center sm:items-start sm:p-0">
          
           <div className="relative transform animate-fadeIn overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 w-full sm:max-w-xl p-4 md:p-6 lg:p-6 md:max-w-xl">
              {isSubmitting && <Spinner />}
           
              <div className="flex justify-between items-center pb-3">
                <p className="lg:text-2xl md:text-2xl text-xl font-bold text-black">
                  Update Subject 
                </p>
                <div className="flex justify-end cursor-pointer">
                    <IoCloseOutline
                      size={35}
                      onClick={handleCloseModal}
                      className=" text-gray-500 "
                    />
                  </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
                
             <div>
                  <label
                    htmlFor="subjectName"
                  className="block text-gray-900 md:text-lg text-sm lg:text-lg  font-normal  mb-2"
                  >
                    Subject Name
                  </label>
                  <input
                    type="text"
                    id="subjectName"
                    placeholder="Enter subject name"
                    {...register("subject_name")}
                    className="w-full py-2 px-4 rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
                  />
                  {errors.subject_name && (
                  <p className="text-red-500 text-sm">
                    {String(errors.subject_name.message)}
                  </p>
                )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 lg:grid-cols-2 gap-2 lg:gap-3">
                <div className="relative">
                  <label
                    htmlFor="subjectType"
                    className="block text-gray-900 md:text-lg text-sm lg:text-lg  font-normal  mb-2"
                  >
                    Subject Type
                  </label>
                  <select
                    id="subjectType"
                    {...register("subject_type")}
                    className="w-full appearance-none py-2 px-4 text-lg rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
                  >
                    <option value="">Select subject type</option>
                    <option value="Core">Core</option>
                    <option value="Elective">Elective</option>
                  </select>

                  <BsChevronDown 
                      color="gray" 
                      size={20}
                    className="absolute top-[70%] right-4 transform -translate-y-1/2 text-[#1F4772] pointer-events-none"
                  />
                    {errors.subject_type && (
                  <p className="text-red-500 text-sm ">
                    {String(errors.subject_type.message)}
                  </p>
                )}
                </div>
              
                <div className="relative">
                  <label
                    htmlFor="subjectType"
                    className="block text-gray-900 md:text-lg text-sm lg:text-lg  font-normal  mb-2"
                  >
                    Subject Category
                  </label>
                  <select
                    id="subject Category"
                    {...register("category", {valueAsNumber:true})}
                    onChange={handleCategoryChange}
                    value={watch("category") || ""}
                    className="w-full appearance-none py-2 px-4 text-lg rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
                  >
                    {loadingSubjectCategories ? (
                      <option value="">Loading...</option>
                    ) : (
                      <>
                        <option value="">Select category</option>
                        {subjectCategoriesData?.map((category: any) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </>
                    )}
                  </select>

                  <BsChevronDown 
                      color="gray" 
                      size={20}
                    className="absolute top-[70%] right-4 transform -translate-y-1/2 text-[#1F4772] pointer-events-none"
                  />
                  {errors.category && (
                    <p className="text-red-500">
                      {String(errors.category.message)}
                    </p>
                  )}
                </div>
                </div>
               
                <div className="flex justify-start lg:justify-end md:justify-end mt-7 py-6">
                    <button
                      type="submit"
                      disabled={Updating}
                      className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4
                       focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm space-x-4
                       text-white rounded-md  px-5 py-2"
                    >
                      {/* <LiaEdit className="text-white " size={18} /> */}
                      <span>{Updating ? "Updating..." : "Update Subject"}</span>
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
export default EditSubject;
