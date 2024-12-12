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

interface CreateClassProps {
  refetchClasses: () => void;
}

interface Term {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
}

const termsData = [
  { id: 1, name: "Term 1" },
  { id: 2, name: "Term 2" },
  { id: 3, name: "Term 3" },
];
export const CreateClassLevel = ({ refetchClasses }: CreateClassProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState<Date | null>(new Date());
  const [selectedTerms, setSelectedTerms] = useState<
    Record<number, { start_date: Date | null; end_date: Date | null }>
  >({});
  const [activeTerm, setActiveTerm] = useState<number | null>(null);

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
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FieldValues) => {
    const { form_level, stream, calendar_year } = data;
    const formattedTerms = Object.entries(selectedTerms).map(
      ([termId, termDates]) => ({
        term:
          termsData.find((term) => term.id === parseInt(termId))?.name || "",
        start_date: termDates.start_date
          ? formattDate(termDates.start_date)
          : "",
        end_date: termDates.end_date ? formattDate(termDates.end_date) : "",
      })
    );
    const formData = {
      ...data,
      terms: formattedTerms,
    };
    console.log("formData", formData);
    try {
      await createClass(formData).unwrap();
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
  const handleYearChange = (date: Date | null) => {
    setSelectedDate(date);
    const formattedDate = date ? Number(formatYear(date)) : null;
    setValue("calendar_year", formattedDate, { shouldValidate: true });
  };

  const handleTermSelect = (termId: number) => {
    setActiveTerm((prev) => (prev === termId ? null : termId));
  };

  const handleDateChange =
    (termId: number, field: "start_date" | "end_date") =>
    (date: Date | null) => {
      setSelectedTerms((prev) => ({
        ...prev,
        [termId]: {
          ...prev[termId],
          [field]: date ? formattDate(date) : null,
        },
      }));
    };

  const isTermSelected = (termId: number) =>
    !!selectedTerms[termId] && activeTerm === termId;

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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 lg:grid-cols-2 gap-2 lg:gap-5">
                    <div className="relative">
                      <label
                        htmlFor="form_level"
                        className="block text-gray-900 text-sm  font-normal  mb-2"
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
                      {errors.form_level && (
                        <p className="text-red-500 text-sm">
                          {String(errors.form_level.message)}
                        </p>
                      )}
                    </div>
                    <div className="relative">
                      <label
                        htmlFor="stream"
                        className="block text-gray-900 text-sm  font-normal  mb-2"
                      >
                        Stream
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
                      className="block  text-sm  font-normal  mb-2"
                    >
                      Calendar Year
                    </label>
                    <DatePicker
                      selected={selectedYear}
                      onChange={handleYearChange}
                      showYearPicker
                      dateFormat="yyyy"
                      className="py-2 px-4 rounded-md  mt-2 border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm w-full"
                    />
                    {errors.calendar_year && (
                      <p className="text-red-500 text-sm">
                        {String(errors.calendar_year.message)}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block font-semibold text-sm  mb-3">
                      Select Start dates and End dates for your academic year
                      for this class.(The dates can be updated later if changes)
                    </label>
                    {termsData.map((term) => (
                      <div key={term.id} className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`term-${term.id}`}
                            checked={!!selectedTerms[term.id]}
                            onChange={() => {
                              setSelectedTerms((prev) => {
                                if (prev[term.id]) {
                                  const { [term.id]: removed, ...rest } = prev;
                                  return rest;
                                } else {
                                  return {
                                    ...prev,
                                    [term.id]: {
                                      start_date: null,
                                      end_date: null,
                                    },
                                  };
                                }
                              });
                            }}
                          />
                          <label
                            htmlFor={`term-${term.id}`}
                            className="cursor-pointer"
                            onClick={() => handleTermSelect(term.id)}
                          >
                            {term.name}
                          </label>
                        </div>

                        {selectedTerms[term.id] && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 lg:grid-cols-2 gap-2 lg:gap-5">
                            <div className="relative w-full ">
                              <label
                                htmlFor="start_date"
                                className="text-sm block mb-2 text-sm"
                              >
                                Start Date
                              </label>
                              <DatePicker
                                id="start_date"
                                selected={
                                  selectedTerms[term.id]?.start_date || null
                                }
                                onChange={handleDateChange(
                                  term.id,
                                  "start_date"
                                )}
                                className="p-2 border border-gray-300 rounded-md w-full text-sm focus:outline-none focus:ring-0"
                                placeholderText="YYYY-MM-DD"
                              />
                            </div>
                            <div className="relative w-full">
                              <label
                                htmlFor="end_date"
                                className="text-sm block mb-2 text-sm"
                              >
                                End Date
                              </label>
                              <DatePicker
                                id="end_date"
                                selected={
                                  selectedTerms[term.id]?.end_date || null
                                }
                                onChange={handleDateChange(term.id, "end_date")}
                                className="p-2 border border-gray-300 rounded-md w-full text-sm placeholder:text-sm focus:outline-none focus:ring-0"
                                placeholderText="YYYY-MM-DD"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-start lg:justify-end md:justify-end mt-3 py-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4
                       focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm space-x-4
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
