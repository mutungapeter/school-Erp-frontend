
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import { FiPlus } from "react-icons/fi";
import { FaPlus } from "react-icons/fa6";
import { useCreateGradingConfigMutation } from "@/redux/queries/gradingConfig/gradingConfigApi";
import { useGetSubjectCategoriesQuery } from "@/redux/queries/subjects/subjectCategoriesApi";
import "react-datepicker/dist/react-datepicker.css";
import { BsChevronDown } from "react-icons/bs";
import { FaPlusCircle } from "react-icons/fa";
import Spinner from "../layouts/spinner";
import "../style.css";
import { IoCloseOutline } from "react-icons/io5";

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
    subject_category: z.coerce.number().min(1, "Category is required"),
    min_marks: z.coerce.number().min(0, "Minimum marks is required"),
    max_marks: z.coerce.number().min(1, "Maximum marks is required"),
    grade: z.string().min(1, "Grade is required"),
    points: z.coerce.number().min(1, "Points required"),
    remarks: z.string().min(1, "Remarks  required"),
  });

  const {
    register,
    handleSubmit,
    setValue,
    reset,
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
      reset();
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
             className=" cursor-pointer text-center p-2
              bg-green-700 rounded-full   "
           >
             <FaPlus size={18} className="text-white   " />
           
           </div>

      {isOpen && (
        <div className="relative z-9999 animate-fadeIn" aria-labelledby="modal-title" role="dialog" aria-modal="true">
 
        <div 
        onClick={handleCloseModal}
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity animate-fadeIn" aria-hidden="true"></div>
      
        <div className="fixed inset-0 z-9999 w-screen overflow-y-auto">
          <div className="flex min-h-full items-start justify-center p-4 text-center sm:items-start sm:p-0">
           
            <div className="relative transform animate-fadeIn overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-4 w-full sm:max-w-lg p-4 md:p-6 lg:p-6 md:max-w-lg">
                 {isSubmitting && <Spinner />}
            
              <div className="flex justify-between items-center pb-3">
                <p className="font-semibold text-black  md:text-lg text-md lg:text-lg">
                  Add New Grading Config
                </p>
                <div className="flex justify-end cursor-pointer">
                    <IoCloseOutline
                      size={30}
                      onClick={handleCloseModal}
                      className=" text-gray-500 "
                    />
                  </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
                <div>

                <div className="relative">
                  <label
                    htmlFor="Category"
                    className="block text-gray-900 md:text-lg text-sm lg:text-lg  font-normal  mb-2"
                  >
                    Subject Category
                  </label>
                  <select
                    id="Category"
                    {...register("subject_category")}
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
                </div>
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
                      {...register("min_marks")}
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
                      {...register("max_marks")}
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
                  <div>

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
                      <option value="">---Select grade---</option>
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
                  </div>
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
                      {...register("points")}
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

                <div className="flex justify-start lg:justify-end md:justify-end mt-3 ">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4
                       focus:outline-none focus:ring-blue-300 font-medium text-sm space-x-4 rounded-md  px-5 py-2"
                    >
                      
                      <span>{isSubmitting ? "Saving..." : "Save"}</span>
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
