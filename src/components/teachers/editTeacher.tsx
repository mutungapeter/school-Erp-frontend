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
import { BsChevronDown } from "react-icons/bs";
interface Props {
  teacherId: number;
  refetchTeachers: () => void;
}
const EditTeacher = ({ teacherId, refetchTeachers }: Props) => {
  console.log("teacherId", teacherId);
  const [isOpen, setIsOpen] = useState(false);
  const [updateTeacher, { isLoading: Updating }] = useUpdateTeacherMutation();
  const { data: teacherData, isLoading: isFetching } =
    useGetTeacherQuery(teacherId);

    const schema = z.object({
      first_name: z.string().min(1, "First name is required"),
      last_name: z.string().min(1, "Last name is required"),
      username: z.string().min(1, "Username is required"),
      email: z.string().email("Invalid email"),
      phone_number: z.string().optional().nullable(),
      staff_no: z.string().min(1, "Staff number is required"),
      gender: z.enum(["Male", "Female"], {
        errorMap: () => ({ message: "Select gender" }),
      }),
    });
  

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (teacherData) {
      setValue("first_name", teacherData.user.first_name);
      setValue("last_name", teacherData.user.last_name);
      setValue("username", teacherData.user.username);
      setValue("email", teacherData.user.email);
      setValue("phone_number", teacherData.user.phone_number || "");
      setValue("staff_no", teacherData.staff_no);
      setValue("gender", teacherData.gender);
    }
  }, [teacherData, setValue]);

  const onSubmit = async (data: FieldValues) => {
    const id = teacherId;
    try {
      await updateTeacher({ id, ...data }).unwrap();
      toast.success("Teacher updated successfully!");
      handleCloseModal();
      refetchTeachers();
    } catch (error: any) {
      if (error?.data?.error) {
        console.log("error", error);
        toast.error(error.data.error);
      }
    }
  };

  const handleOpenModal = () => setIsOpen(true);
  const handleCloseModal = () => setIsOpen(false);

  return (
    <>
      <div
        className=" cursor-pointer p-1 rounded-sm bg-green-100 "
        onClick={handleOpenModal}
      >
        <BiSolidEdit   size={17} className="text-green-800" />
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
                  Update staff details
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
                
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-3">
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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-3">
                  <div>
                    <label
                      htmlFor="Phone"
                      className="block text-gray-900 md:text-lg text-sm lg:text-lg  font-normal  mb-2"
                    >
                     Phone Number
                    </label>
                    <input
                      type="text"
                      id="Phone"
                      placeholder="Enter phone number"
                      {...register("phone_number")}
                      className="w-full py-2 px-4 rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
                    />
                    {errors.phone_number && (
                      <p className="text-red-500 text-sm">
                        {String(errors.phone_number.message)}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-gray-900 md:text-lg text-sm lg:text-lg  font-normal  mb-2"
                    >
                      Email
                    </label>
                    <input
                      type="text"
                      id="email"
                      placeholder="Enter email"
                      {...register("email")}
                      className="w-full py-2 px-4 rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm">
                        {String(errors.email.message)}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-3">
                <div>
                    <label
                      htmlFor="username"
                      className="block text-gray-900 md:text-lg text-sm lg:text-lg  font-normal  mb-2"
                    >
                     Username
                    </label>
                    <input
                      type="text"
                      id="username"
                      placeholder="Enter username"
                      {...register("username")}
                      className="w-full py-2 px-4 rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
                    />
                    {errors.username && (
                      <p className="text-red-500 text-sm">
                        {String(errors.username.message)}
                      </p>
                    )}
                  </div>
                <div>
                  <label
                    htmlFor="staff_no"
                    className="block text-gray-900 md:text-lg text-sm lg:text-lg  font-normal  mb-2"
                  >
                    Staff Number
                  </label>
                  <input
                    type="text"
                    id="staff_no"
                    placeholder="Enter staff no"
                    {...register("staff_no")}
                    className="w-full py-2 px-4 rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
                  />
                  {errors.staff_no && (
                    <p className="text-red-500 text-sm">
                      {String(errors.staff_no.message)}
                    </p>
                  )}
                </div>
                </div>
                
                  <div className="relative w-full">
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
                      size={25}
                      className="absolute top-[70%] right-4 transform -translate-y-1/2 text-[#1F4772] pointer-events-none"
                    />
                    {errors.gender && (
                      <p className="text-red-500 text-sm">
                        {String(errors.gender.message)}
                      </p>
                    )}
                  </div>
               

                <div className="flex justify-between mt-6">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="bg-gray-400 text-white rounded-md px-6 py-3 hover:bg-gray-500 focus:outline-none"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={Updating}
                    className="bg-[#36A000] text-white rounded-md px-6 py-3 hover:bg-[#36A000] focus:outline-none"
                  >
                    {Updating ? "Updating..." : "Submit"}
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
export default EditTeacher;
