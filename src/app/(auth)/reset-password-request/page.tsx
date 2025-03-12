"use client";
import { usePasswordResetRequestMutation } from "@/redux/queries/users/usersApi";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";

import { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { AiOutlineMail } from "react-icons/ai";
import { toast } from "react-toastify";
import { z } from "zod";
import { useRouter } from "next/navigation";
const ResetPasswordRequestPage = () => {
  const [passwordResetRequest, { data, error, isSuccess, isLoading }] =
    usePasswordResetRequestMutation();
  const router = useRouter();
  const [token, setToken] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const loginSchema = z.object({
    email: z
      .string()
      .email("Invalid email address")
      .nonempty("Email is required"),
  });
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(loginSchema),
  });
  const handleOpenModal = () => setIsOpen(true);
  const onSubmit = async (data: FieldValues) => {
    const { email } = data;
    try {
      const response = await passwordResetRequest(data).unwrap();
      const successMessage = response?.message || "Login successful";
      const resetToken = response.token;
      setToken(resetToken);
      toast.success(successMessage);
      handleOpenModal();
    } catch (error: any) {
      if (error?.data?.error) {
        console.log("error", error);
        toast.error(error.data.error);
      }
    }
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    reset();
    router.push("/reset-password")
  };

  const toLogin = () => {
    router.push("/");
  };
  const copyToClipboard = () => {
    navigator.clipboard.writeText(token);
    toast.success("Token copied to clipboard!");
  };
  return (
    <>
      <div className="bg-[#D6DBDC] h-screen flex items-center justify-center p-4 ">
        <div className=" flex justify-center items-center py-10 mx-auto min-h-screen">
          <div className="bg-white lg:p-8 md:p-8 p-5 shadow-lg rounded-md w-full max-w-md  ">
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
            <div className="flex items-center py-3">
              <hr className="flex-grow border-gray-300" />
              <h3 className="px-4 text-[#1F4772] text-center">
                RESET PASSWORD
              </h3>
              <hr className="flex-grow border-gray-300" />
            </div>
            <p>
              {/* Enter your email address and we'll send
               you an email with instructions to reset your password. */}
               Enter your email address and we&apos;ll generate for you a token  to reset your password.
               </p>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div>
                <div className="capitalize text-xl mb-3"></div>
                <div className=" relative">
                  <span className="absolute px-3 inset-y-0 left-0 flex items-center text-gray-400">
                    <AiOutlineMail
                      size={24}
                      color=""
                      className="text-current"
                    />
                  </span>

                  <input
                    className="w-full placeholder:capitalize px-10 py-3 border border-gray-300 focus:outline-none focus:border-blue-300 focus:bg-white text-lg text-gray-900 rounded-md"
                    type="text"
                    {...register("email")}
                    placeholder="enter email"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500">{String(errors.email.message)}</p>
                )}
              </div>

              <div>
                <button
                  type="submit"
                  className="bg-[#28d196ff] text-xl text-white font-medium lg:py-4 md:py-4 py-2 rounded-lg w-full opacity-90 hover:opacity-100 mt-4 flex items-center justify-center"
                >
                  <span className="lg:text-xl md:text-xl text-sm font-light">
                    {isSubmitting ? "Processing" : "Submit"}
                  </span>
                </button>
              </div>
            </form>
            <div
              onClick={toLogin}
              className="flex items-start my-3 cursor-pointer"
            >
              <span className="px-4 text-blue-600 text-lg underline text-decoration-blue-600 ">
                Login
              </span>
            </div>
          </div>
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

<div className="fixed inset-0 z-9999 w-screen overflow-y-auto max-w-full">
  <div className="flex min-h-full items-start justify-center p-4 text-center sm:items-start sm:p-0">
    <div className="relative transform animate-fadeIn overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 w-full sm:max-w-2xl p-4 sm:p-2 md:p-4 lg:p-6 md:max-w-2xl max-w-full">
      <h2 className="text-lg font-semibold">Reset Token</h2>
      <p className="mt-2">Below is Your password reset token, copy it and keep it somewhere to use it in the next step to complete resetting password.</p>
      
      
      <div className="flex items-center flex-wrap gap-5 mt-2 mx-3">
        
        <div className="block p-2 bg-gray-200 rounded w-full break-words">
          {token}
        </div>
        
        
        <button
          onClick={copyToClipboard}
          className="ml-4 bg-blue-500 text-white px-4 py-2 rounded text-sm sm:text-base"
        >
          Copy
        </button>
      </div>

      <div className="flex justify-end mt-6">
        
        <button
          type="button"
          onClick={handleCloseModal}
          className="bg-[#36A000] text-white rounded-md px-6 py-3 hover:bg-[#36A000] focus:outline-none text-sm sm:text-base"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</div>

          </div>
        )}
      </div>
    </>
  );
};
export default ResetPasswordRequestPage;
