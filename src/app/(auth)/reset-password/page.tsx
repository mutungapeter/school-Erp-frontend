"use client";
import { FaLock, FaUser } from "react-icons/fa";
import { IoIosLock } from "react-icons/io";
import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";
import { redirect, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLoginMutation } from "@/redux/queries/auth/authApi";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import PageLoadingSpinner from "@/src/components/layouts/PageLoadingSpinner";
import InlineSpinner from "@/src/components/layouts/inlineSpinner";
import { IoLockClosedOutline } from "react-icons/io5";
import { BiUser } from "react-icons/bi";
import Image from "next/image";
import { useResetPasswordMutation } from "@/redux/queries/users/usersApi";
import { BsKey } from "react-icons/bs";
const ResetPasswordPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [resetPassword, { data, error, isSuccess, isLoading }] = useResetPasswordMutation();
  const router = useRouter();

  const loginSchema = z.object({
    token: z.string().min(4, "Password Reset Token is required"),
    new_password: z.string().min(4, "New Password must be at least 4 characters"),
  });
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(loginSchema),
  });
  const onSubmit = async (data: FieldValues) => {
    const { token, new_password } = data;
    try {
      const response = await resetPassword(data).unwrap();
      const successMessage = response?.message || "Password reset successful";
      toast.success(successMessage);
    } catch (error: any) {
      if (error?.data?.error) {
        console.log("error", error);
        toast.error(error.data.error);
      }
    }
  };
  useEffect(() => {
    if (isSuccess) {
      router.push("/");
    }
  }, [isSuccess, router]);

  return (
    <>
    
        <div className="bg-[#D6DBDC] h-screen flex items-center justify-center p-4 ">
          <div className=" flex justify-center items-center py-10 mx-auto min-h-screen">
            <div className="bg-white lg:p-8 md:p-8 p-5 shadow-lg rounded-md w-full max-w-md shadow-md  ">
              <div className="flex items-center justify-center ">
                <div className="w-[100px] h-[100px]  ">
                  <Image
                    src="/images/logo.jpg"
                    alt="logo"
                    width={100}
                    height={100}
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="flex justify-center items-center py-2">
                <h3 className="px-4 text-[#1F4772] font-semibold uppercase text-center">
                 Reset Password
                </h3>
              </div>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                  <div className="capitalize text-xl mb-3">
                  </div>
                  <div className=" relative">
                   <input
                      className="w-full placeholder:capitalize px-10 py-3 border border-gray-300 focus:outline-none focus:border-blue-300 focus:bg-white text-lg text-gray-900 rounded-md placeholder:text-sm md:placeholder:text-md lg:placeholder:text-lg"
                      type="text"
                      {...register("token")}
                      placeholder="Password reset token"
                    />
                  </div>
                  {errors.token && (
                    <p className="text-red-500">
                      {String(errors.token.message)}
                    </p>
                  )}
                </div>
                <div className="mt-6">
                  <div className="capitalize text-xl mb-3">
                  </div>
                  <div className="relative">
                    <span className="absolute px-3 inset-y-0 left-0 flex items-center text-gray-400">
                      <IoLockClosedOutline size={24} color="" />
                    </span>
                    <input
                      className="w-full placeholder:capitalize px-10 py-3 border border-gray-300 focus:border-blue-300 focus:outline-none focus:bg-white text-lg rounded-md placeholder:text-sm md:placeholder:text-md lg:placeholder:text-lg "
                      type={showPassword ? "text" : "password"}
                      {...register("new_password")}
                      placeholder="Enter new password"
                    />
                  </div>
                  {errors.new_password && (
                    <p className="text-red-500">
                      {String(errors.new_password.message)}
                    </p>
                  )}
                </div>
                <div className="flex items-center justify-between py-5">
                  <div className="flex  items-center space-x-2">
                    <input
                      type="checkbox"
                      className="lg:w-5 lg:h-5 md:w-5 md:h-5 h-3 w-3"
                      onChange={() => setShowPassword(!showPassword)}
                    />
                    <span className="text-gray-700 text-xs lg:text-sm md:text-sm">
                      Show Password
                    </span>
                  </div>
                  
                    
                 
                </div>

                <div>
                  <button
                    type="submit"
                    className="bg-[#28d196ff] text-xl text-white font-medium lg:py-4 md:py-4 py-2 rounded-lg w-full opacity-90 hover:opacity-100 flex items-center justify-center"
                  >
                    <BsKey 
                      size={23}
                      className="text-white mr-2"
                    />
                    <span className="lg:text-xl md:text-xl text-sm font-light">
                      {isSubmitting ? "Processing" : "Reset Password"}
                    </span>
                  </button>
                </div>
              </form>
             
            </div>
          </div>
        </div>
   
    </>
  );
};
export default ResetPasswordPage;
