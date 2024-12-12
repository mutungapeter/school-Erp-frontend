"use client";
import { useForm, useFieldArray, Controller, SubmitHandler, FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { z } from "zod";
import { formattDate, formattedDate } from "@/src/utils/dates";
import DatePicker from "react-datepicker";


import { formatYear } from "@/src/utils/dates";
import { usePromoteStudentsMutation } from "@/redux/queries/students/studentsApi";
import "../../style.css";
import { IoCloseOutline } from "react-icons/io5";
import { LuRefreshCcw } from "react-icons/lu";
import Spinner from "../../layouts/spinner";
import { BsChevronDown } from "react-icons/bs";
import {
  useDeleteFormLevelsMutation,
  useGetFormLevelsQuery,
} from "@/redux/queries/formlevels/formlevelsApi";
import { FormLevel } from "@/src/definitions/formlevels";
import {
  useDeleteClassLevelsMutation,
  useGetClassesQuery,
} from "@/redux/queries/classes/classesApi";
import { ClassLevel } from "@/src/definitions/classlevels";

import { PiCalendarDotsLight } from "react-icons/pi";
import { subMonths, addMonths } from "date-fns";
type Term = {
  id: number;
  term: string;
  start_date: string;
  end_date: string;
};

type FormData = {
  source_class_level: number;
  target_form_level: number;
  next_calendar_year: number;
  terms: Term[];
};

const termsData = [
  { id: 1, term: "Term 1", start_date: "", end_date: "", },
  { id: 2, term: "Term 2", start_date: "", end_date: "", },
  { id: 3, term: "Term 3", start_date: "", end_date: "", },
];
interface Props {
  refetchStudents: () => void;
}


const PromoteStudents = ({ refetchStudents }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [calendarYear, setCalendarYear] = useState<number>(
    parseInt(formatYear(new Date()))
  );

  const {
    isLoading: loadingFormLevels,
    data: formLevelsData,
    refetch,
  } = useGetFormLevelsQuery({}, { refetchOnMountOrArgChange: true });
  const [promoteStudents, { data, error, isSuccess, isLoading: isPromoting }] =
    usePromoteStudentsMutation();
  const {
    isLoading: loadingClasses,
    data: classesData,
    refetch: refetchClasses,
  } = useGetClassesQuery({}, { refetchOnMountOrArgChange: true });

  const termsObj = z.object({
    term: z.string(),
    start_date: z.string().date(),
    end_date: z.string().date(),
  });
  const schema = z.object({
    source_class_level: z.number().min(1, "Select  current class"),
    target_form_level: z.number().min(1, "Select target Form Level"),
    next_calendar_year: z.number().min(4, "Enter a valid year"),
    terms: z.array(termsObj)
  });


  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      source_class_level: undefined,
      target_form_level: undefined,
      next_calendar_year: calendarYear,
      terms: termsData,
    },

  });
  const { fields } = useFieldArray({ control, name: "terms" });

  const handleSourceClassLevelChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    // const value = Number(e.target.value) ;
    // setValue("source_class_level", value );
    const value = parseInt(e.target.value);
    setValue("source_class_level", value ?? undefined);
  };
  const handleTargetFormLevelChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = parseInt(e.target.value);
    setValue("target_form_level", value ?? undefined);
  };




  const onSubmit = async (data: FormData) => {
    const {
      source_class_level,
      target_form_level,
      next_calendar_year,
      terms
    } = data;

    console.log("data", data);
    try {
      const response = await promoteStudents(data).unwrap();
      const successMsg = response.message || "Student Promote successfully!";
      toast.success(successMsg);
      reset();
      handleCloseModal();
      toast.success(successMsg);
    } catch (error) {
      toast.error("Failed to promote students.");
    } finally {
      refetchStudents();
    }
  };
  const nextCalendarYear = watch("next_calendar_year");
  const handleNextYearChange = (date: Date | null) => {
    const formattedDate = date ? parseInt(formatYear(date)) : undefined;
    setValue("next_calendar_year", formattedDate ?? nextCalendarYear, {
      shouldValidate: true,
    });
  };
  const handleStartDateChange = (date: Date | null, index: number) => {
    const formatDate = date ? formattDate(date) : "";
    setValue(`terms.${index}.start_date`, formatDate);
  };
  const handleEndDateChange = (date: Date | null, index: number) => {
    const formatDate = date ? formattDate(date) : "";
    setValue(`terms.${index}.end_date`, formatDate);
  };


  const handleOpenModal = () => {
    setIsOpen(true)
  };
  const handleCloseModal = () => {
    reset();
    setIsOpen(false);
  };
  return (
    <>
      <button
        className="lg:py-2 lg:px-3 md:py-2 md:px-3 py-2 px-2 lg:text-sm md:text-sm text-xs  rounded-md border bg-[#1566FF]  text-white"
        onClick={handleOpenModal}
      >
        Promote Students
      </button>

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
              <div className="relative transform animate-fadeIn overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-5 w-full sm:max-w-2xl p-4 md:p-3 lg:p-3 md:max-w-2xl">
                {isSubmitting || (isPromoting && <Spinner />)}

                <div className="flex justify-between items-center p-2">
                  <p className="text-lg md:text-lg lg:text-lg font-semibold text-black">
                    Promote Students
                  </p>
                  <div className="flex justify-end cursor-pointer">
                    <IoCloseOutline
                      size={28}
                      onClick={handleCloseModal}
                      className=" text-gray-500 "
                    />
                  </div>
                </div>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="lg:p-2 md:p-2 p-1 space-y-2"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-2 gap-2 lg:gap-3">
                    <div className="relative">
                      <label
                        htmlFor="cource-class-level"
                        className="block text-gray-900 md:text-lg text-sm lg:text-lg  font-normal  mb-2"
                      >
                        Current class
                      </label>
                      <select
                        {...register("source_class_level", {
                          valueAsNumber: true,
                        })}
                        onChange={handleSourceClassLevelChange}
                        className="w-full appearance-none p-2 text-sm rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
                      >
                        <option value="">Select Source Class</option>
                        {classesData?.map((class_level: ClassLevel) => (
                          <option key={class_level.id} value={class_level.id}>
                            {class_level.form_level.name}{" "}
                            {class_level?.stream?.name || ""}
                          </option>
                        ))}
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
                        htmlFor="target-form-level"
                        className="block text-gray-900 md:text-lg text-sm lg:text-lg  font-normal  mb-2"
                      >
                        Target Form Level
                      </label>
                      <select
                        {...register("target_form_level", {
                          valueAsNumber: true,
                        })}
                        onChange={handleTargetFormLevelChange}
                        className="w-full appearance-none p-2 text-sm rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
                      >
                        <option value="">Select Target Form Level</option>
                        {formLevelsData?.map((level: FormLevel) => (
                          <option key={level.id} value={level.id}>
                            {level.level}
                          </option>
                        ))}
                      </select>
                      <BsChevronDown
                        color="gray"
                        size={20}
                        className="absolute top-[70%] right-4 transform -translate-y-1/2 text-[#1F4772] pointer-events-none"
                      />
                      {errors.target_form_level && (
                        <p className="text-red-500 text-sm">
                          {String(errors.target_form_level.message)}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="relative">
                    <label
                      htmlFor="calendar-year"
                      className="block text-gray-900 md:text-lg text-sm lg:text-lg  font-normal  mb-2"
                    >
                      Calendar Year
                    </label>

                    <DatePicker
                      selected={nextCalendarYear ? new Date(nextCalendarYear, 0, 1) : null}
                      onChange={handleNextYearChange}
                      showYearPicker
                      dateFormat="yyyy"
                      showIcon
                      icon={<PiCalendarDotsLight className="text-gray-currentColor" />}
                      yearDropdownItemNumber={5}
                      placeholderText="YYYY"
                      isClearable
                      className="w-full appearance-none py-2 px-4 text-lg rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
                    />
                    {errors.next_calendar_year && (
                      <p className="text-red-500 text-sm">
                        {String(errors.next_calendar_year.message)}
                      </p>
                    )}

                  </div>

                  <div className="space-y-2">
                    <h2 className="block text-black md:text-lg text-sm lg:text-lg  font-semibold">
                      Set the start date and end date for Terms for class you are promoting
                      the students to.
                    </h2>
                    {/* {termsData.map((term: any, index: number) => (

                      <div key={index} className="">
                        <label className="block">{term.term}</label>
                        <div className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-2 gap-2 lg:gap-5">
                          <div className="relative">
                            <DatePicker
                              className="w-full appearance-none py-2 px-4 text-lg rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
                              selected={
                                watch(`terms.${index}.start_date`)
                                  ? new Date(watch(`terms.${index}.start_date`))
                                  : null
                              }
                              showIcon
                              icon={
                                <PiCalendarDotsLight className="text-gray-currentColor" />
                              }
                              onChange={(date) =>
                                handleStartDateChange(date, index)
                              }
                              placeholderText="YYYY-MM-DD"
                              dateFormat="yyyy/MM/dd"
                              minDate={subMonths(new Date(), 3)}
                              maxDate={addMonths(new Date(), 12)}
                              showMonthYearDropdown
                              fixedHeight
                              isClearable
                            />

                            
                            {errors.terms && errors?.terms[index] && (
                              <p className="text-sm text-red-500">
                                {String(
                                  (errors as any).terms[index].start_date?.message
                                )}
                              </p>
                            )}
                          </div>
                          <div className="relative">
                            <DatePicker
                              className="w-full appearance-none py-2 px-4 text-lg rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"

                              selected={
                                watch(`terms.${index}.end_date`)
                                  ? new Date(watch(`terms.${index}.end_date`))
                                  : null
                              }
                              showIcon
                              onChange={(date) =>
                                handleEndDateChange(date, index)
                              }
                              icon={
                                <PiCalendarDotsLight className="text-gray-currentColor" />
                              }
                              placeholderText="YYYY-MM-DD"
                              dateFormat="yyyy/MM/dd"
                              minDate={subMonths(new Date(), 3)}
                              maxDate={addMonths(new Date(), 12)}
                              showMonthYearDropdown
                              fixedHeight
                              isClearable
                            />
                            {errors.terms && errors?.terms[index] && (
                              <p className="text-sm text-red-500">
                                {String(
                                  (errors as any).terms[index].end_date?.message
                                )}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))} */}
                    {fields.map((field, index) => (
                      <div key={field.id}>

                        <label className="block mb-2 text-gray-900 font-normal text-sm">
                          {field.term}
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-2 gap-2 lg:gap-5">
                          <div className="relative">
                            <Controller
                              name={`terms.${index}.start_date`}
                              control={control}
                              render={({ field: { value, onChange } }) => (
                                <DatePicker
                                  selected={value ? new Date(value) : null}
                                  onChange={(date) => onChange(date ? formattDate(date) : "")}
                                  dateFormat="yyyy-MM-dd"
                                  showIcon
                                  minDate={subMonths(new Date(), 3)}
                                  maxDate={addMonths(new Date(), 12)}
                                  showMonthYearDropdown
                                  fixedHeight
                                  isClearable
                                  icon={
                                    <PiCalendarDotsLight className="text-gray-currentColor" />
                                  }
                                  placeholderText="Start date"
                                  className="w-full p-2 rounded-md border border-gray-400 focus:outline-none focus:border-[#1E9FF2]"
                                />
                              )}
                            />
                            {errors.terms?.[index]?.start_date && (
                              <p className="text-red-500 text-sm">
                                {String(errors.terms[index]?.start_date?.message)}
                              </p>
                            )}
                          </div>

                          <div className="relative">
                            <Controller
                              name={`terms.${index}.end_date`}
                              control={control}
                              render={({ field: { value, onChange } }) => (
                                <DatePicker
                                  selected={value ? new Date(value) : null}
                                  onChange={(date) => onChange(date ? formattDate(date) : "")}
                                  dateFormat="yyyy-MM-dd"
                                  showIcon
                                  minDate={subMonths(new Date(), 3)}
                                  maxDate={addMonths(new Date(), 60)}
                                  showMonthYearDropdown
                                  fixedHeight
                                  isClearable
                                  icon={
                                    <PiCalendarDotsLight className="text-gray-currentColor" />
                                  }
                                  placeholderText="End date"
                                  className="w-full p-2 rounded-md border border-gray-400 focus:outline-none focus:border-[#1E9FF2]"
                                />
                              )}
                            />
                            {errors.terms?.[index]?.end_date && (
                              <p className="text-red-500 text-sm">
                                {String(errors.terms[index]?.end_date?.message)}
                              </p>
                            )}
                          </div>
                        </div>



                      </div>
                    ))}

                  </div>

                  <div className="flex justify-start lg:justify-end md:justify-end mt-0 py-2">
                    <button
                      type="submit"
                      disabled={isSubmitting || isPromoting}
                      className="text-white  inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4
                       focus:outline-none focus:ring-blue-300 font-medium  text-sm space-x-4
                       rounded-md  px-5 py-2"
                    >
                      <LuRefreshCcw className="text-white " size={18} />
                      <span>{isSubmitting || isPromoting
                        ? "Promoting..."
                        : "Promote Students"}</span>
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
