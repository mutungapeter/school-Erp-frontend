"use client";
import {
  useGetTeacherQuery,
  useUpdateTeacherMutation,
} from "@/redux/queries/teachers/teachersApi";
import { useEffect, useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { useGetClassesQuery } from "@/redux/queries/classes/classesApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues, useForm } from "react-hook-form";
import { BiSolidEdit } from "react-icons/bi";
import { toast } from "react-toastify";
import { z } from "zod";
import Spinner from "../layouts/spinner";
import { BsChevronDown } from "react-icons/bs";
import "react-datepicker/dist/react-datepicker.css";
import "../style.css";
import { addMonths, subMonths } from "date-fns";
import { PiCalendarDotsLight } from "react-icons/pi";
import {
  useGetTermQuery,
  useUpdateTermMutation,
} from "@/redux/queries/terms/termsApi";
import DatePicker from "react-datepicker";
import { formattDate, formatYear } from "@/src/utils/dates";
import { IoCloseOutline } from "react-icons/io5";
interface Props {
  termId: number;
  refetchTerms: () => void;
}
const EditTerm = ({ termId, refetchTerms }: Props) => {
  console.log("termId", termId);
  const [isOpen, setIsOpen] = useState(false);
  const [updateTerm, { isLoading: Updating }] = useUpdateTermMutation();
  const { data: termData, isLoading: isFetching } = useGetTermQuery(termId);
  console.log("termData", termData)
  const {
    isLoading: loadingClassLevels,
    data: ClassLevelsData,
    refetch,
  } = useGetClassesQuery({}, { refetchOnMountOrArgChange: true });

  const schema = z.object({
    term: z.string().min(1, "Term name is required"),
    start_date: z.string().date(),
    end_date: z.string().date(),
    class_level: z.number().min(1, "Select   class "),
    
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

  useEffect(() => {
    if (termData) {
      reset({
        term: termData.term,
        class_level: termData.class_level.id,
        start_date: termData.start_date ? formattDate(new Date(termData.start_date)) : "",
        end_date: termData.end_date ? formattDate(new Date(termData.end_date)) : "",
      });
      
    }
  }, [termData, setValue]);
  const startDate = watch("start_date");
  const endDate = watch("end_date");
  
  
  const startDateAsDate = startDate ? new Date(startDate) : null;
  const endDateAsDate = endDate ? new Date(endDate) : null;
  
const handleStartDateChange = (date: Date | null) => {
    const formattedDate = date ? formattDate(date) : "";
    setValue("start_date", formattedDate ?? null, {
      shouldValidate: true,
    });
  };
  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValue("class_level", e.target.value);
  };
  const handleEndDateChange = (date: Date | null) => {
    const formatDate = date ? formattDate(date) : "";
    setValue("end_date", formatDate ?? null, { shouldValidate: true });
  };
  const onSubmit = async (data: FieldValues) => {
    const id = termId;
    try {
      await updateTerm({ id, ...data }).unwrap();
      toast.success("Term updated successfully!");
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
    // reset();
    setIsOpen(false);
  };

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
              <div className="relative transform animate-fadeIn overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-16 w-full sm:max-w-lg p-4  md:p-6 lg:p-6 md:max-w-lg">
                {isSubmitting && <Spinner />}
                {isFetching && <Spinner />}

                <div className="flex justify-between items-center pb-3">
                  <p className="text-2xl md:text-lg lg:text-lg font-semibold text-black">
                    Update Term details
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
                        value={watch("class_level") || ""}
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
                                {cl.form_level.name} {cl?.stream?.name || ""} -{" "}
                                {cl.calendar_year}
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
                      selected={startDateAsDate}
                      showIcon
                      icon={
                        <PiCalendarDotsLight className="text-gray-currentColor" />
                      }
                      onChange={(date) => handleStartDateChange(date)}
                      placeholderText="YYYY-MM-DD"
                      dateFormat="yyyy/MM/dd"
                      minDate={subMonths(new Date(), 3)}
                      maxDate={addMonths(new Date(), 12)}
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
                      // selected={endDate ? new Date(endDate) : null}
                      selected={endDateAsDate}
                      showIcon
                      icon={
                        <PiCalendarDotsLight className="text-gray-currentColor" />
                      }
                      onChange={(date) => handleEndDateChange(date)}
                      placeholderText="YYYY-MM-DD"
                      dateFormat="yyyy/MM/dd"
                      minDate={subMonths(new Date(), 3)}
                      maxDate={addMonths(new Date(), 12)}
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

                  <div className="flex justify-start lg:justify-end md:justify-end mt-7 py-6">
                    <button
                      type="submit"
                      disabled={Updating}
                      className=" inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4
                       focus:outline-none focus:ring-blue-300 font-medium  text-sm space-x-4
                       text-white rounded-md  px-5 py-2"
                    >
                      {/* <LiaEdit className="text-white " size={18} /> */}
                      <span>{Updating ? "Updating..." : "Update Term"}</span>
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
export default EditTerm;
