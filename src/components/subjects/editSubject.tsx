"use client";
import { useEffect, useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io";

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
        className=" cursor-pointer p-1 rounded-sm bg-green-100 "
        onClick={handleOpenModal}
      >
        <BiSolidEdit   size={17} className="text-green-800"  />
      </div>

      {isOpen && (
        <div className="modal fixed z-9999 w-full h-full top-0 left-0 flex items-start justify-center">
          <div
            className="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"
            onClick={handleCloseModal}
          ></div>

          <div className="modal-container bg-white  w-10/12 md:max-w-3xl mx-auto rounded shadow-lg z-50 mt-10 transform transition-all">
            {isSubmitting && <Spinner />}
            <div className="modal-content py-6 text-left px-6 ">
              <div className="flex justify-between items-center pb-3">
                <p className="text-2xl font-bold text-[#1F4772]">
                  Update Subject 
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
                
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-3">
              <div>
                  <label
                    htmlFor="subjectName"
                    className="block text-gray-700 font-semibold text-sm mb-2"
                  >
                    Subject Name
                  </label>
                  <input
                    type="text"
                    id="subjectName"
                    placeholder="Enter subject name"
                    {...register("subject_name")}
                    className="w-full py-2 px-4 rounded-md border border-blue-500 focus:outline-none focus:border-blue-500 focus:bg-white"
                  />
                  {errors.subject_name && (
                  <p className="text-red-500 text-sm">
                    {String(errors.subject_name.message)}
                  </p>
                )}
                </div>
                <div className="relative">
                  <label
                    htmlFor="subjectType"
                    className="block text-gray-700 text-sm font-semibold mb-2"
                  >
                    Subject Type
                  </label>
                  <select
                    id="subjectType"
                    {...register("subject_type")}
                    className="w-full appearance-none py-2 px-4 text-lg rounded-md border border-blue-500 focus:outline-none focus:border-blue-500 focus:bg-white"
                  >
                    <option value="">Select subject type</option>
                    <option value="Core">Core</option>
                    <option value="Elective">Elective</option>
                  </select>

                  <IoMdArrowDropdown
                    size={30}
                    className="absolute top-[66%] right-4 transform -translate-y-1/2 text-[#1F4772] pointer-events-none"
                  />
                    {errors.subject_type && (
                  <p className="text-red-500 text-sm ">
                    {String(errors.subject_type.message)}
                  </p>
                )}
                </div>
              
                </div>
                <div className="relative">
                  <label
                    htmlFor="subjectType"
                    className="block text-gray-700  text-sm font-semibold mb-2"
                  >
                    Subject Category
                  </label>
                  <select
                    id="subject Category"
                    {...register("category", {valueAsNumber:true})}
                    onChange={handleCategoryChange}
                    value={watch("category") || ""}
                    className="w-full appearance-none py-2 px-4 text-lg rounded-md border border-blue-500 focus:outline-none focus:border-blue-500 focus:bg-white"
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

                  <IoMdArrowDropdown
                    size={30}
                    className="absolute top-[66%] right-4 transform -translate-y-1/2 text-[#1F4772] pointer-events-none"
                  />
                  {errors.category && (
                    <p className="text-red-500">
                      {String(errors.category.message)}
                    </p>
                  )}
                </div>
                <div className="flex justify-between mt-6">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="bg-gray-400 text-white rounded-md px-6 py-3 hover:bg-gray-500 focus:outline-none"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={Updating}
                    className="bg-[#36A000] text-white rounded-md px-6 py-3 hover:bg-[#36A000] focus:outline-none"
                  >
                    {Updating ? "Updating..." : "Submit"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default EditSubject;
