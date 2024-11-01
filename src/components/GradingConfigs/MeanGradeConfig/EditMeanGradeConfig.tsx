'use client';
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";

import { toast } from "react-toastify";
import { z } from "zod";

import { useGetGradinConfigQuery, useUpdateConfigMutation } from "@/redux/queries/gradingConfig/gradingConfigApi";
import { useGetSubjectCategoriesQuery } from "@/redux/queries/subjects/subjectCategoriesApi";
import "react-datepicker/dist/react-datepicker.css";
import { BiSolidEdit } from "react-icons/bi";

import { useGetMeanGradeConfigQuery, useUpdateMeanGradeConfigMutation } from "@/redux/queries/gradingConfig/meanGradeConfig";
import Spinner from "../../layouts/spinner";
import { BsChevronDown } from "react-icons/bs";
interface UpdateConfigProps {
  refetchMeanGradeConfigs: () => void;
  meangradeConfigId:number;
}


export const EditMeanGradeConfig = ({
  refetchMeanGradeConfigs,
  meangradeConfigId
}: UpdateConfigProps) => {
    console.log("meangradeConfigId ", meangradeConfigId)
  const [isOpen, setIsOpen] = useState(false);
  
 const [updateMeanGradeConfig, { isLoading: Updating }] = useUpdateMeanGradeConfigMutation();
  const { data: meanGradeConfigData, isLoading: isFetching } = useGetMeanGradeConfigQuery(meangradeConfigId);

  const schema = z.object({
    min_mean_marks: z.number().min(0, " Minimum average marks is required"),
    max_mean_marks: z.number().min(1, "Maximum average marks is required"),
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
  console.log("meanGradeConfigData", meanGradeConfigData)
  useEffect(() => {
    if (meanGradeConfigData) {
      setValue("min_mean_marks", meanGradeConfigData.min_mean_marks);
      setValue("max_mean_marks", meanGradeConfigData.max_mean_marks);
      setValue("grade", meanGradeConfigData.grade);
      setValue("points", meanGradeConfigData.points);
      setValue("remarks", meanGradeConfigData.remarks);
    }
  }, [meanGradeConfigData, setValue]);
  const onSubmit = async (data: FieldValues) => {
    const { grade, min_mean_marks, max_mean_marks, points, remarks } = data;
    const id = meangradeConfigId;
    try {
      await updateMeanGradeConfig({id, ...data}).unwrap();
      toast.success("Mean Grade configuration updated successfully!");
      handleCloseModal();
      refetchMeanGradeConfigs();
    } catch (error: any) {
      if (error?.data?.error) {
        console.log("error", error);
        toast.error(error.data.error);
      } else {
        toast.error("Failed to update mean grade configuration. Please try again.");
      }
    }
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
         <div className="relative z-9999 animate-fadeIn" aria-labelledby="modal-title" role="dialog" aria-modal="true">
 
         <div 
         onClick={handleCloseModal}
         className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity animate-fadeIn" aria-hidden="true"></div>
       
         <div className="fixed inset-0 z-9999 w-screen overflow-y-auto">
           <div className="flex min-h-full items-start justify-center p-4 text-center sm:items-start sm:p-0">
            
             <div className="relative transform animate-fadeIn overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 w-full sm:max-w-2xl p-4 md:p-6 lg:p-6 md:max-w-2xl">
                 {Updating && <Spinner />}
            
              <div className="flex justify-between items-center pb-3">
                <p className="font-semibold text-black  md:text-lg text-md lg:text-lg">
                  Edit MeanGrade  Config
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
                

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 lg:grid-cols-2 gap-2 lg:gap-5">
                  <div>
                    <label
                      htmlFor="Min marks"
                       className="block text-gray-900 md:text-lg text-sm lg:text-lg  font-normal  mb-2"
                    >
                      Minimum Mean Marks
                    </label>
                    <input
                      type="number"
                      id="Min marks"
                      placeholder="Enter minimum mean Marks "
                      {...register("min_mean_marks", { valueAsNumber: true })}
                      className="w-full py-2 px-4 rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
                    />
                    {errors.min_mean_marks && (
                      <p className="text-red-500 text-sm">
                        {String(errors.min_mean_marks.message)}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="max marks"
                       className="block text-gray-900 md:text-lg text-sm lg:text-lg  font-normal  mb-2"
                    >
                      Maximum mean Marks
                    </label>
                    <input
                      type="number"
                      id="max marks"
                      placeholder="Enter maximum mean marks "
                      {...register("max_mean_marks", { valueAsNumber: true })}
                      className="w-full py-2 px-4 rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
                    />
                    {errors.max_mean_marks && (
                      <p className="text-red-500 text-sm">
                        {String(errors.max_mean_marks.message)}
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
                    disabled={Updating || isSubmitting}
                    className="bg-[#36A000] text-white rounded-md py-1 px-2 md:px-4 md:py-2 lg:px-4 lg:py-2 text-xs lg:text-sm md:text-sm hover:bg-[#36A000] focus:outline-none"
                  >
                    {Updating || isSubmitting ? "Updating..." : "Submit"}
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
