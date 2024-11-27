"use client";
import {
  useGetTeacherQuery,
  useUpdateTeacherMutation,
} from "@/redux/queries/teachers/teachersApi";
import { useEffect, useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io";

import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues, useForm } from "react-hook-form";
import { BiSolidEdit } from "react-icons/bi";
import { toast } from "react-toastify";
import { z } from "zod";
import Spinner from "../layouts/spinner";
import { useUpdateStudentMutation,useGetStudentQuery } from "@/redux/queries/students/studentsApi";
import { useGetClassesQuery } from "@/redux/queries/classes/classesApi";
import { BsChevronDown } from "react-icons/bs";
import { useGetActiveTermsQuery } from "@/redux/queries/terms/termsApi";
import { IoCloseOutline } from "react-icons/io5";
import { LiaEdit } from "react-icons/lia";
interface Props {
    studentId: number;
  refetchStudents: () => void;
}
const EditStudent = ({ studentId, refetchStudents }: Props) => {
  // console.log("studentId", studentId);
  const [isOpen, setIsOpen] = useState(false);
  const [updateStudent, { isLoading: Updating }] = useUpdateStudentMutation();
  const { data: studentData, isLoading: isFetching } =useGetStudentQuery(studentId);
  const {
    isLoading: loadingTerms,
    data: termsData,
    refetch: refetchTerms,
  } = useGetActiveTermsQuery({}, { refetchOnMountOrArgChange: true });
 
  const {data: classesData, isLoading:isLoadingClasses} = useGetClassesQuery({})

    const schema = z.object({
      first_name: z.string().min(1, "First name is required"),
      last_name: z.string().min(1, "Last name is required"),
      admission_number: z.string().min(1, "Admission number is required"),
      class_level: z.number().min(1, "Select class level"),
      kcpe_marks: z.number().min(1, "KCPE marks required"),
      // current_term: z.number().min(1, "Current term is required"),
      gender: z.enum(["Male", "Female"], {
        errorMap: () => ({ message: "Select gender" }),
      }),
      admission_type: z.enum(["New Admission", "Transfer"], {
        errorMap: () => ({ message: "Select admission type" }),
      }),
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

  useEffect(() => {
    if (studentData) {
      setValue("first_name", studentData.first_name);
      setValue("last_name", studentData.last_name);
      setValue("admission_number", studentData.admission_number);
      setValue("kcpe_marks", studentData.kcpe_marks);
      setValue("class_level", studentData.class_level.id);
      setValue("gender", studentData.gender);
      setValue("admission_type", studentData.admission_type);
      // setValue("current_term", studentData.current_term);
    }
  }, [studentData, setValue]);
// console.log("studentData",studentData)
  const onSubmit = async (data: FieldValues) => {
    const id = studentId;
    try {
      await updateStudent({ id, ...data }).unwrap();
      toast.success("Student updated successfully!");
      handleCloseModal();
      refetchStudents();
    } catch (error: any) {
      if (error?.data?.error) {
        console.log("error", error);
        toast.error(error.data.error);
      }
    }
  };
  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValue("class_level", e.target.value);
  };
  const handleTermChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValue("current_term", e.target.value);
  };
  const handleOpenModal = () => setIsOpen(true);
  const handleCloseModal = () => setIsOpen(false);

  return (
    <>
      <div
        className=" cursor-pointer p-1 rounded-sm bg-green-100 "
        onClick={handleOpenModal}
      >
        <BiSolidEdit   size={17} className="text-green-600" />
      </div>

      {isOpen && (
        <div className="relative z-9999 animate-fadeIn" aria-labelledby="modal-title" role="dialog" aria-modal="true">
 
        <div 
        onClick={handleCloseModal}
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity animate-fadeIn" aria-hidden="true"></div>
      
        <div className="fixed inset-0 z-9999 w-screen overflow-y-auto">
          <div className="flex min-h-full items-start justify-center p-4 text-center sm:items-start sm:p-0">
           
            <div className="relative transform animate-fadeIn overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 w-full sm:max-w-2xl p-4 md:p-6 lg:p-6 md:max-w-2xl">
              {isSubmitting && <Spinner />}
            <div className="flex justify-between items-center pb-3">
                <p className="text-2xl md:text-lg lg:text-lg font-semibold text-black">
                  Update Student&apos;s details
                </p>
                 <div className="flex justify-end cursor-pointer">
              <IoCloseOutline size={35}
              onClick={handleCloseModal}
               className=" text-gray-500 "
                />
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
                
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 lg:grid-cols-2 gap-2 lg:gap-3">
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 lg:grid-cols-2 gap-2 lg:gap-3">
                  <div>
                    <label
                      htmlFor="admission_number"
                     className="block text-gray-900 md:text-lg text-sm lg:text-lg  font-normal  mb-2"
                    >
                     Admission Number
                    </label>
                    <input
                      type="text"
                      id="admission_number"
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
                  <div>
                    <label
                      htmlFor="kcpe_marks"
                     className="block text-gray-900 md:text-lg text-sm lg:text-lg  font-normal  mb-2"
                    >
                      KCPE MARKS
                    </label>
                    <input
                      type="text"
                      id="email"
                      placeholder="Enter kcpe marks"
                      {...register("kcpe_marks", {valueAsNumber:true})}
                      className="w-full py-2 px-4 rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
                    />
                    {errors.kcpe_marks && (
                      <p className="text-red-500 text-sm">
                        {String(errors.kcpe_marks.message)}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 lg:grid-cols-2 gap-2 lg:gap-5">
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
                      className="w-full appearance-none py-2 px-4 text-lg rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
                    >
                      <option value="">Gender</option>
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
                      htmlFor="ADM TYPE"
                     className="block text-gray-900 md:text-lg text-sm lg:text-lg  font-normal  mb-2"
                    >
                      Admission Type
                    </label>
                    <select
                      id="gender"
                      {...register("admission_type")}
                      className="w-full appearance-none py-2 px-4 text-lg rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
                    >
                      <option value="">Select admission type</option>
                      <option value="New Admission">New Admission</option>
                      <option value="Transfer">Transfer</option>
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
                </div>
                {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-2 lg:grid-cols-2 gap-2 lg:gap-5"> */}
                <div className="relative">
                    <label
                      htmlFor="class_level"
                      className="block text-gray-900 md:text-lg text-sm lg:text-lg  font-normal  mb-2"
                    >
                     Class Level
                    </label>
                    <select
                      id="class_level"
                      {...register("class_level",  {valueAsNumber:true})}
                      onChange={handleClassChange}
                      value={watch("class_level") || ""}
                      className="w-full appearance-none py-2 px-4 text-lg rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
                    >
                      {isLoadingClasses ? (
                        <option value="">Loading...</option>
                      ) : (
                        <>
                          <option value="">Select Class</option>
                          {classesData?.map((cl: any) => (
                            <option key={cl.id} value={cl.id}>
                              {cl.form_level.name}  {cl?.stream?.name}
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
                  
              
                  <div className="flex justify-start lg:justify-end md:justify-end mt-7 py-6">
                    <button
                      type="submit"
                      disabled={Updating}
                      className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4
                       focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm space-x-4
                       text-white rounded-md  px-5 py-2"
                    >
                      {/* <LiaEdit className="text-white " size={18} /> */}
                      <span>{Updating ? "Updating..." : "Update Student"}</span>
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
export default EditStudent;
