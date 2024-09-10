'use client';
import { FaLock, FaUser } from "react-icons/fa";
import { IoIosLock } from "react-icons/io";
import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";
import { redirect, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLoginMutation } from "@/redux/queries/auth/authApi";
import React, { useEffect, useState } from "react";
import { toast } from 'react-toastify';
const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [login, { data, error, isSuccess }] = useLoginMutation();
    const router = useRouter()

useEffect(() => {
    if (isSuccess) {
      const message = data?.message || "Login  successful";
      toast.success(message);
      router.push("/dashboard");
    }
    if (error) {
        console.log(error)
      if ("data" in error) {
        const errorData = error as any;
        console.log("errorData", errorData)
        toast.error(errorData.data.error);
      }
    }
  }, [isSuccess, error]);
  const loginSchema = z.object({
    username: z.string().nonempty("User name is required"),
    password: z.string().min(4, "Password must be atleast 6 characters"),
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
    const { username, password } = data;
    await login(data);
  };
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  return (
    <>
      <div className="bg-[#D6DBDC] h-screen flex items-center justify-center p-4 dark:bg-slate-800">
        <div className="bg-white p-14 shadow-lg rounded-md w-full max-w-lg dark:bg-slate-100">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="text-3xl text-[#1F4772] font-bold capitalize text-center mb-6">
              <h3>LOGIN</h3>
            </div>
            <div>
              <div className="capitalize text-xl mb-3">
                <label>username</label>
              </div>
              <div className=" relative">
                <span className="absolute px-3 inset-y-0 left-0 flex items-center text-gray-400">
                  <FaUser size={24} color="#1F4772" />
                </span>

                <input
                  className="w-full placeholder:capitalize px-10 py-3 border border-gray-300 focus:outline-none focus:bg-slate-100 text-lg rounded-md"
                  type="text"
                  {...register("username")}
                  placeholder="enter username"
                />
              </div>
              {errors.username && (
                <p className="text-red-500">{String(errors.username.message)}</p>
              )}
            </div>
            <div className="mt-6">
              <div className="capitalize text-xl mb-3">
                <label>password</label>
              </div>
              <div className="relative">
                <span className="absolute px-3 inset-y-0 left-0 flex items-center text-gray-400">
                  <IoIosLock size={24} color="#1F4772" />
                </span>
                <input
                  className="w-full placeholder:capitalize px-10 py-3 border border-gray-300 focus:outline-none focus:bg-slate-100 text-lg rounded-md "
                  type="password"
                  {...register("password")}
                  placeholder="enter password"
                />
              </div>
              {errors.password && (
                <p className="text-red-500">{String(errors.password.message)}</p>
              )}
            </div>
            <div className="sm:flex sm:justify-between inline-block my-6">
              <div className="text-[#1F4772]">
                <a href="#">Forgot password?</a>
              </div>
            </div>
            <div>
              <button type="submit" className="bg-[#1F4772] text-xl text-white font-medium uppercase p-3 rounded-lg w-full opacity-90 hover:opacity-100">
              <span className="text-sm text-center font-light ">
                    {" "}
                    {isSubmitting ? (
                      <span>
                       Processing
                      </span>
                    ) : (
                      "LOGIN"
                    )}
                  </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
export default LoginPage;
