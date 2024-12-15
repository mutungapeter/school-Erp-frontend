"use client";

import { useCreateClassMutation } from "@/redux/queries/classes/classesApi";
import { useGetFormLevelsQuery } from "@/redux/queries/formlevels/formlevelsApi";
import { useGetStreamsQuery } from "@/redux/queries/streams/streamsApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FieldValues, useForm } from "react-hook-form";
import { FaPlusCircle } from "react-icons/fa";
import { IoCloseOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import { z } from "zod";
import Spinner from "../layouts/spinner";
import "../style.css";
import { BsChevronDown } from "react-icons/bs";
import { GoPlus } from "react-icons/go";
import { formatYear, formattDate } from "@/src/utils/dates";
import { addMonths, subMonths } from "date-fns";
import { PiCalendarDotsLight } from "react-icons/pi";
interface CreateClassProps {
  refetchClasses: () => void;
}


export const CreateClassLevel = ({ refetchClasses }: CreateClassProps) => {
  const [isOpen, setIsOpen] = useState(false);
  // const [calendarYear, setCalendarYear] = useState<number>(
  //   parseInt(formatYear(new Date()))
  // );
  const {
    isLoading: loadingFormLevels,
    data: formLevelsData,
    refetch: refetchFormLevels,
  } = useGetFormLevelsQuery({}, { refetchOnMountOrArgChange: true });
  const {
    isLoading: loadingStreams,
    data: streamsData,
    refetch: refetchStreams,
  } = useGetStreamsQuery({}, { refetchOnMountOrArgChange: true });
  const [createClass, { data, error, isSuccess }] = useCreateClassMutation();
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const today = new Date();

  const schema = z.object({
    form_level: z.string().min(1, "Select a Form level"),
    stream: z.string().min(1, "Select a class").optional().or(z.literal("")),
    calendar_year: z.number().min(4, "Enter a valid year"),
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

  const onSubmit = async (data: FieldValues) => {
    const { form_level, stream, calendar_year } = data;

    console.log("formData", data);
    try {
      await createClass(data).unwrap();
      toast.success("Class added successfully!");
      handleCloseModal();
      refetchClasses()
    } catch (error:any) {
     console.log("error", error)
      if (error?.data?.error) {
        toast.error(error.data.error);
      } else {
        toast.error("Failed to add Class. Please try again.");
      }
    }
  };
  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValue("form_level", e.target.value);
  };
  const handleStreamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValue("stream", e.target.value);
  };
 

 const calendarYear = watch("calendar_year");
  const handleYearChange = (date: Date | null) => {
    const formattedDate = date ? parseInt(formatYear(date)) : undefined;
    setValue("calendar_year", formattedDate ?? null, {
      shouldValidate: true,
    });
  };
  const handleOpenModal = () => setIsOpen(true);
  const handleCloseModal = () => setIsOpen(false);
  console.log("formlevesdata", formLevelsData);
  return (
    <>
      <div
        onClick={handleOpenModal}
        className=" cursor-pointer text-center justify-center md:py-2 py-1 lg:py-2 lg:px-3 md:px-3 px-2 bg-green-700 rounded-md  flex items-center space-x-2 "
      >
        <GoPlus size={18} className="text-white   " />
        <span className=" text-xs md:text-sm lg:text-sm text-white">
          Add Class
        </span>
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
            <div className="flex min-h-screen items-start justify-center p-4 text-center sm:items-start sm:p-0">
              <div className="relative transform overflow-y-auto animate-fadeIn overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-4 w-full sm:max-w-xl p-4 md:p-5 lg:p-5 md:max-w-xl">
                {isSubmitting && <Spinner />}

                <div className="flex justify-between items-center pb-3">
                  <p className="text-sm md:text-lg lg:text-lg font-semibold text-black">
                    Add New Class
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 lg:grid-cols-2  lg:gap-5">
                    <div>

                    <div className="relative">
                      <label
                        htmlFor="form_level"
                        className="block text-gray-900 text-sm md:text-lg lg:text-lg  font-normal  mb-2"
                      >
                        Form Level
                      </label>
                      <select
                        id="form_level"
                        {...register("form_level")}
                        onChange={handleClassChange}
                        className="w-full appearance-none py-2 px-4 text-lg rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
                      >
                        {loadingFormLevels ? (
                          <option value="">Loading...</option>
                        ) : (
                          <>
                            <option value="">Select Form level</option>
                            {formLevelsData?.map((fl: any) => (
                              <option key={fl.id} value={fl.id}>
                                {fl.name}
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
                      {errors.form_level && (
                        <p className="text-red-500 text-sm">
                          {String(errors.form_level.message)}
                        </p>
                      )}
                    </div>
                    <div>

                    <div className="relative">
                      <label
                        htmlFor="stream"
                        className="block text-gray-900 text-sm md:text-lg lg:text-lg  font-normal  mb-2"
                      >
                       Stream <span className="text-gray-500 text-sm md:text-lg lg:text-lg">(Optional)</span>
                       
                      </label>
                     
                      <select
                        id="stream"
                        {...register("stream")}
                        onChange={handleStreamChange}
                        className="w-full appearance-none py-2 px-4 text-lg rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
                      >
                        {loadingStreams ? (
                          <option value="">Loading...</option>
                        ) : (
                          <>
                            <option value="">Select Stream</option>
                            {streamsData?.map((stream: any) => (
                              <option key={stream.id} value={stream.id}>
                                {stream.name}
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
                      {errors.stream && (
                        <p className="text-red-500 text-sm">
                          {String(errors.stream.message)}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="relative ">
                    <label
                      htmlFor="year"
                      className="block  text-sm  md:text-lg lg:text-lg font-normal  mb-2"
                    >
                      Calendar Year
                    </label>
                    <DatePicker
                    
                    selected={calendarYear ? new Date(calendarYear, 0, 1) : null}

                      onChange={handleYearChange}
                      showYearPicker
                      dateFormat="yyyy"
                      showIcon
                      icon={<PiCalendarDotsLight className="text-gray-currentColor" />}
                      yearDropdownItemNumber={5}
                      placeholderText="YYYY"
                      isClearable
                      className="w-full appearance-none py-2 px-4 text-lg rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
                   />
                    {errors.calendar_year && (
                      <p className="text-red-500 text-sm">
                        {String(errors.calendar_year.message)}
                      </p>
                    )}
                  </div>
                 

                  <div className="flex justify-start lg:justify-end md:justify-end mt-3 py-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className=" inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4
                       focus:outline-none focus:ring-blue-300 font-medium text-sm space-x-4
                       text-white rounded-md  px-5 py-2"
                    >
                      <span>{isSubmitting ? "Saving..." : "Save Class"}</span>
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
