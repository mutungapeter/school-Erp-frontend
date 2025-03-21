import {
  useRecorMarkMutation,
  useUploadMarksMutation,
} from "@/redux/queries/marks/marksApi";
import { useGetActiveTermsQuery, useGetTermsQuery } from "@/redux/queries/terms/termsApi";
import { StudentSubject } from "@/src/definitions/students";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { FieldValues, useForm } from "react-hook-form";
import { FiPlus } from "react-icons/fi";
import { toast } from "react-toastify";
import { z } from "zod";
import Spinner from "../layouts/spinner";
import "../style.css";
import { BsChevronDown } from "react-icons/bs";
import { useGetClassesQuery } from "@/redux/queries/classes/classesApi";
import { IoCloseOutline } from "react-icons/io5";
import { ClassLevel } from "@/src/definitions/classlevels";

import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
export const UploadMarks = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [uploadMarks, { data, error, isSuccess }] = useUploadMarksMutation();
  const [selectedClassLevel, setSelectedClassLevel] = useState<number | null>(null);

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

  const schema = z.object({
    term: z.coerce.number().min(1, "Term is required"),
    class_level: z.coerce.number().min(1, "Class level is required"),
    exam_type: z.enum(["Midterm", "Endterm"], {
      errorMap: () => ({ message: "Exam type is required" }),
    }),
    marks_file: z
      .any()
      .refine((fileList) => fileList instanceof FileList && fileList.length > 0, {
        message: "Please upload a valid file",
      }),
      // .refine(
      //   (fileList) => fileList instanceof FileList && fileList.length > 0,
      //   {
      //     message: "Please upload a valid file",
      //   }
      // )
      // .refine(
      //   (fileList) => {
      //     const file = fileList[0];
      //     return file instanceof File && file.size > 0;
      //   },
      //   {
      //     message: "Please upload a file with size greater than 0",
      //   }
      // )
      // .refine(
      //   (fileList) => {
      //     const file = fileList[0];
      //     console.log("file.type", file?.type);
      //     const validTypes = [
      //       "text/csv",
      //       "application/vnd.ms-excel",
      //       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      //     ];
      //     return validTypes.includes(file.type);
      //   },
      //   {
      //     message: "Please upload a valid CSV or Excel file",
      //   }
      // ),
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const handleTermChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValue("term", e.target.value);
  };
  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const classLevelId = parseInt(e.target.value, 10);
  setSelectedClassLevel(classLevelId);
    setValue("class", e.target.value);
    // const activeTerms = terms.filter(term => term.status === 'Active');
  };
const filteredTerms = termsData?.filter(
  (term: any) => term.class_level.id === selectedClassLevel
);

  const onSubmit = async (data: FieldValues) => {
    const { term, class_level, exam_type, marks_file } = data;

    if (marks_file && marks_file instanceof FileList) {
      const formData = new FormData();
      formData.append("term", term);
      formData.append("class_level", class_level);
      formData.append("exam_type", exam_type);
      formData.append("marks_file", marks_file[0]);

      try {
        const response = await uploadMarks(formData).unwrap();
        if (response.successes && response.successes.length > 0) {
          response.successes.forEach((successMessage: string) => {
            toast.success(successMessage);
          });
        }

        if (response.errors && response.errors.length > 0) {
          response.errors.forEach((errorMessage: string) => {
            toast.error(errorMessage);
          });
        }

        if (!response.errors || response.errors.length === 0) {
          handleCloseModal();
        }
      } catch (error: any) {
        console.log(error);
        if (error?.data?.errors) {
          error.data.errors.forEach((err: string) => {
            toast.error(err);
          });
        } else if (error?.data?.error) {
          toast.error(error.data.error);
        } else {
          toast.error("Internal Server Error .");
        }
      }
    } else {
      toast.error("Please upload a valid file.");
    }
  };

  const handleOpenModal = () => setIsOpen(true);
  const handleCloseModal = () => {
    reset(), setIsOpen(false);
  };

  return (
    <>
      <div
        onClick={handleOpenModal}
        className="flex items-center
       bg-green-600 space-x-2 px-2 py-1 lg:py-2 lg:px-4 md:py-2 md:px-4 rounded-md cursor-pointer"
      >
        <PiMicrosoftExcelLogoFill size={20} className="text-white" />
        <h5 className="text-white text-xs lg:text-sm md:text-sm">
          Upload marks
        </h5>
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
              <div className="relative transform animate-fadeIn overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 w-full sm:max-w-lg p-4 md:p-6 lg:p-6 md:max-w-lg">
                {isSubmitting && <Spinner />}

                <div className="flex justify-between items-center pb-3">
                  <p className="lg:text-2xl md:text-2xl text-sm font-bold text-black">
                    Upload Marks
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
                      <label
                        htmlFor="marks_file"
                        className="block text-gray-900 md:text-lg text-sm lg:text-lg  font-normal  mb-2"
                      >
                        Excel/Csv file
                      </label>
                      <input
                        type="file"
                        id="marks_file"
                        {...register("marks_file")}
                        placeholder="Upload"
                        accept=".csv, .xls, .xlsx"
                        className="w-full py-2 px-4 rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
                      />
                      {errors.marks_file && (
                        <p className="text-red-500 text-sm">
                          {String(errors.marks_file.message)}
                        </p>
                      )}
                    </div>
                 
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-3">
                  <div>
                  <div className="relative">
                      <label
                        htmlFor="term"
                        className="block text-gray-900 md:text-lg text-sm lg:text-lg  font-normal  mb-2"
                      >
                        Class
                      </label>
                      <select
                        id="term"
                        {...register("class_level")}
                        onChange={handleClassChange}
                        className="w-full appearance-none py-2 px-4 text-sm md:text-md lg:text-md rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
                      >
                        {loadingClasses ? (
                          <option value="">Loading...</option>
                        ) : (
                          <>
                            <option value="">class</option>
                            {classesData?.map((classLevel: ClassLevel) => (
                              <option key={classLevel.id} value={classLevel.id}>
                                {classLevel.name}{" "}
                                {classLevel?.stream?.name} - {classLevel.calendar_year}
                              </option>
                            ))}
                          </>
                        )}
                      </select>
                      <BsChevronDown
                        color="gray"
                        size={16}
                        className="absolute top-[74%] right-4 transform -translate-y-1/2 text-[#1F4772] pointer-events-none"
                      />
                    </div>
                      {errors.class_level && (
                        <p className="text-red-500 text-sm">
                          {String(errors.class_level.message)}
                        </p>
                      )}
                  </div>
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
                        className="w-full appearance-none py-2 px-4 text-sm md:text-md lg:text-md rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
                      >
                        {loadingTerms ? (
                          <option value="">Loading...</option>
                        ) : (
                          <>
                            <option value="">Term</option>
                            {filteredTerms?.map((term: any) => (
                              <option key={term.id} value={term.id}>
                                {term.term} 
                              </option>
                            ))}
                          </>
                        )}
                      </select>
                      <BsChevronDown
                        color="gray"
                        size={16}
                        className="absolute top-[74%] right-4 transform -translate-y-1/2 text-[#1F4772] pointer-events-none"
                      />
                    </div>
                      {errors.term && (
                        <p className="text-red-500 text-sm">
                          {String(errors.term.message)}
                        </p>
                      )}
                    </div>
                   
                  </div>
                  <div>
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
                  {errors.exam_type && (
                    <p className="text-red-500 text-sm">
                      {String(errors.exam_type.message)}
                    </p>
                  )}
                </div>
                  <div className="flex justify-start lg:justify-end md:justify-end  py-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4
                       focus:outline-none focus:ring-blue-300 font-medium text-sm space-x-4 rounded-md  px-5 py-2"
                    >
                      
                      <span>{isSubmitting ? "Uploading..." : "Upload"}</span>
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
