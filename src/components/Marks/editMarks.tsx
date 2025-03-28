"use client";
import { useEffect, useState } from "react";

import {
  useGetMarkDataQuery,
  useUpdateMarksDataMutation,
} from "@/redux/queries/marks/marksApi";
import { useGetActiveTermsQuery, useGetTermsQuery } from "@/redux/queries/terms/termsApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues, useForm } from "react-hook-form";
import { BiSolidEdit } from "react-icons/bi";
import { toast } from "react-toastify";
import { z } from "zod";
import Spinner from "../layouts/spinner";
import { BsChevronDown } from "react-icons/bs";
import { IoCloseOutline } from "react-icons/io5";
import { useGetClassesQuery } from "@/redux/queries/classes/classesApi";
import { ClassLevel } from "@/src/definitions/classlevels";
import { TermInterface } from "@/src/definitions/terms";
interface Props {
  marksId: number;
  refetchMarks: () => void;
  terms: TermInterface[] | undefined;
}
const EditMarks = ({ marksId, refetchMarks, terms }: Props) => {
  console.log("marksId", marksId);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedClassLevel, setSelectedClassLevel] = useState<number | null>(null);

  const [updateMarksData, { isLoading: Updating }] =
    useUpdateMarksDataMutation();
  const { data: markData, isLoading: isFetching } =
    useGetMarkDataQuery(marksId);
  const {
    isLoading: loadingTerms,
    data: termsData,
    refetch: refetchTerms,
  } = useGetTermsQuery({}, { refetchOnMountOrArgChange: true });
 const {
    isLoading: loadingClasses,
    data: classesData,
    refetch: refetchClasses,
  } = useGetClassesQuery({}, { refetchOnMountOrArgChange: true });

  // const schema = z.object({
  //   cat_mark: z
  //     .number()
  //     .min(0, "Cat mark must be a positive number")
  //     .max(30, "Cat mark must be less than or equal to 30"),
  //   exam_mark: z
  //     .number()
  //     .min(0, "Exam mark must be a positive number")
  //     .max(70, "Exam mark must be less than or equal to 70"),
  //   term: z.number().min(1, "Term is required"),
  // });
  const schema = z.object({
    total_score: z
      .coerce
      .number()
      .min(0, "Exam marks must be a positive number")
      .max(100, "Exam mark must be less than or equal to 100"),
      exam_type: z.enum(["Midterm", "Endterm"], {
        errorMap: () => ({ message: "Exam type is required" }),
      }),
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
     
      setValue("total_score", markData.total_score);
      setValue("exam_type", markData.exam_type);
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
    const { total_score, exam_type, term } = data;
    const studentId = markData.student.id;
    const subjectId = markData.student_subject.id;

    try {
      const payload = {
        student: studentId,
        student_subject: subjectId,
        total_score: parseFloat(total_score),
        exam_type: exam_type,
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
      <div
        className=" cursor-pointer  inline-flex text-white items-center space-x-1 py-1 px-2 rounded-sm bg-primary"
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
          
           <div className="relative transform animate-fadeIn overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-4 w-full sm:max-w-lg p-4 md:p-6 lg:p-6 md:max-w-lg">
               {isSubmitting && <Spinner />}
            
              <div className="flex justify-between items-center pb-3">
                <p className=" font-semibold text-black  md:text-lg text-md lg:text-lg">
                  Update Mark Record
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

              <div className="relative">
                    <label
                      htmlFor="term"
                     className="block text-gray-900 md:text-lg text-sm lg:text-lg  font-normal  mb-2"
                    >
                      Term
                    </label>
                    <select
                      id="term"
                      {...register("term")}
                      onChange={handleTermChange}
                      value={watch("term") || ""}
                      className="w-full appearance-none py-2 px-4 text-lg rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
                    >
                    
                        <>
                          <option value="">Select Term</option>
                          {terms?.map((term: TermInterface) => (
                            <option key={term.id} value={term.id}>
                              {term.term}
                            </option>
                          ))}
                        </>
                     
                    </select>
                    <BsChevronDown 
                      color="gray" 
                      size={20}
                      className="absolute top-[70%] right-4 transform -translate-y-1/2 text-[#1F4772] pointer-events-none"
                    />
                  </div>
                    {errors.term && (
                      <p className="text-red-500 text-sm">
                        {String(errors.term.message)}
                      </p>
                    )}
            </div>
                 
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-3">
                  <div>
                    <label
                      htmlFor="cat"
                      className="block text-gray-900 md:text-lg text-sm lg:text-lg  font-normal  mb-2"
                    >
                      Exam Marks
                    </label>
                    <input
                      type="number"
                      id="total_score"
                      placeholder="Enter exam marks"
                      {...register("total_score")}
                      className="w-full py-2 px-4 rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
                    />
                    {errors.total_score && (
                      <p className="text-red-500 text-sm">
                        {String(errors.total_score.message)}
                      </p>
                    )}
                  </div>
                  <div className="relative">
                  <label
                    htmlFor="exam_type"
                    className="block text-gray-900 md:text-lg text-sm lg:text-lg  font-normal  mb-2"
                  >
                   Exam type
                  </label>
                  <select
                    id="exam_type"
                    {...register("exam_type")}
                    className="w-full appearance-none py-2 px-4 text-md rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
                  >
                    <option value="">--- Exam Type ---</option>
                    <option value="Midterm">Midterm</option>
                    <option value="Endterm">Endterm</option>
                  </select>
                  <BsChevronDown 
                      color="gray" 
                      size={20}
                    className="absolute top-[70%] right-4 transform -translate-y-1/2 text-[#1F4772] pointer-events-none"
                  />
                </div>
                </div>
             
                 
              
               
                <div className="flex justify-start lg:justify-end md:justify-end mt-7 py-6">
                    <button
                      type="submit"
                      disabled={Updating || isSubmitting}
                      className=" inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4
                       focus:outline-none focus:ring-blue-300 font-medium  text-sm space-x-4
                       text-white rounded-md  px-5 py-2"
                    >
                      {/* <LiaEdit className="text-white " size={18} /> */}
                      <span>{Updating || isSubmitting  ? "Updating..." : "Save Changes"}</span>
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
export default EditMarks;
