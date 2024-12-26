"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";

import { toast } from "react-toastify";
import { z } from "zod";

import {
  useGetGradinConfigQuery,
  useUpdateConfigMutation,
} from "@/redux/queries/gradingConfig/gradingConfigApi";
import { useGetSubjectCategoriesQuery } from "@/redux/queries/subjects/subjectCategoriesApi";
import "react-datepicker/dist/react-datepicker.css";
import { BiSolidEdit } from "react-icons/bi";
import { IoCloseOutline } from "react-icons/io5";

import {
  useGetMeanGradeConfigQuery,
  useUpdateMeanGradeConfigMutation,
} from "@/redux/queries/gradingConfig/meanGradeConfig";
import Spinner from "../../layouts/spinner";
import { BsChevronDown } from "react-icons/bs";
interface UpdateConfigProps {
  refetchMeanGradeConfigs: () => void;
  meangradeConfigId: number;
}

export const EditMeanGradeConfig = ({
  refetchMeanGradeConfigs,
  meangradeConfigId,
}: UpdateConfigProps) => {
  console.log("meangradeConfigId ", meangradeConfigId);
  const [isOpen, setIsOpen] = useState(false);

  const [updateMeanGradeConfig, { isLoading: Updating }] =
    useUpdateMeanGradeConfigMutation();
  const { data: meanGradeConfigData, isLoading: isFetching } =
    useGetMeanGradeConfigQuery(meangradeConfigId);

  const schema = z.object({
    min_mean_points: z.coerce
      .number()
      .min(0, " Minimum average points is required"),
      max_mean_points: z.coerce
      .number()
      .min(1, "Maximum average points is required"),
    grade: z.string().min(1, "Grade is required"),
   
    remarks: z.string().min(1, "Remarks  required"),
    principal_remarks: z.string().min(1, "Principal Remarks  required"),
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
  console.log("meanGradeConfigData", meanGradeConfigData);
  useEffect(() => {
    if (meanGradeConfigData) {
      setValue("min_mean_points", meanGradeConfigData.min_mean_points);
      setValue("max_mean_points", meanGradeConfigData.max_mean_points);
      setValue("grade", meanGradeConfigData.grade);
      setValue("remarks", meanGradeConfigData.remarks);
      setValue("principal_remarks", meanGradeConfigData.principal_remarks);
    }
  }, [meanGradeConfigData, setValue]);
  const onSubmit = async (data: FieldValues) => {
    const { grade, min_mean_points, max_mean_points, principal_remarks, remarks } = data;
    const id = meangradeConfigId;
    try {
      await updateMeanGradeConfig({ id, ...data }).unwrap();
      toast.success("Mean Grade configuration updated successfully!");
      handleCloseModal();
      refetchMeanGradeConfigs();
    } catch (error: any) {
      if (error?.data?.error) {
        console.log("error", error);
        toast.error(error.data.error);
      } else {
        toast.error(
          "Failed to update mean grade configuration. Please try again."
        );
      }
    }
  };

  const handleOpenModal = () => setIsOpen(true);
  const handleCloseModal = () => setIsOpen(false);

  return (
    <>
      <div
        className=" cursor-pointer  inline-flex text-white items-center space-x-1 py-1 px-2 rounded-sm bg-primary"
        onClick={handleOpenModal}
      >
        <BiSolidEdit size={15} className="text-white" />
        <span className="text-xs">Edit</span>
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
              <div className="relative transform animate-fadeIn overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-3 w-full sm:max-w-lg p-4 md:p-6 lg:p-6 md:max-w-lg">
                {Updating && <Spinner />}

                <div className="flex justify-between items-center pb-3">
                  <p className="font-semibold text-black  md:text-lg text-md lg:text-lg">
                    Edit MeanGrade Config
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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2 lg:gap-5">
                    <div>
                      <label
                        htmlFor="Min marks"
                        className="block text-gray-900 md:text-lg text-sm lg:text-lg  font-normal  mb-2"
                      >
                        Minimum mean points
                      </label>
                      <input
                        type="number"
                        id="Min points"
                        placeholder="Enter minimum mean points "
                        {...register("min_mean_points")}
                        className="w-full py-2 px-4 rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
                      />
                      {errors.min_mean_points && (
                        <p className="text-red-500 text-sm">
                          {String(errors.min_mean_points.message)}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="max-mean-points"
                        className="block text-gray-900 md:text-lg text-sm lg:text-lg  font-normal  mb-2"
                      >
                        Maximum mean points
                      </label>
                      <input
                        type="number"
                        id="max-mean-points"
                        placeholder="Enter maximum mean marks "
                        {...register("max_mean_points")}
                        className="w-full py-2 px-4 rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
                      />
                      {errors.max_mean_points && (
                        <p className="text-red-500 text-sm">
                          {String(errors.max_mean_points.message)}
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
                          className="w-full appearance-none p-2 text-lg rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
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
                      </div>
                      {errors.grade && (
                        <p className="text-red-500 text-sm">
                          {String(errors.grade.message)}
                        </p>
                      )}
                    </div>

                 
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-5">
                  <div>
                    <label
                      htmlFor="Remarks"
                      className="block text-gray-900 md:text-lg text-sm lg:text-lg  font-normal  mb-2"
                    >
                     Class Master/Mistress Remarks
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
                  <div>
                    <label
                      htmlFor="principal-remarks"
                      className="block text-gray-900 md:text-lg text-sm lg:text-lg  font-normal  mb-2"
                    >
                     Principal remarks
                    </label>
                    <input
                      type="text"
                      id="principal-remarks"
                      placeholder="Enter principal remarks "
                      {...register("princial_remarks")}
                      className="w-full py-2 px-4 rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
                    />
                    {errors.princial_remarks && (
                      <p className="text-red-500 text-sm">
                        {String(errors.princial_remarks.message)}
                      </p>
                    )}
                  </div>
                  </div>

                  <div className="flex justify-start lg:justify-end md:justify-end mt-3 ">
                    <button
                      type="submit"
                      disabled={Updating || isSubmitting}
                      className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4
                       focus:outline-none focus:ring-blue-300 font-medium text-sm space-x-4 rounded-md  px-5 py-2"
                    >
                      <span>
                        {Updating || isSubmitting ? "Updating..." : "Update"}
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
