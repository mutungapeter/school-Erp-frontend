import { FaChevronDown, FaPlus } from "react-icons/fa6";
import { IoMdArrowDropdown } from "react-icons/io";
import { useState } from "react";
import { toast } from 'react-toastify';
import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";
import { redirect, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import { useCreateSubjectMutation, useGetSubjectCategoriesQuery } from "@/redux/queries/subjects/subjectsApi";
import Spinner from "../layouts/spinner";
interface AddSubject{
  refetchSubjects: ()=>void;
}

export const AddSubject = ({refetchSubjects}:AddSubject) => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    isLoading: loadingSubjectCategories,
    data: subjectCategoriesData,
    refetch,
  } = useGetSubjectCategoriesQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  const [createSubject, { data, error, isSuccess }] = useCreateSubjectMutation();

  const schema = z.object({
    subject_name: z.string().min(1, "Subject name is required"),
    subject_type: z.enum(["Core", "Elective"], {
      errorMap: () => ({ message: "Select a valid subject type" }),
    }),
    category: z.string().min(1, "Select a subject category"),
  });
  const {
    register,
    handleSubmit,
    setValue, 
    formState: {isSubmitting, isSubmitSuccessful, errors },
  } = useForm({
    resolver: zodResolver(schema),
  });
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValue("category", e.target.value);
  };
  const onSubmit = async (data: FieldValues) => {
    const { subject_name, subject_type, subject_category } = data;
    try {
      await createSubject(data).unwrap();
      toast.success("Subject added successfully!");
      handleCloseModal();
      refetchSubjects()
    } catch (error:any) {
     
      if (error?.data?.error) {
        toast.error(error.data.error);
      } else {
        toast.error("Failed to add subject. Please try again.");
      }
    }
  };
  const handleOpenModal = () => {
    setIsOpen(true);
  };
  const handleCloseModal = () => {
    setIsOpen(false);
  };

  console.log("subjectCategoriesData", subjectCategoriesData)
  return (
    <>
      <div
        onClick={handleOpenModal}
        className="bg-[#36A000] cursor-pointer text-center justify-center text-white py-2 px-4 flex items-center space-x-3 rounded-md hover:bg-[#36A000]"
      >
        <FaPlus color="white" size={20} />
        <span>Add New</span>
      </div>

      {isOpen && (
        <div className="modal fixed z-50 w-full h-full top-0 left-0 flex items-start justify-center transition-opacity duration-300 ease-out">
          
          <div
            className="modal-overlay absolute w-full h-full bg-gray-900 opacity-50 transition-opacity duration-300 ease-out"
            onClick={handleCloseModal}
          ></div>

          <div
            className={`modal-container bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto mt-10 transform transition-all duration-300 ease-out ${
              isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
            }`}
          >
             {isSubmitting && <Spinner />}
            <div className="modal-content py-6 text-left px-6">
              <div className="flex justify-between items-center pb-3">
                  <p className="text-2xl font-bold text-[#1F4772]">Add New Subject</p>
                <div
                  className="modal-close cursor-pointer z-50"
                  onClick={handleCloseModal}
                >
                  <svg
                    className="fill-current text-black"
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                  >
                    <path d="M1.39 1.393l15.318 15.314m-15.318 0L16.706 1.393" />
                  </svg>
                </div>
              </div>

              
              <form 
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-2"
              >
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
                </div>
                {errors.subject_name &&  <p className="text-red-500 text-sm">{String(errors.subject_name.message)}</p>}
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
                </div>
                {errors.subject_type &&  <p className="text-red-500 text-sm ">{String(errors.subject_type.message)}</p>}
                <div className="relative">
                  <label
                    htmlFor="subjectType"
                    className="block text-gray-700  text-sm font-semibold mb-2"
                  >
                    Subject Category
                  </label>
                  <select
                    id="subject Category"
                    {...register("category")}
                    onChange={handleCategoryChange}
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
                    {errors.category &&  <p className="text-red-500">{String(errors.category.message)}</p>}
                </div>
              <div className="mt-1 flex items-end justify-between">
                <button
                  className="modal-close px-4 bg-white py-2 rounded-md text-black border border-gray-400 "
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 bg-[#1F4772] py-2 rounded-md text-white hover:bg-[#1F4772]">
                <span className="text-sm text-center font-light ">
                    {" "}
                    {isSubmitting ? (
                      // <Spinner />
                      <span>
                        submitting
                      </span>
                    ) : (
                      "submit"
                    )}
                  </span>
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
