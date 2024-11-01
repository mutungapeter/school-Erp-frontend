"use client";
import { useEffect, useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io";

import {
  useGetMarkDataQuery,
  useUpdateMarksDataMutation,
} from "@/redux/queries/marks/marksApi";
import { useGetTermsQuery } from "@/redux/queries/terms/termsApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues, useForm } from "react-hook-form";
import { BiSolidEdit } from "react-icons/bi";
import { toast } from "react-toastify";
import { z } from "zod";
import Spinner from "../layouts/spinner";
interface Props {
  marksId: number;
  refetchMarks: () => void;
}
const EditMarks = ({ marksId, refetchMarks }: Props) => {
  console.log("marksId", marksId);
  const [isOpen, setIsOpen] = useState(false);
  const [updateMarksData, { isLoading: Updating }] =
    useUpdateMarksDataMutation();
  const { data: markData, isLoading: isFetching } =
    useGetMarkDataQuery(marksId);
  const {
    isLoading: loadingTerms,
    data: termsData,
    refetch: refetchTerms,
  } = useGetTermsQuery({}, { refetchOnMountOrArgChange: true });

  const schema = z.object({
    cat_mark: z
      .number()
      .min(0, "Cat mark must be a positive number")
      .max(30, "Cat mark must be less than or equal to 30"),
    exam_mark: z
      .number()
      .min(0, "Exam mark must be a positive number")
      .max(70, "Exam mark must be less than or equal to 70"),
    term: z.number().min(1, "Term is required"),
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
    if (markData) {
      setValue("cat_mark", markData.cat_mark);
      setValue("exam_mark", markData.exam_mark);
      setValue("total_score", markData.total_score);
      setValue("term", markData.term.id);
    }
  }, [markData, setValue]);
  console.log("data", markData);
  const handleOpenModal = () => setIsOpen(true);
  const handleCloseModal = () => setIsOpen(false);

  const catMark = watch("cat_mark", 0);
  const examMark = watch("exam_mark", 0);

  const handleTermChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValue("term", e.target.value);
  };
  const totalMark = Number(catMark) + Number(examMark);
  const onSubmit = async (data: FieldValues) => {
    const id = marksId;
    const { cat_mark, exam_mark, term } = data;
    const studentId = markData.student.id;
    const subjectId = markData.student_subject.id;

    try {
      const payload = {
        student: studentId,
        student_subject: subjectId,
        cat_mark: parseFloat(cat_mark),
        exam_mark: parseFloat(exam_mark),
        term,
      };
      await updateMarksData({ id, ...payload }).unwrap();
      toast.success("Mark record  updated successfully!");
      handleCloseModal();
      refetchMarks();
    } catch (error: any) {
      if (error?.data?.error) {
        console.log("error", error);
        toast.error(error.data.error);
      }
    }
  };

  return (
    <>
      <div className=" cursor-pointer p-1 rounded-sm bg-green-100 " onClick={handleOpenModal}>
        <BiSolidEdit size={17} className="text-green-800" />
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
                  Update Mark Record
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-3">
                  <div>
                    <label
                      htmlFor="cat"
                      className="block text-gray-700 font-semibold text-sm mb-2"
                    >
                      Cat Mark
                    </label>
                    <input
                      type="number"
                      id="cat"
                      placeholder="Enter cart mark"
                      {...register("cat_mark", { valueAsNumber: true })}
                      className="w-full py-2 px-4 rounded-md border border-blue-500 focus:outline-none"
                    />
                    {errors.cat_mark && (
                      <p className="text-red-500 text-sm">
                        {String(errors.cat_mark.message)}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="exam"
                      className="block text-gray-700 font-semibold mb-2"
                    >
                      Exam Mark
                    </label>
                    <input
                      type="number"
                      id="exam"
                      placeholder="Enter exam mark"
                      {...register("exam_mark", { valueAsNumber: true })}
                      className="w-full py-2 px-4 rounded-md border border-blue-500 focus:outline-none"
                    />
                    {errors.exam_mark && (
                      <p className="text-red-500 text-sm">
                        {String(errors.exam_mark.message)}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-3">
                  <div className="relative">
                    <label
                      htmlFor="term"
                      className="block text-gray-700 text-sm  font-semibold mb-2"
                    >
                      Term
                    </label>
                    <select
                      id="term"
                      {...register("term", { valueAsNumber: true })}
                      onChange={handleTermChange}
                      value={watch("term") || ""}
                      className="w-full appearance-none py-2 px-4 text-lg rounded-md border border-blue-500 focus:outline-none"
                    >
                      {loadingTerms ? (
                        <option value="">Loading...</option>
                      ) : (
                        <>
                          <option value="">Select Term</option>
                          {termsData?.map((term: any) => (
                            <option key={term.id} value={term.id}>
                              {term.term}
                            </option>
                          ))}
                        </>
                      )}
                    </select>
                    <IoMdArrowDropdown
                      size={30}
                      className="absolute top-[60%] right-4 transform -translate-y-1/2 text-[#1F4772] pointer-events-none"
                    />
                    {errors.term && (
                      <p className="text-red-500 text-sm">
                        {String(errors.term.message)}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="total"
                      className="block text-gray-700 font-semibold mb-2"
                    >
                      Total Marks
                    </label>
                    <input
                      type="number"
                      id="total"
                      value={totalMark}
                      readOnly
                      className="w-full py-2 px-4 rounded-md border border-gray-300 focus:outline-none bg-gray-200"
                    />
                  </div>
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
                    {isSubmitting ? "Submitting..." : "Submit"}
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
export default EditMarks;
