import { useGetClassesQuery } from "@/redux/queries/classes/classesApi";
import { useUploadStudentsMutation } from "@/redux/queries/students/studentsApi";
import { ClassLevel } from "@/src/definitions/classlevels";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { FieldValues, useForm } from "react-hook-form";
import { BsChevronDown } from "react-icons/bs";
import { IoCloseOutline, IoCloudUploadOutline } from "react-icons/io5";
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import { toast } from "react-toastify";
import { z } from "zod";
import Spinner from "../layouts/spinner";
import "../style.css";
  interface UploadProps {
    refetchStudents: () => void;
  }
const AdmitStudents = ({refetchStudents}: UploadProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [uploadStudents, { data, error, isSuccess }] = useUploadStudentsMutation();
  
   
    const {
      isLoading: loadingClasses,
      data: classesData,
      refetch: refetchClasses,
    } = useGetClassesQuery({}, { refetchOnMountOrArgChange: true });
  
    const schema = z.object({
     
      // class_level: z.number().min(1, "Class level is required"),
      class_level: z
    .string()
    .refine((value) => value !== "", {
      message: "class is required",
    })
    .transform((value) => Number(value))
    .refine((val) => !isNaN(val) && val > 0, {
      message: "Class must be a valid class",
    }),
      admission_type: z.enum(["New Admission", "Transfer"], {
        errorMap: () => ({ message: "Select admission type" }),
      }),
      students_file: z
  .any()
  .refine((fileList) => fileList instanceof FileList && fileList.length > 0, {
    message: "Please upload a valid file",
  }),

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
  
  
    const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setValue("class", e.target.value);
    };
  
    const onSubmit = async (data: FieldValues) => {
      const { term, class_level, admission_type, students_file } = data;
  
      if (students_file && students_file instanceof FileList) {
        const formData = new FormData();
        
        formData.append("class_level", class_level);
        formData.append("admission_type", admission_type);
        formData.append("students_file", students_file[0]);
  
        try {
          const response = await uploadStudents(formData).unwrap();
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
            refetchStudents();
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
        className=" py-2 px-3 bg-green-700 cursor-pointer text-sm text-white rounded-md inline-flex items-center space-x-2 max-w-max">
              <PiMicrosoftExcelLogoFill size={20} className="text-white" />
              <span>Upload students</span>
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
                <div className="relative transform animate-fadeIn overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-4 w-full sm:max-w-2xl p-4 md:p-4 lg:p-4 md:max-w-2xl">
                  {isSubmitting && <Spinner />}
  
                  <div className="flex justify-between items-center pb-3">
                    <p className="lg:text-2xl md:text-2xl text-sm font-bold text-black">
                      Upload Students
                    </p>
                    <div className="flex justify-end cursor-pointer">
              <IoCloseOutline size={35}
              onClick={handleCloseModal}
               className=" text-gray-500 "
                />
                </div>
                  </div>
  
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
                  {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-3"> */}
                      <div>
                        <label
                          htmlFor="students_file"
                          className="block text-gray-900 md:text-lg text-sm lg:text-lg  font-normal  mb-2"
                        >
                          Excel/Csv file
                        </label>
                        <input
                          type="file"
                          id="students_file"
                          {...register("students_file")}
                          placeholder="Upload"
                          accept=".csv, .xls, .xlsx"
                          className="w-full py-2 px-4 rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
                        />
                        {errors.students_file && (
                          <p className="text-red-500 text-sm">
                            {String(errors.students_file.message)}
                          </p>
                        )}
                      </div>
                  
                  {/* </div> */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-3">
                      <div>

                      <div className="relative">
                        <label
                          htmlFor="term"
                          className="block text-gray-900 md:text-lg text-sm lg:text-lg font-normal  mb-2"
                        >
                          Class
                        </label>
                        <select
                          id="term"
                          {...register("class_level")}
                          onChange={handleClassChange}
                          className="w-full appearance-none py-2 px-4 text-sm md:text-lg lg:text-lg rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
                        >
                          {loadingClasses ? (
                            <option value="">Loading...</option>
                          ) : (
                            <>
                              <option value="">-- Select class ---</option>
                              {classesData?.map((classLevel: ClassLevel) => (
                                <option key={classLevel.id} value={classLevel.id}>
                                  {classLevel.name}{" "}
                                  {classLevel?.stream?.name} ({classLevel.calendar_year})
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
                      htmlFor="admission_type"
                      className="block text-gray-900 md:text-lg text-sm lg:text-lg  font-normal  mb-2"
                    >
                      Admission Type
                    </label>
                    <select
                      id="admission_type"
                      {...register("admission_type")}
                      className="w-full appearance-none py-2 px-4 text-sm lg:text-lg md:text-lg rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
                    >
                      <option value="">--- Select admission type ---</option>
                      <option value="New Admission">New Admission</option>
                      <option value="Transfer">Transfer</option>
                    </select>
                    <BsChevronDown 
                      color="gray" 
                      size={20}
                      className="absolute top-[70%] right-4 transform -translate-y-1/2 text-[#1F4772] pointer-events-none"
                    />
                  </div>
                    {errors.admission_type && (
                      <p className="text-red-500 text-sm">
                        {String(errors.admission_type.message)}
                      </p>
                    )}
                    </div>
                    </div>
                  <div className="flex justify-start lg:justify-end md:justify-end mt-7 py-6">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className=" inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4
                       focus:outline-none focus:ring-blue-300 font-medium  text-sm space-x-4
                       text-white rounded-md  px-5 py-2"
                    >
                      <IoCloudUploadOutline className="text-white " size={18} />
                      <span>{isSubmitting ? "Submitting..." : "Upload Students"}</span>
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

export default AdmitStudents;
  