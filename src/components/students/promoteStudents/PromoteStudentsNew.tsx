"use client";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { z } from "zod";
import { formatYear } from "@/src/utils/dates";
import { usePromoteStudentsMutation } from "@/redux/queries/students/studentsApi";
import { BsChevronDown } from "react-icons/bs";
import { IoCloseOutline } from "react-icons/io5";
import { LuRefreshCcw } from "react-icons/lu";
import Spinner from "../../layouts/spinner";
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

const termsData = [
  { term: "Term 1", start_date: "", end_date: "" },
  { term: "Term 2", start_date: "", end_date: "" },
  { term: "Term 3", start_date: "", end_date: "" },
];

interface Props {
  refetchStudents: () => void;
}
interface FormData {
    source_class_level: number;
    target_form_level: number;
    next_calendar_year: number;
    terms: {
      term: string;
      start_date: string;
      end_date: string;
    }[];
  }
const PromoteStudents = ({ refetchStudents }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [currentYear, setCurrentYear] = useState<number>(
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
  const schema = z.object({
    source_class_level: z.number().min(1, "Select  current class"),
    target_form_level: z.number().min(1, "Select target Form Level"),
    next_calendar_year: z.number().min(4, "Enter a valid year"),
    terms: z.array(
        z.object({
          term: z.string(),
          start_date: z.string().nonempty("Start date is required"),
          end_date: z.string().nonempty("End date is required"),
        })
      ),
  });
  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
        source_class_level: 0, 
        target_form_level: 0, 
        next_calendar_year: currentYear, 
        terms: termsData.map(term => ({
          term: term.term,
          start_date: '',
          end_date: '',
        })),
      },
  });
  //   useEffect(() => {
  //     setValue("next_calendar_year", parseInt(formatYear(new Date())));
  //   }, [setValue]);

  const handleSourceClassLevelChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = Number(e.target.value);
    setValue("source_class_level", value);
  };
  const handleTargetFormLevelChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = Number(e.target.value);
    setValue("target_form_level",value);
  };
  //   const handleDateChange = (date: Date | null) => {

  //     const formattedDate = date ? Number(formatYear(date)) : null;
  //     setValue("calendar_year", formattedDate, { shouldValidate: true });
  //   };
  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newYear = parseInt(e.target.value);
    if (newYear >= 4) {
      setCurrentYear(newYear);
      setValue("next_calendar_year", newYear);
    }
  };
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const { source_class_level, target_form_level, next_calendar_year, terms } =
      data;
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
  const handleOpenModal = () => setIsOpen(true);
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
              <div className="relative transform animate-fadeIn overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 w-full sm:max-w-2xl p-4 md:p-6 lg:p-6 md:max-w-2xl">
                {isSubmitting || (isPromoting && <Spinner />)}

                <div className="flex justify-between items-center pb-3">
                  <p className="text-2xl md:text-lg lg:text-lg font-semibold text-black">
                    Promote Students to the next class
                  </p>
                  <div className="flex justify-end cursor-pointer">
                    <IoCloseOutline
                      size={35}
                      onClick={handleCloseModal}
                      className=" text-gray-500 "
                    />
                  </div>
                </div>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="p-4 space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 lg:grid-cols-2 gap-2 lg:gap-5">
                    <div className="mb-4">
                      <label className="block mb-2">Source Class Level</label>
                      <select
                        {...register("source_class_level", {
                          valueAsNumber: true,
                        })}
                        onChange={handleSourceClassLevelChange}
                        className="w-full border p-2"
                      >
                        <option value="">Select Source Class</option>
                        {classesData?.map((class_level: ClassLevel) => (
                          <option key={class_level.id} value={class_level.id}>
                            {class_level.form_level.name}{" "}
                            {class_level?.stream?.name || ""}
                          </option>
                        ))}
                      </select>
                      {errors.source_class_level && (
                        <p className="text-red-500 text-sm">
                          {String(errors.source_class_level.message)}
                        </p>
                      )}
                    </div>

                    <div className="mb-4">
                      <label className="block mb-2">Target Form Level</label>
                      <select
                        {...register("target_form_level", {
                          valueAsNumber: true,
                        })}
                        onChange={handleTargetFormLevelChange}
                        className="w-full border p-2"
                      >
                        <option value="">Select Target Form Level</option>
                        {formLevelsData?.map((level: FormLevel) => (
                          <option key={level.id} value={level.id}>
                            {level.name}
                          </option>
                        ))}
                      </select>
                      {errors.target_form_level && (
                        <p className="text-red-500 text-sm">
                          {String(errors.target_form_level.message)}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block mb-2">Next Calendar Year</label>
                    <input
                      {...register("next_calendar_year", {
                        valueAsNumber: true,
                      })}
                      type="number"
                      value={currentYear}
                      onChange={handleYearChange}
                      className="w-full border p-2"
                      placeholder="Enter next calendar year"
                    />
                    {errors.next_calendar_year && (
                      <p className="text-red-500 text-sm">
                        {String(errors.next_calendar_year.message)}
                      </p>
                    )}
                  </div>

                  <div className="mb-4">
                    {termsData.map((term, index) => (
                      <div key={index} className="mb-4">
                        <label className="block">{term.term}</label>
                        <div className="flex gap-4">
                          <Controller
                            name={`terms.${index}.start_date`}
                            control={control}
                            render={({ field }) => (
                              <input
                                {...field}
                                type="date"
                                className="w-full border p-2"
                                placeholder={`Start date for ${term.term}`}
                                value={field.value || ''}
                              />
                            )}
                          />
                          {errors.terms?.[index]?.start_date && (
                    <p className="text-sm text-red-500">{String(errors.terms[index].start_date?.message)}</p>
                  )}

                          <Controller
                            name={`terms.${index}.end_date`}
                            control={control}
                            render={({ field }) => (
                              <input
                                {...field}
                                type="date"
                                className="w-full border p-2"
                                placeholder={`End date for ${term.term}`}
                                value={field.value || ''}
                              />
                            )}
                          />
                          {errors.terms?.[index]?.start_date && (
                            <p className="text-red-500 text-sm">
                              {String(errors.terms[index].start_date.message)}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || isPromoting}
                    className="bg-blue-500 text-white p-2 w-full"
                  >
                    {isSubmitting || isPromoting
                      ? "Promoting..."
                      : "Promote Students"}
                  </button>
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
