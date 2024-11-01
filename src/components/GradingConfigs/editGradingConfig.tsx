'use client';
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { IoMdArrowDropdown } from "react-icons/io";
import { toast } from "react-toastify";
import { z } from "zod";

import { useGetGradinConfigQuery, useUpdateConfigMutation } from "@/redux/queries/gradingConfig/gradingConfigApi";
import { useGetSubjectCategoriesQuery } from "@/redux/queries/subjects/subjectCategoriesApi";
import "react-datepicker/dist/react-datepicker.css";
import { BiSolidEdit } from "react-icons/bi";
import Spinner from "../layouts/spinner";
import "../style.css";
interface UpdateConfigProps {
  refetchConfigs: () => void;
  configId:number;
}


export const EditGradingConfig = ({
  refetchConfigs,
  configId
}: UpdateConfigProps) => {
    console.log("config ID", configId)
  const [isOpen, setIsOpen] = useState(false);
  const {
    isLoading: loadingSubjectCategories,
    data: subjectCategoriesData,
    refetch,
  } = useGetSubjectCategoriesQuery({}, { refetchOnMountOrArgChange: true });
  
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
 const [updateConfig, { isLoading: Updating }] = useUpdateConfigMutation();
  const { data: ConfigData, isLoading: isFetching } =
  useGetGradinConfigQuery(configId);

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
    watch,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: zodResolver(schema),
  });
  console.log("ConfigData", ConfigData)
  useEffect(() => {
    if (ConfigData) {
      setValue("subject_category", ConfigData.subject_category.id);
      setValue("min_marks", ConfigData.min_marks);
      setValue("max_marks", ConfigData.max_marks);
      setValue("grade", ConfigData.grade);
      setValue("points", ConfigData.points);
      setValue("remarks", ConfigData.remarks);
    }
  }, [ConfigData, setValue]);
  const onSubmit = async (data: FieldValues) => {
    const { grade, min_marks, max_marks, points, remarks, subject_category } = data;
    const id = configId;
    try {
      await updateConfig({id, ...data}).unwrap();
      toast.success("Grade configuration updated successfully!");
      handleCloseModal();
      refetchConfigs();
    } catch (error: any) {
      if (error?.data?.error) {
        console.log("error", error);
        toast.error(error.data.error);
      } else {
        toast.error("Failed to update grade configuration. Please try again.");
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
        className=" cursor-pointer p-1 rounded-sm bg-green-100 "
        onClick={handleOpenModal}
      >
        <BiSolidEdit   size={17} className="text-green-800" />
      </div>

      {isOpen && (
        <div className="modal fixed z-9999 w-full h-full top-0 left-0 flex items-start justify-center">
          <div
            className="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"
            onClick={handleCloseModal}
          ></div>

          <div className="modal-container bg-white  w-10/12 md:max-w-3xl mx-auto rounded shadow-lg z-50 mt-10 transform transition-all">
            {Updating && <Spinner />}
            <div className="modal-content py-6 text-left px-6 ">
              <div className="flex justify-between items-center pb-3">
                <p className="text-2xl font-bold text-[#1F4772]">
                  Edit Grading Config
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
                <div className="relative">
                  <label
                    htmlFor="Category"
                    className="block text-gray-700 text-sm  font-semibold mb-2"
                  >
                    Subject Category
                  </label>
                  <select
                    id="Category"
                    {...register("subject_category", { valueAsNumber: true })}
                    value={watch("subject_category")}
                    onChange={handleSubjectCategoryChange}
                    className="w-full appearance-none py-2 px-4 text-lg rounded-md border border-blue-500 focus:outline-none"
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
                  <IoMdArrowDropdown
                    size={30}
                    className="absolute top-[60%] right-4 transform -translate-y-1/2 text-[#1F4772] pointer-events-none"
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
                      className="block text-gray-700 text-sm  font-semibold mb-2"
                    >
                      Min Marks
                    </label>
                    <input
                      type="number"
                      id="Min marks"
                      placeholder="Enter Min Marks "
                      {...register("min_marks", { valueAsNumber: true })}
                      className="w-full py-2 px-4 rounded-md border border-blue-500 focus:outline-none"
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
                      className="block text-gray-700 text-sm  font-semibold mb-2"
                    >
                      Max Marks
                    </label>
                    <input
                      type="number"
                      id="max marks"
                      placeholder="Enter max marks "
                      {...register("max_marks", { valueAsNumber: true })}
                      className="w-full py-2 px-4 rounded-md border border-blue-500 focus:outline-none"
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
                      className="block text-gray-700 text-sm  font-semibold mb-2"
                    >
                      Grade
                    </label>
                    <select
                      id="grade"
                      {...register("grade")}
                      className="w-full appearance-none py-2 px-4 text-lg rounded-md border border-blue-500 focus:outline-none"
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
                    <IoMdArrowDropdown
                      size={30}
                      className="absolute top-[60%] right-4 transform -translate-y-1/2 text-[#1F4772] pointer-events-none"
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
                      className="block text-gray-700 text-sm  font-semibold mb-2"
                    >
                      Points
                    </label>
                    <input
                      type="number"
                      id="Points"
                      placeholder="Enter points "
                      {...register("points", { valueAsNumber: true })}
                      className="w-full py-2 px-4 rounded-md border border-blue-500 focus:outline-none"
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
                    className="block text-gray-700 text-sm  font-semibold mb-2"
                  >
                    Remarks
                  </label>
                  <input
                    type="text"
                    id="Remarks"
                    placeholder="Enter remarks "
                    {...register("remarks")}
                    className="w-full py-2 px-4 rounded-md border border-blue-500 focus:outline-none"
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
                    className="bg-gray-400 text-white rounded-md px-6 py-3 hover:bg-gray-500 focus:outline-none"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[#36A000] text-white rounded-md px-6 py-3 hover:bg-[#36A000] focus:outline-none"
                  >
                    {Updating ? "Updating..." : "Update"}
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
