"use client";
import { LuBookOpenCheck } from "react-icons/lu";
import { IoMdArrowDropdown } from "react-icons/io";
import { toast } from "react-toastify";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import "../../style.css";
import { FieldValues, useForm } from "react-hook-form";
import { useGetClassesQuery } from "@/redux/queries/classes/classesApi";
import Spinner from "../../layouts/spinner";
import { usePromoteStudentsMutation } from "@/redux/queries/students/studentsApi";
import DatePicker from "react-datepicker";
import { formatYear } from "@/src/utils/dates";

import { HiChevronDown } from "react-icons/hi2";
import { BsChevronDown } from "react-icons/bs";
import { useGetActiveTermsQuery } from "@/redux/queries/terms/termsApi";

interface Props {
  refetchStudents: () => void;
}
const PromoteStudents = ({ refetchStudents }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const {
    isLoading: loadingClassLevels,
    data: ClassLevelsData,
    refetch,
  } = useGetClassesQuery({}, { refetchOnMountOrArgChange: true });
  const schema = z.object({
    source_class_level: z.number().min(1, "Select  current class"),
    target_class_level: z.number().min(1, "Select target class"),
    year: z.number().min(4, "Enter a valid year"),
    current_term: z.number().min(1, "Current term is required"),
  });
  const [promoteStudents, { data, error, isSuccess }] = usePromoteStudentsMutation();
    const {
      isLoading: loadingTerms,
      data: termsData,
      refetch: refetchTerms,
    } = useGetActiveTermsQuery({}, { refetchOnMountOrArgChange: true });
   
  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: zodResolver(schema),
  });
  const handleCurrentClassChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setValue("source_class_level", e.target.value);
  };
  const handleTargetClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValue("target_class_level", e.target.value);
  };
  const handleTermChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValue("current_term", e.target.value);
  };
  const onSubmit = async (data: FieldValues) => {
    const { source_class_level, target_class_level, year, current_term } = data;
    try {
      const response = await promoteStudents(data).unwrap();
      const successMsg = response.message || "Student Promote successfully!";
      toast.success(successMsg);
      handleCloseModal();
      refetchStudents();
    } catch (error: any) {
      if (error?.data?.error) {
        toast.error(error.data.error);
      } else {
        toast.error("Failed to add Student. Please try again.");
      }
    }
  };

  const handleOpenModal = () => setIsOpen(true);
  const handleCloseModal = () => setIsOpen(false);
  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    const formattedDate = date ? Number(formatYear(date)) : null;
    setValue("year", formattedDate, { shouldValidate: true }); 
  };
  
  return (
    <>
      <button
        className="lg:py-2 lg:px-4 md:py-2 md:px-4 py-2 px-2 lg:text-lg md:text-lg text-xs  rounded-sm border bg-[#1566FF]  text-white"
        onClick={handleOpenModal}
      >
        Promote Students
      </button>
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
              <p className="text-2xl md:text-lg lg:text-lg font-semibold text-black">
                  Promote Students
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 lg:grid-cols-2 gap-2 lg:gap-5">
                  <div className="relative">
                    <label
                      htmlFor="class_level"
                      className="block  text-sm  font-normal mb-2 uppercase"
                    >
                      From
                    </label>
                    <select
                      id="class_level"
                      {...register("source_class_level", {
                        valueAsNumber: true,
                      })}
                      onChange={handleCurrentClassChange}
                      className="w-full appearance-none py-2 px-4 text-lg rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
                    >
                      {loadingClassLevels ? (
                        <option value="">Loading...</option>
                      ) : (
                        <>
                          <option value="">Select current class</option>
                          {ClassLevelsData?.map((cl: any) => (
                            <option key={cl.id} value={cl.id}>
                              {cl.form_level.name} {cl?.stream?.name || ""}
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
                    {errors.source_class_level && (
                      <p className="text-red-500 text-sm">
                        {String(errors.source_class_level.message)}
                      </p>
                    )}
                  </div>
                  <div className="relative">
                    <label
                      htmlFor="class_level"
                      className="block  text-sm  font-normal mb-2"
                    >
                      TO
                    </label>
                    <select
                      id="class_level"
                      {...register("target_class_level", {
                        valueAsNumber: true,
                      })}
                      onChange={handleTargetClassChange}
                      className="w-full appearance-none py-2 px-4 text-lg rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
                    >
                      {loadingClassLevels ? (
                        <option value="">Loading...</option>
                      ) : (
                        <>
                          <option value="">Select target class</option>
                          {ClassLevelsData?.map((cl: any) => (
                            <option key={cl.id} value={cl.id}>
                              {cl.form_level.name} {cl?.stream?.name || ""}
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
                    {errors.target_class_level && (
                      <p className="text-red-500 text-sm">
                        {String(errors.target_class_level.message)}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 lg:grid-cols-2 gap-2 lg:gap-5">
                <div className="relative">
                      <label
                        htmlFor="term"
                        className="block text-gray-900 md:text-lg text-sm lg:text-lg  font-normal  mb-2"
                      >
                        Term
                      </label>
                      <select
                        id="term"
                        {...register("current_term", { valueAsNumber: true })}
                        onChange={handleTermChange}
                        className="w-full appearance-none py-2 px-4 text-sm md:text-md lg:text-md rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
                      >
                        {loadingTerms ? (
                          <option value="">Loading...</option>
                        ) : (
                          <>
                            <option value="">Term</option>
                            {termsData?.map((term: any) => (
                              <option key={term.id} value={term.id}>
                                {term.term} {term?.calendar_year}
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
                      {errors.current_term && (
                        <p className="text-red-500 text-sm">
                          {String(errors.current_term.message)}
                        </p>
                      )}
                    </div>
                <div className="relative ">
                <label
                  htmlFor="year"
                  className="block  text-sm  font-normal  mb-2"
                >
                  YEAR(year the student is getting promoted to)
                </label>
                <DatePicker
                  selected={selectedDate}
                  onChange={handleDateChange}
                  showYearPicker
                  dateFormat="yyyy"
                  className="py-2 px-4 rounded-md  mt-2 border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm w-full"
                />
                {errors.year && (
                    <p className="text-red-500 text-sm">
                      {String(errors.year.message)}
                    </p>
                  )}
                </div>
</div>
                <div className="flex justify-between mt-10">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="bg-gray-400 text-white rounded-md py-2 px-3 md:px-6 md:py-3 lg:px-6 lg:py-3 hover:bg-gray-500 focus:outline-none"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[#36A000] text-white rounded-md py-2 px-3 md:px-6 md:py-3 lg:px-6 lg:py-3 hover:bg-[#36A000] focus:outline-none"
                  >
                    {isSubmitting ? "Promoting..." : "Promote"}
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
export default PromoteStudents;
