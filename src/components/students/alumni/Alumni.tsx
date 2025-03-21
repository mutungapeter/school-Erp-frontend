"use client";
import { LuBookOpenCheck } from "react-icons/lu";
import { IoMdArrowDropdown } from "react-icons/io";
import { toast } from "react-toastify";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { FieldValues, useForm } from "react-hook-form";
import { useGetClassesQuery, useGetGraduatingClassesQuery } from "@/redux/queries/classes/classesApi";
import Spinner from "../../layouts/spinner";
import { usePromoteStudentsMutation, usePromoteStudentsToAlumniMutation } from "@/redux/queries/students/studentsApi";
import DatePicker from "react-datepicker";
import { formatYear } from "@/src/utils/dates";
import { IoCloseOutline } from "react-icons/io5";
import "../../style.css";
import { HiChevronDown } from "react-icons/hi2";
import { BsChevronDown } from "react-icons/bs";
import { PiGraduationCapThin } from "react-icons/pi";
import { FiDivide } from "react-icons/fi";
interface Props {
  refetchStudents: () => void;
}
const PromoteStudentsToAlumni = ({ refetchStudents }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const {
    isLoading: loadingClassLevels,
    data: ClassLevelsData,
    refetch,
  } = useGetGraduatingClassesQuery({}, { refetchOnMountOrArgChange: true });
  const schema = z.object({
    final_class_level: z.coerce.number().min(1, "Graduating class is required"),
    
  });
  const [promoteStudentsToAlumni, { data, error, isSuccess }] =
  usePromoteStudentsToAlumniMutation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: zodResolver(schema),
  });
  const handleGraduationClassClassChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setValue("final_class_level", e.target.value);
  };
 
  const onSubmit = async (data: FieldValues) => {
    const { final_class_level,  graduation_year } = data;
    try {
      const response = await promoteStudentsToAlumni(data).unwrap();
      const successMsg = response.message || "Student Marked as graduated successfully!";
      toast.success(successMsg);
      handleCloseModal();
      refetchStudents();
    } catch (error: any) {
      if (error?.data?.error) {
        toast.error(error.data.error);
      } else {
        toast.error("Failed to mark students as Graduate. Please try again.");
      }
    }
  };

  const handleOpenModal = () => setIsOpen(true);
  const handleCloseModal = () => setIsOpen(false);
  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    const formattedDate = date ? Number(formatYear(date)) : null;
    setValue("graduation_year", formattedDate, { shouldValidate: true }); 
  };
  
  return (
    <>
      <div
        className="inline-flex p-2 cursor-pointer rounded-full border bg-yellow-500  text-white"
        onClick={handleOpenModal}
      >
        <PiGraduationCapThin size={20} className="text-white" />
      </div>
      {isOpen && (
         <div className="relative z-9999 animate-fadeIn" aria-labelledby="modal-title" role="dialog" aria-modal="true">
 
         <div 
         onClick={handleCloseModal}
         className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity animate-fadeIn" aria-hidden="true"></div>
       
         <div className="fixed inset-0 z-9999 w-screen overflow-y-auto">
           <div className="flex min-h-full items-start justify-center p-4 text-center sm:items-start sm:p-0">
            
             <div className="relative transform animate-fadeIn overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-16 w-full sm:max-w-lg p-4  md:p-6 lg:p-6 md:max-w-lg">
                {isSubmitting && <Spinner />}
           
              <div className="flex justify-between items-center pb-3">
              <p className="text-md md:text-2xl lg:text-2xl font-semibold text-black">
                  Promote Students to Alumni
                </p>
                <div className="flex justify-end cursor-pointer">
                    <IoCloseOutline
                      size={35}
                      onClick={handleCloseModal}
                      className=" text-gray-500 "
                    />
                  </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 md:space-y-5 lg:space-y-5">
               <div>

                <div className="relative">
                    <label
                      htmlFor="class_level"
                      className="block  text-sm  font-normal mb-2 uppercase"
                    >
                      Graduating class
                    </label>
                    <select
                      id="class_level"
                      {...register("final_class_level")}
                      onChange={handleGraduationClassClassChange}
                      className="w-full appearance-none py-2 px-4 text-lg rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
                    >
                      {loadingClassLevels ? (
                        <option value="">Loading...</option>
                      ) : (
                        <>
                          <option value="">--- Select graduating class ---</option>
                          {ClassLevelsData?.map((cl: any) => (
                            <option key={cl.id} value={cl.id}>
                              {cl.form_level.name} {cl?.stream?.name || ""} ({cl.calendar_year})
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
                    {errors.final_class_level && (
                      <p className="text-red-500 text-sm">
                        {String(errors.final_class_level.message)}
                      </p>
                    )}
                
               </div>
               

                <div className="flex justify-start lg:justify-end md:justify-end mt-7 py-6">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className=" inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4
                       focus:outline-none focus:ring-blue-300 font-medium  text-sm space-x-3
                       text-white rounded-md  px-4 py-2"
                    >
                      <PiGraduationCapThin className="text-white " size={18} />
                      <span>{isSubmitting ? "Submitting..." : "Mark Graduated"}</span>
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
export default PromoteStudentsToAlumni;
