"use client";
import { useState } from "react";
import { toast } from "react-toastify";
import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";
import { redirect, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { IoCloseOutline } from "react-icons/io5";
import { FaPlus } from "react-icons/fa6";
import {
  useCreateSubjectMutation,
  useGetSubjectCategoriesQuery,
} from "@/redux/queries/subjects/subjectsApi";
import Spinner from "../layouts/spinner";
interface AddSubject {
  refetchSubjects: () => void;
}
import { FaPlusCircle } from "react-icons/fa";
import { BsChevronDown } from "react-icons/bs";
import { useGetClassesQuery } from "@/redux/queries/classes/classesApi";
export const AddSubject = ({ refetchSubjects }: AddSubject) => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    isLoading: loadingSubjectCategories,
    data: subjectCategoriesData,
    refetch,
  } = useGetSubjectCategoriesQuery({}, { refetchOnMountOrArgChange: true });
  const {
    isLoading: loadingClasses,
    data: classesData,
    refetch: refetchClasses,
  } = useGetClassesQuery({}, { refetchOnMountOrArgChange: true });

  const [createSubject, { data, error, isSuccess, isLoading: isCreating }] =
    useCreateSubjectMutation();

  const schema = z.object({
    subject_name: z.string().min(1, "Subject name is required"),
    subject_type: z.enum(["Core", "Elective"], {
      errorMap: () => ({ message: "Subject type is required" }),
    }),
    category: z.coerce.number().min(1, "Subject category is required"),
    classes: z
    .array(z.coerce.number())
    .min(1,"At least one class must be selected"),
 

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
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValue("category", e.target.value);
  };
  
  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
    setValue("classes", selectedOptions); 
  };
  
  const selectedClasses = watch("classes", []);
 
  const onSubmit =  async(data: FieldValues) => {
    console.log("Form Data Before Submission:", data); 
    const { subject_name, subject_type, subject_category, classes } = data;
    try {
      await createSubject(data).unwrap();
      toast.success("Subject added successfully!");
      handleCloseModal();
      refetchSubjects();
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

  console.log("subjectCategoriesData", subjectCategoriesData);
  console.log("classesData", classesData);
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
                    Add New Subject
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2  lg:grid-cols-2 gap-2 lg:gap-3">
                    <div>
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
                      </div>
                      {errors.subject_type && (
                        <p className="text-red-500 text-sm ">
                          {String(errors.subject_type.message)}
                        </p>
                      )}
                    </div>
                    <div>
                      <div className="relative">
                        <label
                          htmlFor="subjectType"
                          className="block text-gray-900 md:text-lg text-sm lg:text-lg  font-normal  mb-2"
                        >
                          Subject Category
                        </label>
                        <select
                          id="subject Category"
                          {...register("category")}
                          onChange={handleCategoryChange}
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
                      </div>
                      {errors.category && (
                        <p className="text-red-500">
                          {String(errors.category.message)}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="classes"
                      className="block text-gray-900 md:text-lg text-sm lg:text-lg font-normal mb-2"
                    >
                      Select Classes
                    </label>
                    <select
                      id="classes"
                      multiple
                      {...register("classes")}
                      onChange={handleClassChange}
                      value={watch("classes")} 
                      className="w-full appearance-none py-2 px-4 rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white"
                    >
                      {loadingClasses ? (
                        <option value="">Loading...</option>
                      ) : (
                        <>
                          
                          {classesData?.map((cl: any) => (
                            <option key={cl.id} value={cl.id}>
                              {cl.name} {cl?.stream?.name || ""} - ({cl.calendar_year})
                            </option>
                          ))}
                        </>
                      )}
                    </select>
                    {errors.classes && (
                      <p className="text-red-500 text-sm">
                        {String(errors.classes.message)}
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
                        {isSubmitting ? "Submitting..." : "Save Subject"}
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
