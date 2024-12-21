'use client';
import { useEffect, useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io";

import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues, useForm } from "react-hook-form";
import { BiSolidEdit } from "react-icons/bi";
import { toast } from "react-toastify";
import { z } from "zod";
import Spinner from "../layouts/spinner";
import { useGetAdminQuery, useUpdateAdminMutation } from "@/redux/queries/users/usersApi";
import { BsChevronDown } from "react-icons/bs";
import { IoCloseOutline } from "react-icons/io5";
interface Props{
    accountId:number;
    refetchUsers:()=> void
}
const EditAccount=({accountId, refetchUsers}:Props)=>{
    const [isOpen, setIsOpen] = useState(false);
    const [updateAdmin, { isLoading: Updating }] = useUpdateAdminMutation();
    const { data: accountData, isLoading: isFetching } = useGetAdminQuery(accountId);
    const schema = z.object({
        first_name: z.string().min(1, "First name is required"),
        last_name: z.string().min(1, "Last name is required"),
        phone_number: z.string().min(1, "Phone number is required"),
        email: z.string().email("Invalid email address"),  
        username: z.string().min(1, "Username is required"),
        role: z.enum(["Admin","Principal"], {
          errorMap: () => ({ message: "Select role" }),
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
        if (accountData) {
          setValue("first_name", accountData.first_name);
          setValue("last_name", accountData.last_name);
          setValue("username", accountData.username);
          setValue("email", accountData.email);
          setValue("phone_number", accountData.phone_number || "");
          setValue("role", accountData.role);
        }
      }, [accountData, setValue]);

      const onSubmit = async (data: FieldValues) => {
        const id = accountId;
        try {
          const response = await updateAdmin({ id, ...data }).unwrap();
          const successMsg = response.message || "Account update successful!";
          toast.success(successMsg);
          handleCloseModal();
          refetchUsers();
        } catch (error: any) {
          if (error?.data?.error) {
            console.log("error", error);
            toast.error(error.data.error);
          }
        }
      };
    const handleOpenModal = () => setIsOpen(true);
    const handleCloseModal = () => setIsOpen(false);

    return(
        <>
         <div
        className=" cursor-pointer flex inline-flex text-white items-center space-x-1 py-1 px-2 rounded-sm bg-primary"
        onClick={handleOpenModal}
      >
        <BiSolidEdit   size={15} className="text-white" />
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
            <div className="relative transform animate-fadeIn overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-4 w-full sm:max-w-lg p-4 md:p-6 lg:p-6 md:max-w-lg">
              {isSubmitting && <Spinner />}
           
              <div className="flex justify-between items-center pb-3">
                <p className="font-semibold text-black  md:text-lg text-md lg:text-lg">
                  Update Admin account details
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

                    <div className="relative">
                      <label
                        htmlFor="role"
                        className="block text-gray-900 md:text-lg text-sm lg:text-lg  font-normal  mb-2"
                      >
                        Role
                      </label>
                      <select
                        id="role"
                        {...register("role")}
                        className="w-full appearance-none p-2 text-md rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
                      >
                        <option value="">Select Role</option>
                        <option value="Admin">Admin</option>
                        <option value="Principal">Principal</option>
                      </select>
                      <BsChevronDown 
                      color="gray" 
                      size={20}
                        className="absolute top-[75%] right-4 transform -translate-y-1/2 text-[#1F4772] pointer-events-none"
                      />
                    </div>
                      {errors.role && (
                        <p className="text-red-500 text-sm">
                          {String(errors.role.message)}
                        </p>
                      )}
                    </div>
                  </div>

                <div className="flex justify-start lg:justify-end md:justify-end mt-3 ">
                    <button
                      type="submit"
                      disabled={Updating || isSubmitting }
                      className=" inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4
                       focus:outline-none focus:ring-blue-300 font-medium text-sm space-x-4
                       text-white rounded-md  px-5 py-2"
                    >
                      <span>{Updating || isSubmitting  ? "Updating..." : "Update"}</span>
                    </button>
                  </div>
              </form>
           
          </div>
        </div>
          </div>
        </div>
      )}
        </>
    )
}
export default EditAccount;