import { useGetClassesQuery } from "@/redux/queries/classes/classesApi";
import { useCreateStudentMutation } from "@/redux/queries/students/studentsApi";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { FieldValues, useForm } from "react-hook-form";
import { BiCheckCircle } from "react-icons/bi";
import { BsChevronDown } from "react-icons/bs";
import { FaPlusCircle } from "react-icons/fa";
import { IoCloseOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import { z } from "zod";
import Spinner from "../layouts/spinner";
import "../style.css";
interface CreateStudentProps {
  refetchStudents: () => void;
}

export const CreateStudent = ({ refetchStudents }: CreateStudentProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    isLoading: loadingClassLevels,
    data: ClassLevelsData,
    refetch,
  } = useGetClassesQuery({}, { refetchOnMountOrArgChange: true });
 const [createStudent, { data, error, isSuccess }] =useCreateStudentMutation();
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const today = new Date();
  const schema = z.object({
    
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    admission_number: z.string().min(1, "Admission number is required"),
    gender: z.enum(["Male", "Female"], {
      errorMap: () => ({ message: "Select gender" }),
    }),
    admission_type: z.enum(["New Admission", "Transfer"], {
      errorMap: () => ({ message: "Select admission type" }),
    }),
    class_level: z.string().min(1, "Select a class"),
    kcpe_marks: z.number().min(0, "KCPE marks required!").default(0)
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

  const onSubmit = async (data: FieldValues) => {
    const { first_name, last_name, admission_number, gender, birth_date, class_level, admission_type, current_term } = data;
    try {
      await createStudent(data).unwrap();
      toast.success("Student added successfully!");
      handleCloseModal();
      refetchStudents()
    } catch (error:any) {
     
      if (error?.data?.error) {
        toast.error(error.data.error);
      } else {
        toast.error("Failed to add Student. Please try again.");
      }
    }
  };
  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValue("class_level", e.target.value);
  };

  

  const handleOpenModal = () => setIsOpen(true);
  const handleCloseModal = () =>{
    reset();
    setIsOpen(false);
  };
// console.log("termsData", termsData)
  return (
    <>
       <div
        onClick={handleOpenModal}
        className=" cursor-pointer text-center justify-center px-2 py-2 md:py-2 md:px-4 lg:py-2 lg:px-4 bg-green-700 rounded-md shadow-sm  flex items-center space-x-2 "
      >
        <FaPlusCircle size={17} className="text-white   " />
        <span className=" lg:text-sm md:text-sm text-xs text-white">Add Student</span>
      </div>

      {isOpen && (
       <div className="relative z-9999 animate-fadeIn" aria-labelledby="modal-title" role="dialog" aria-modal="true">
 
        <div 
        onClick={handleCloseModal}
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity animate-fadeIn" aria-hidden="true"></div>
      
        <div className="fixed inset-0 z-9999 w-screen overflow-y-auto">
          <div className="flex min-h-full items-start justify-center p-4 text-center sm:items-start sm:p-0">
           
            <div className="relative transform animate-fadeIn overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-4 w-full sm:max-w-xl p-4 md:p-4 lg:p-4 md:max-w-xl">
             
              {isSubmitting && <Spinner />}
              <div className="flex justify-between items-center pb-3">
                <p className="text-sm md:text-lg lg:text-lg font-semibold text-black">
                  Add New Student
                </p>
                <div className="flex justify-end cursor-pointer">
              <IoCloseOutline size={35}
              onClick={handleCloseModal}
               className=" text-gray-500 "
                />
                </div>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-2 md:gap-2 lg:grid-cols-2 gap-2 lg:gap-3">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-gray-900 md:text-lg text-sm lg:text-lg  font-normal  mb-2"
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      placeholder="Enter first name"
                      {...register("first_name")}
                      className="w-full py-2 px-4 rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
                    />
                    {errors.first_name && (
                      <p className="text-red-500 text-sm">
                        {String(errors.first_name.message)}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-gray-900 md:text-lg text-sm lg:text-lg  font-normal  mb-2"
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      placeholder="Enter last name"
                      {...register("last_name")}
                      className="w-full py-2 px-4 rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
                    />
                    {errors.last_name && (
                      <p className="text-red-500 text-sm">
                        {String(errors.last_name.message)}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 md:gap-2 lg:grid-cols-2 gap-2 lg:gap-3">
                  <div>
                    <label
                      htmlFor="admissionNumber"
                      className="block text-gray-900 md:text-lg text-sm lg:text-lg  font-normal  mb-2 "
                    >
                      Admission Number
                    </label>
                    <input
                      type="text"
                      id="admissionNumber"
                      placeholder="Enter admission number"
                      {...register("admission_number")}
                      className="w-full py-2 px-4 rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
                    />
                    {errors.admission_number && (
                      <p className="text-red-500 text-sm">
                        {String(errors.admission_number.message)}
                      </p>
                    )}
                  </div>
                  <div className="w-full relative">
                    <label
                      htmlFor="KCPE"
                      className="block text-gray-900 md:text-lg text-sm lg:text-lg  font-normal  mb-2"
                    >
                      KCPE Marks
                    </label>
                    <input
                      type="text"
                      id="KCPE"
                      placeholder="Enter KCPE marks"
                      {...register("kcpe_marks",{valueAsNumber:true})}
                      value={watch("kcpe_marks") ?? 0} 
                      onChange={(e) => {
                        const value = e.target.value;
                        setValue("kcpe_marks", value === "" ? 0 : parseInt(value, 10)); 
                      }}
                      className="w-full py-2 px-4 rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
                    />
                    {errors.kcpe_marks && (
                      <p className="text-red-500 text-sm">
                        {String(errors.kcpe_marks.message)}
                      </p>
                    )}
                    
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 md:gap-2 lg:grid-cols-2 gap-2 lg:gap-5">
                
                <div className="relative">
                  <label
                    htmlFor="gender"
                    className="block text-gray-900 md:text-lg text-sm lg:text-lg  font-normal  mb-2"
                  >
                    Gender
                  </label>
                  <select
                    id="gender"
                    {...register("gender")}
                    className="w-full appearance-none py-2 px-4 text-md rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
                  >
                    <option value="">--- Select Gender ---</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                  <BsChevronDown 
                      color="gray" 
                      size={20}
                    className="absolute top-[70%] right-4 transform -translate-y-1/2 text-[#1F4772] pointer-events-none"
                  />
                  {errors.gender && (
                    <p className="text-red-500 text-sm">
                      {String(errors.gender.message)}
                    </p>
                  )}
                </div>
                <div className="relative">
                    <label
                      htmlFor="admission_type"
                      className="block text-gray-900 md:text-lg text-sm lg:text-lg  font-normal  mb-2"
                    >
                      Admission Type
                    </label>
                    <select
                      id="admission_type"
                      {...register("admission_type")}
                      className="w-full appearance-none py-2 px-4 text-md rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
                    >
                      <option value="">---Select admission type---</option>
                      <option value="New Admission">New Admission</option>
                      <option value="Transfer">Transfer</option>
                    </select>
                    <BsChevronDown 
                      color="gray" 
                      size={20}
                      className="absolute top-[70%] right-4 transform -translate-y-1/2 text-[#1F4772] pointer-events-none"
                    />
                    {errors.admission_type && (
                      <p className="text-red-500 text-sm">
                        {String(errors.admission_type.message)}
                      </p>
                    )}
                  </div>
                  </div>

                <div >
                  <div className="relative">
                    <label
                      htmlFor="class_level"
                      className="block text-gray-900 md:text-md text-sm lg:text-md  font-normal  mb-2"
                    >
                      Class
                    </label>
                    <select
                      id="class_level"
                      {...register("class_level")}
                      onChange={handleClassChange}
                      className="w-full appearance-none py-2 px-4 text-lg rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
                    >
                      {loadingClassLevels ? (
                        <option value="">Loading...</option>
                      ) : (
                        <>
                          <option value="">--- Select class ---</option>
                          {ClassLevelsData?.map((cl: any) => (
                            <option key={cl.id} value={cl.id}>
                              {cl.form_level.name} {cl?.stream?.name || ""} - ({cl.calendar_year})
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

               
                <div className="flex justify-start lg:justify-end md:justify-end mt-7 py-6">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className=" inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4
                       focus:outline-none focus:ring-blue-300 font-medium  text-sm space-x-4
                       text-white rounded-md  px-5 py-2"
                    >
                      <BiCheckCircle className="text-white " size={18} />
                     <span> {isSubmitting ? "Submitting..." : "Save Student"}</span>
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
