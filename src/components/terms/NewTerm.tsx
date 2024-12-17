"use client";
import { useState } from "react";

import { useCreateTermMutation } from "@/redux/queries/terms/termsApi";
import { zodResolver } from "@hookform/resolvers/zod";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FieldValues, useForm } from "react-hook-form";
import { BsChevronDown } from "react-icons/bs";
import { toast } from "react-toastify";
import { z } from "zod";
import Spinner from "../layouts/spinner";
import "../style.css";
import { addMonths, subMonths } from "date-fns";
import { PiCalendarDotsLight } from "react-icons/pi";
import { FaPlusCircle } from "react-icons/fa";
import { IoCloseOutline } from "react-icons/io5";
import { formattDate } from "@/src/utils/dates";
import { useGetClassesQuery } from "@/redux/queries/classes/classesApi";
interface Props {
  refetchTerms: () => void;
}
const CreateTerm = ({ refetchTerms }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const [
    createTerm,
    {
      data,
      error,
      isLoading: isCreating,
      isSuccess,
      isError,
      reset: resetMutation,
    },
  ] = useCreateTermMutation();
  const {
    isLoading: loadingClassLevels,
    data: ClassLevelsData,
    refetch,
  } = useGetClassesQuery({}, { refetchOnMountOrArgChange: true });
 

  const schema = z.object({
    term: z.enum(["Term 1", "Term 2", "Term 3"], {
      required_error: "Term is required",
    }),
    class_level: z.number().min(1, "Select   class "),
    start_date: z.string().date(),
    end_date: z.string().date(),
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  
  const handleClassChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setValue("class_level", e.target.value);
  };
  const startDate = watch("start_date");
  const endDate = watch("end_date");

  const handleStartDateChange = (date: Date | null) => {
    const formattedDate = date ? formattDate(date) : "";
    setValue("start_date", formattedDate ?? null, {
      shouldValidate: true,
    });
  };
  const handleEndDateChange = (date: Date | null) => {
    const formatDate = date ? formattDate(date) : "";
    setValue("end_date", formatDate, { shouldValidate: true });
  };
  const onSubmit = async (data: FieldValues) => {
    const { term } = data;

    try {
      await createTerm(data).unwrap();
      toast.success("Term Created successfully!");
      handleCloseModal();
      refetchTerms();
    } catch (error: any) {
      if (error?.data?.error) {
        console.log("error", error);
        toast.error(error.data.error);
      }
    }
  };

  const handleOpenModal = () => setIsOpen(true);
  const handleCloseModal = () => {
    reset();
    setIsOpen(false);
  };

  return (
    <>
      <div
        onClick={handleOpenModal}
        className=" cursor-pointer text-center justify-center px-2 py-2 md:py-2 md:px-4 lg:py-2 lg:px-4 bg-green-700 rounded-md  flex items-center space-x-2 "
      >
        <FaPlusCircle size={17} className="text-white   " />
        <span className=" lg:text-sm md:text-sm text-xs text-white">
          New Term
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
            <div className="flex min-h-full items-start justify-center p-4 text-center sm:items-start sm:p-0">
              <div className="relative transform animate-fadeIn overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 w-full sm:max-w-lg p-4  md:p-6 lg:p-6 md:max-w-lg">
                {isSubmitting && <Spinner />}

                <div className="flex justify-between items-center pb-3">
                  <p className="text-2xl md:text-lg lg:text-lg font-semibold text-black">
                    Add New Term
                  </p>
                  <div className="flex justify-end cursor-pointer">
                    <IoCloseOutline
                      size={35}
                      onClick={handleCloseModal}
                      className=" text-gray-500 "
                    />
                  </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>

                 
                  <div className="relative">
                    <label
                      htmlFor="Term"
                      className="block text-gray-900 md:text-lg text-sm lg:text-lg  font-normal  mb-2"
                    >
                      Term
                    </label>
                    <select
                      id="term"
                      {...register("term")}
                      className="w-full appearance-none p-2 text-sm md:text-lg lg:text-lg rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
                    >
                      <option value="">Term</option>
                      <option value="Term 1">Term 1</option>
                      <option value="Term 2">Term 2</option>
                      <option value="Term 3">Term 3</option>
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
                  <div>
                  <div className="relative">
                      <label
                        htmlFor="class_level"
                        className="block  text-sm  font-normal mb-2 uppercase"
                      >
                       CLass
                      </label>
                      <select
                        id="class_level"
                        {...register("class_level", {
                          valueAsNumber: true,
                        })}
                        onChange={handleClassChange}
                        className="w-full appearance-none py-2 px-4 text-lg rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
                      >
                        {loadingClassLevels ? (
                          <option value="">Loading...</option>
                        ) : (
                          <>
                            <option value="">Select current class</option>
                            {ClassLevelsData?.map((cl: any) => (
                              <option key={cl.id} value={cl.id}>
                                {cl.form_level.name} {cl?.stream?.name || ""} - {cl.calendar_year}
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
                      {errors.class_level && (
                        <p className="text-red-500 text-sm">
                          {String(errors.class_level.message)}
                        </p>
                      )}
                  </div>
                  <div className="relative">
                    <label
                      htmlFor="start_date"
                      className="block  text-sm  md:text-lg lg:text-lg font-normal  mb-2"
                    >
                      Start Date
                    </label>
                    <DatePicker
                      className="w-full appearance-none py-2 px-4 text-lg rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
                      selected={startDate ? new Date(startDate) : null}
                      showIcon
                      icon={
                        <PiCalendarDotsLight className="text-gray-currentColor" />
                      }
                      onChange={(date) => handleStartDateChange(date)}
                      placeholderText="YYYY-MM-DD"
                      dateFormat="yyyy/MM/dd"
                      minDate={subMonths(new Date(), 12)}
                      maxDate={addMonths(new Date(), 24)}
                      showMonthYearDropdown
                      fixedHeight
                      isClearable
                      portalId="root-portal"
                      withPortal
                    />

                    {errors.start_date && (
                      <p className="text-sm text-red-500">
                        {String(errors.start_date?.message)}
                      </p>
                    )}
                  </div>
                  <div className="relative">
                    <label
                      htmlFor="end_date"
                      className="block  text-sm  md:text-lg lg:text-lg font-normal  mb-2"
                    >
                      End Date
                    </label>
                    <DatePicker
                      className="w-full appearance-none py-2 px-4 text-lg rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
                      selected={endDate ? new Date(endDate) : null}
                      showIcon
                      icon={
                        <PiCalendarDotsLight className="text-gray-currentColor" />
                      }
                      onChange={(date) => handleEndDateChange(date)}
                      placeholderText="YYYY-MM-DD"
                      dateFormat="yyyy/MM/dd"
                      minDate={subMonths(new Date(), 12)}
                      maxDate={addMonths(new Date(), 24)}
                      withPortal
                      portalId="root-portal"
                      showMonthYearDropdown
                      fixedHeight
                      isClearable
                    />

                    {errors.start_date && (
                      <p className="text-sm text-red-500">
                        {String(errors.start_date?.message)}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-start lg:justify-end md:justify-end mt-2 py-3">
                    <button
                      type="submit"
                      disabled={isCreating}
                      className=" inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4
                       focus:outline-none focus:ring-blue-300 font-medium  text-sm space-x-4
                       text-white rounded-md  px-5 py-2"
                    >
                      {/* <LiaEdit className="text-white " size={18} /> */}
                      <span>{isCreating ? "Saving..." : "Save Term"}</span>
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
export default CreateTerm;
