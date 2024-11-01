
import { useState } from "react";
import { toast } from "react-toastify";
import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import Spinner from "../layouts/spinner";
import { FaCalendarAlt, FaPlusCircle } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useGetClassesQuery } from "@/redux/queries/classes/classesApi";
import { format } from "date-fns";
import { formatDate } from "@/src/utils/dates";
import "../style.css";
import styles from "../custom.module.css";
import { useCreateStudentMutation } from "@/redux/queries/students/studentsApi";
import { useGetAvailableTeacherUsersQuery } from "@/redux/queries/users/usersApi";
import { useCreateTeacherMutation } from "@/redux/queries/teachers/teachersApi";
import { useCreateGradingConfigMutation } from "@/redux/queries/gradingConfig/gradingConfigApi";
import { useGetSubjectCategoriesQuery } from "@/redux/queries/subjects/subjectCategoriesApi";
import { BsChevronDown } from "react-icons/bs";

interface CreateConfigProps {
  refetchConfigs: () => void;
}

export const CreateNewGradingConfig = ({
  refetchConfigs,
}: CreateConfigProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    isLoading: loadingSubjectCategories,
    data: subjectCategoriesData,
    refetch,
  } = useGetSubjectCategoriesQuery({}, { refetchOnMountOrArgChange: true });
  const [createGradingConfig, { data, error, isSuccess }] =
    useCreateGradingConfigMutation();
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const today = new Date();
  const schema = z.object({
    subject_category: z.number().min(1, "Category is required"),
    min_marks: z.number().min(0, "Minimum marks is required"),
    max_marks: z.number().min(1, "Maximum marks is required"),
    grade: z.string().min(1, "Grade is required"),
    points: z.number().min(1, "Points required"),
    remarks: z.string().min(1, "Remarks  required"),
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FieldValues) => {
    const { grade, min_marks, max_marks, points, remarks, subject_category } =
      data;
    try {
      await createGradingConfig(data).unwrap();
      toast.success("Grade configuration added successfully!");
      handleCloseModal();
      refetchConfigs();
    } catch (error: any) {
      if (error?.data?.error) {
        console.log("error", error);
        toast.error(error.data.error);
      } else {
        toast.error("Failed to grade configuration. Please try again.");
      }
    }
  };
  const handleSubjectCategoryChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setValue("subject_category", e.target.value);
  };

  const handleOpenModal = () => setIsOpen(true);
  const handleCloseModal = () => setIsOpen(false);

  return (
    <>
     <div
        onClick={handleOpenModal}
        className=" cursor-pointer text-center justify-center md:py-2 py-1 lg:py-2 lg:px-4 md:px-4 px-2 bg-green-700 rounded-sm  flex items-center space-x-2 "
      >
        <FaPlusCircle size={17} className="text-white   " />
        <span className="font-bold text-white text-xs md:text-sm lg:text-sm ">Add New</span>
      </div>

      {isOpen && (
        <div className="relative z-9999 animate-fadeIn" aria-labelledby="modal-title" role="dialog" aria-modal="true">
 
        <div 
        onClick={handleCloseModal}
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity animate-fadeIn" aria-hidden="true"></div>
      
        <div className="fixed inset-0 z-9999 w-screen overflow-y-auto">
          <div className="flex min-h-full items-start justify-center p-4 text-center sm:items-start sm:p-0">
           
            <div className="relative transform animate-fadeIn overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 w-full sm:max-w-2xl p-4 md:p-6 lg:p-6 md:max-w-2xl">
                 {isSubmitting && <Spinner />}
            
              <div className="flex justify-between items-center pb-3">
                <p className="font-semibold text-black  md:text-lg text-md lg:text-lg">
                  Add New Grading Config
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
                <div className="relative">
                  <label
                    htmlFor="Category"
                    className="block text-gray-900 md:text-lg text-sm lg:text-lg  font-normal  mb-2"
                  >
                    Subject Category
                  </label>
                  <select
                    id="Category"
                    {...register("subject_category", { valueAsNumber: true })}
                    onChange={handleSubjectCategoryChange}
                    className="w-full appearance-none py-2 px-4 text-lg rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
                  >
                    {loadingSubjectCategories ? (
                      <option value="">Loading...</option>
                    ) : (
                      <>
                        <option value="">Select category</option>
                        {subjectCategoriesData?.map((cat: any) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
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
                  {errors.subject_category && (
                    <p className="text-red-500 text-sm">
                      {String(errors.subject_category.message)}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-5">
                  <div>
                    <label
                      htmlFor="Min marks"
                     className="block text-gray-900 md:text-lg text-sm lg:text-lg  font-normal  mb-2"
                    >
                      Min Marks
                    </label>
                    <input
                      type="number"
                      id="Min marks"
                      placeholder="Enter Min Marks "
                      {...register("min_marks", { valueAsNumber: true })}
                      className="w-full py-2 px-4 rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
                    />
                    {errors.min_marks && (
                      <p className="text-red-500 text-sm">
                        {String(errors.min_marks.message)}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="max marks"
                     className="block text-gray-900 md:text-lg text-sm lg:text-lg  font-normal  mb-2"
                    >
                      Max Marks
                    </label>
                    <input
                      type="number"
                      id="max marks"
                      placeholder="Enter max marks "
                      {...register("max_marks", { valueAsNumber: true })}
                      className="w-full py-2 px-4 rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
                    />
                    {errors.max_marks && (
                      <p className="text-red-500 text-sm">
                        {String(errors.max_marks.message)}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-5">
                  <div className="relative">
                    <label
                      htmlFor="Grade"
                      className="block text-gray-900 md:text-lg text-sm lg:text-lg  font-normal  mb-2"
                    >
                      Grade
                    </label>
                    <select
                      id="grade"
                      {...register("grade")}
                      className="w-full appearance-none py-2 px-4 text-lg rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
                    >
                      <option value="">select Grade</option>
                      <option value="A">A</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B">B</option>
                      <option value="B-">B-</option>
                      <option value="C+">C+</option>
                      <option value="C">C</option>
                      <option value="C-">C-</option>
                      <option value="D+">D+</option>
                      <option value="D">D</option>
                      <option value="D-">D-</option>
                      <option value="E">E</option>
                    </select>
                    <BsChevronDown 
                      color="gray" 
                      size={20}
                      className="absolute top-[70%] right-4 transform -translate-y-1/2 text-[#1F4772] pointer-events-none"
                    />
                    {errors.grade && (
                      <p className="text-red-500 text-sm">
                        {String(errors.grade.message)}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="Points"
                     className="block text-gray-900 md:text-lg text-sm lg:text-lg  font-normal  mb-2"
                    >
                      Points
                    </label>
                    <input
                      type="number"
                      id="Points"
                      placeholder="Enter points "
                      {...register("points", { valueAsNumber: true })}
                      className="w-full py-2 px-4 rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
                    />
                    {errors.points && (
                      <p className="text-red-500 text-sm">
                        {String(errors.points.message)}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="Remarks"
                    className="block text-gray-900 md:text-lg text-sm lg:text-lg  font-normal  mb-2"
                  >
                    Remarks
                  </label>
                  <input
                    type="text"
                    id="Remarks"
                    placeholder="Enter remarks "
                    {...register("remarks")}
                    className="w-full py-2 px-4 rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
                  />
                  {errors.remarks && (
                    <p className="text-red-500 text-sm">
                      {String(errors.remarks.message)}
                    </p>
                  )}
                </div>

                <div className="flex justify-between mt-6">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="bg-gray-400 text-white rounded-md py-1 px-2 md:px-4 md:py-2 lg:px-4 lg:py-2 text-xs lg:text-sm md:text-sm hover:bg-gray-500 focus:outline-none"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={ isSubmitting}
                    className="bg-[#36A000] text-white rounded-md py-1 px-2 md:px-4 md:py-2 lg:px-4 lg:py-2 text-xs lg:text-sm md:text-sm hover:bg-[#36A000] focus:outline-none"
                  >
                    { isSubmitting ? "Creating..." : "Submit"}
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
