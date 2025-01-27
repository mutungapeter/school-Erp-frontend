"use client";
import { useGetClassesQuery } from "@/redux/queries/classes/classesApi";
import { usePromoteStudentsMutation, usePromoteStudentsToNextTermMutation } from "@/redux/queries/students/studentsApi";
import { useGetActiveTermsQuery, useGetTermsQuery, useGetUpcomingTermsQuery } from "@/redux/queries/terms/termsApi";
import { formatYear } from "@/src/utils/dates";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangeEvent, useMemo, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FieldValues, useForm } from "react-hook-form";
import { BsChevronDown } from "react-icons/bs";
import { IoCloseOutline } from "react-icons/io5";
import { LuRefreshCcw } from "react-icons/lu";
import { toast } from "react-toastify";
import { z } from "zod";
import Spinner from "../../layouts/spinner";
import { TiArrowForwardOutline } from "react-icons/ti";
import "../../style.css";
interface Props {
  refetchStudents: () => void;
}
const PromoteStudentsToNextTerm = ({ refetchStudents }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedClassLevel, setSelectedClassLevel] = useState<number | null>(
    null
  );
  const {
    isLoading: loadingClassLevels,
    data: ClassLevelsData,
    refetch,
  } = useGetClassesQuery({}, { refetchOnMountOrArgChange: true });
  const schema = z.object({
    class_level: z.coerce.number().min(1, "Select  class"),
    term: z.coerce.number().min(1, "Select Term"),
  });
  const [promoteStudentsToNextTerm, { data, error, isSuccess }] =
  usePromoteStudentsToNextTermMutation();
  const {
    isLoading: loadingTerms,
    data: termsData,
    refetch: refetchTerms,
  } = useGetTermsQuery({}, { refetchOnMountOrArgChange: true });
const filteredTerms = useMemo(() => {
    return termsData?.filter(
      (term: any) => term.class_level.id === selectedClassLevel
    );
  }, [selectedClassLevel, termsData]);
  console.log("termsData",termsData)
  console.log("filteredTerms",filteredTerms)
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: zodResolver(schema),
  });
  const handleCurrentClassChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setValue("class_level", e.target.value);
  };

  const handleTermChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValue("term", e.target.value);
  };
  const handleFilterChange = (
    e: ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    if (name === "class_level") {
      const parsedValue = value ? parseInt(value, 10) : null;
      setSelectedClassLevel(parsedValue);  // Update the selectedClassLevel state
    }
  };
  const onSubmit = async (data: FieldValues) => {
    const { class_level, term } = data;
    console.log("data")
    try {
      const response = await promoteStudentsToNextTerm(data).unwrap();
      const successMsg = response.message || "Student Promoted to next term successfully!";
      toast.success(successMsg);
      handleCloseModal();
      refetchStudents();
    } catch (error: any) {
      if (error?.data?.error) {
        toast.error(error.data.error);
      } else {
        toast.error("Failed to Promote Students. Please try again.");
      }
    }
  };

  const handleOpenModal = () => setIsOpen(true);
  const handleCloseModal = () => {
    setIsOpen(false);
    reset();
  };


  return (
    <>
     <button
             className="inline-flex items-center space-x-2 p-2  rounded-md border bg-[#1566FF]  text-white"
             onClick={handleOpenModal}
           >
            <TiArrowForwardOutline size={20} />
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
              <div className="relative transform animate-fadeIn overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 w-full sm:max-w-lg p-4 md:p-6 lg:p-6 md:max-w-lg">
                {isSubmitting && <Spinner />}

                <div className="flex justify-between items-center pb-3">
                  <p className="text-2xl md:text-lg lg:text-lg font-semibold text-black">
                    Promote Students to next term
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
                  
                    <div className="relative">
                      <label
                        htmlFor="class_level"
                        className="block  text-sm  font-normal mb-2 uppercase"
                      >
                       Class
                      </label>
                      <select
                        id="class_level"
                        {...register("class_level")}
                        name="class_level"
                        onChange={handleFilterChange}
                        className="w-full appearance-none py-2 px-4 text-lg rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
                      >
                        {loadingClassLevels ? (
                          <option value="">Loading...</option>
                        ) : (
                          <>
                            <option value="">Select  class</option>
                            {ClassLevelsData?.map((cl: any) => (
                              <option key={cl.id} value={cl.id}>
                                {cl.name} {cl?.stream?.name || ""} - {cl.calendar_year}
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
                      {errors.class_level && (
                        <p className="text-red-500 text-sm">
                          {String(errors.class_level.message)}
                        </p>
                      )}
                    </div>
                 
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
                        name="term"
                        onChange={handleFilterChange}
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
                      {errors.term && (
                        <p className="text-red-500 text-sm">
                          {String(errors.term.message)}
                        </p>
                      )}
                    </div>
                  
                
                  <div className="flex justify-start lg:justify-end md:justify-end mt-7 py-6">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="text-white  inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4
                       focus:outline-none focus:ring-blue-300 font-medium  text-sm space-x-4
                       t rounded-md  px-5 py-2"
                    >
                      <LuRefreshCcw className="text-white " size={18} />
                      <span>{isSubmitting ? "Submitting..." : "Promote Students"}</span>
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
export default PromoteStudentsToNextTerm;
