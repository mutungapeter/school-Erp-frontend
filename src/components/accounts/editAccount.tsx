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
        className=" cursor-pointer  p-1 rounded-sm bg-green-100"
        onClick={handleOpenModal}
      >
        <BiSolidEdit   size={17} className="text-green-800" />
      </div>

      {isOpen && (
        <div className="modal fixed z-9999 w-full h-full top-0 left-0 flex items-start justify-center">
          <div
            className="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"
            onClick={handleCloseModal}
          ></div>

          <div className="modal-container bg-white  w-10/12 md:max-w-3xl mx-auto rounded shadow-lg z-50 mt-10 transform transition-all">
            {isSubmitting && <Spinner />}
            <div className="modal-content py-6 text-left px-6 ">
              <div className="flex justify-between items-center pb-3">
                <p className="text-2xl font-bold text-[#1F4772]">
                  Update Account details
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
                
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-3">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-gray-700 font-semibold text-sm mb-2"
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      placeholder="Enter first name"
                      {...register("first_name")}
                      className="w-full py-2 px-4 rounded-md border border-blue-500 focus:outline-none"
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
                      className="block text-gray-700 font-semibold mb-2"
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      placeholder="Enter last name"
                      {...register("last_name")}
                      className="w-full py-2 px-4 rounded-md border border-blue-500 focus:outline-none"
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
                      className="block text-gray-700 font-semibold text-sm mb-2"
                    >
                     Phone Number
                    </label>
                    <input
                      type="text"
                      id="Phone"
                      placeholder="Enter phone number"
                      {...register("phone_number")}
                      className="w-full py-2 px-4 rounded-md border border-blue-500 focus:outline-none"
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
                      className="block text-gray-700 font-semibold mb-2"
                    >
                      Email
                    </label>
                    <input
                      type="text"
                      id="email"
                      placeholder="Enter email"
                      {...register("email")}
                      className="w-full py-2 px-4 rounded-md border border-blue-500 focus:outline-none"
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
                      className="block text-gray-700 text-sm  font-semibold mb-2"
                    >
                     Username
                    </label>
                    <input
                      type="text"
                      id="username"
                      placeholder="Enter username"
                      {...register("username")}
                      className="w-full py-2 px-4 rounded-md border border-blue-500 focus:outline-none"
                    />
                    {errors.username && (
                      <p className="text-red-500 text-sm">
                        {String(errors.username.message)}
                      </p>
                    )}
                  </div>
                
                  <div className="relative w-full">
                    <label
                      htmlFor="gender"
                      className="block text-gray-700 text-sm  font-semibold mb-2"
                    >
                      Role
                    </label>
                    <select
                      id="gender"
                      {...register("gender")}
                      className="w-full appearance-none py-1 px-4 text-lg rounded-md border border-blue-500 focus:outline-none"
                    >
                      <option value="">Select Role</option>
                      <option value="Admin">Admin</option>
                      <option value="Principal">Principal</option>
                    </select>
                    <IoMdArrowDropdown
                      size={30}
                      className="absolute top-[66%] right-4 transform -translate-y-1/2 text-[#1F4772] pointer-events-none"
                    />
                    {errors.role && (
                      <p className="text-red-500 text-sm">
                        {String(errors.role.message)}
                      </p>
                    )}
                  </div>
              
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
      )}
        </>
    )
}
export default EditAccount;