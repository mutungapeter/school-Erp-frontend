"use client";
import { useEffect, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  useGetCLassLevelQuery,
  useUpdateClassLevelMutation,
} from "@/redux/queries/classes/classesApi";
import { useGetFormLevelsQuery } from "@/redux/queries/formlevels/formlevelsApi";
import { useGetStreamsQuery } from "@/redux/queries/streams/streamsApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues, useForm } from "react-hook-form";
import { BiSolidEdit } from "react-icons/bi";
import { toast } from "react-toastify";
import { z } from "zod";
import Spinner from "../layouts/spinner";
import { BsChevronDown } from "react-icons/bs";
import { formatYear } from "@/src/utils/dates";
import { PiCalendarDotsLight } from "react-icons/pi";
interface Props {
  classLevelId: number;
  refetchClassLevels: () => void;
}
const EditClassLevel = ({ classLevelId, refetchClassLevels }: Props) => {
  console.log("classLevelId", classLevelId);
  const [isOpen, setIsOpen] = useState(false);
  const [updateClassLevel, { isLoading: Updating }] =
    useUpdateClassLevelMutation();
  const { data: classData, isLoading: isFetching } =
    useGetCLassLevelQuery(classLevelId);
  const { data: formLevelsData, isLoading: isLoadingFormLevels } =
    useGetFormLevelsQuery({});
  const { data: streamsData, isLoading: isLoadingStreams } = useGetStreamsQuery(
    {}
  );

  const schema = z.object({
    name: z.string().min(1, "Name is required"),
    level: z.coerce.number().min(1, "Level is required"),
    stream: z.string().nullable().optional(),
    calendar_year: z.number().min(4, "Enter a valid year"),
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
    if (classData) {
      reset({
        name: classData.name,
        level: classData.level,
        stream: classData?.stream?.id || null,
        calendar_year: classData?.calendar_year
      })
    }
  }, [classData, setValue]);
  console.log("data", classData);
  const handleOpenModal = () => setIsOpen(true);
  const handleCloseModal = () => setIsOpen(false);


  const onSubmit = async (data: FieldValues) => {
    const id = classLevelId;
    try {
      await updateClassLevel({ id, ...data }).unwrap();
      toast.success("Class Level updated successfully!");
      handleCloseModal();
      refetchClassLevels();
    } catch (error: any) {
      if (error?.data?.error) {
        console.log("error", error);
        toast.error(error.data.error);
      }
    }
  };
 
  const handleStreamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValue("stream", e.target.value);
  };
  const calendarYear = watch("calendar_year");
  const calendarYearAsDate = calendarYear ? new Date(calendarYear, 0, 1) : null;

  const handleYearChange = (date: Date | null) => {
    const formattedDate = date ? parseInt(formatYear(date)) : undefined;
    setValue("calendar_year", formattedDate ?? null, {
      shouldValidate: true,
    });
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
              <div className="relative transform animate-fadeIn overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 w-full sm:max-w-lg p-4 md:p-6 lg:p-6 md:max-w-lg">
                {isSubmitting && <Spinner />}

                <div className="flex justify-between items-center pb-3">
                  <p className="text-sm md:text-2xl lg:text-2xl font-semibold text-black">
                    Update Class  details
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
                    <label
                      htmlFor="Name"
                      className="block text-gray-900 md:text-lg text-sm lg:text-lg  font-normal  mb-2"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="Name"
                      placeholder="name e.g Class One, Grade One , Form One "
                      {...register("name")}
                      className="w-full py-2 px-4 rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm">
                        {String(errors.name.message)}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="Name"
                      className="block text-gray-900 md:text-lg text-sm lg:text-lg  font-normal  mb-2"
                    >
                      Grade/Level
                    </label>
                    <input
                      type="text"
                      id="level"
                      placeholder="name e.g Form One , Form Two"
                      {...register("level")}
                      className="w-full py-2 px-4 rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
                    />
                    {errors.level && (
                      <p className="text-red-500 text-sm">
                        {String(errors.level.message)}
                      </p>
                    )}
                  </div>
                  </div>
                  <div>
                    <div className="relative">
                      <label
                        htmlFor="stream"
                        className="block text-gray-900 md:text-lg text-sm lg:text-lg  font-normal  mb-2"
                      >
                       Stream <span className="text-gray-500 text-sm md:text-lg lg:text-lg">(Optional)</span>
                       
                      </label>
                      <select
                        id="stream"
                        {...register("stream", { valueAsNumber: true })}
                        onChange={handleStreamChange}
                        value={watch("stream") || null}
                        className="w-full appearance-none py-2 px-4 text-lg rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
                      >
                        {isLoadingStreams ? (
                          <option value="">Loading...</option>
                        ) : (
                          <>
                            <option value="">Select Stream</option>
                            {streamsData?.map((form: any) => (
                              <option
                                key={form.id}
                                value={form.id}
                              >
                                {form.name}
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
                  <div>
                    <div className="relative ">
                      <label
                        htmlFor="year"
                        className="block  text-sm  md:text-lg lg:text-lg font-normal  mb-2"
                      >
                        Calendar Year
                      </label>
                      <DatePicker
                        selected={calendarYearAsDate}
                        onChange={handleYearChange}
                        showYearPicker
                        dateFormat="yyyy"
                        showIcon
                        icon={
                          <PiCalendarDotsLight className="text-gray-currentColor" />
                        }
                        yearDropdownItemNumber={5}
                        placeholderText="YYYY"
                        isClearable
                        className="w-full appearance-none py-2 px-4 text-lg rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
                      />
                    </div>
                    {errors.calendar_year && (
                      <p className="text-red-500 text-sm">
                        {String(errors.calendar_year.message)}
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
                      <span>{Updating ? "Updating..." : "Update Class"}</span>
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
export default EditClassLevel;
