"use client";
import { useAppDispatch } from "@/redux/hooks";
import DefaultLayout from "@/src/components/adminDashboard/Layouts/DefaultLayout";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { PiLockKeyLight } from "react-icons/pi";
import { toast } from "react-toastify";
import { z } from "zod";

import { userLoggedOut } from "@/redux/queries/auth/authSlice";
import { useChangePasswordMutation } from "@/redux/queries/users/usersApi";
import Spinner from "@/src/components/layouts/spinner";
const ChangePassword = () => {
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useAppDispatch();
    const [changePassword, { data, error, isSuccess, isLoading }] = useChangePasswordMutation();
  const router = useRouter();
    const schema = z.object({
        current_password: z.string().min(4, "Current password is required"),
        new_password: z.string().min(4, "New Password required"),
        confirm_password: z.string().min(4, "Confirm Password required"),
    });
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({
        resolver: zodResolver(schema),
    });
    const onSubmit = async(data: FieldValues) => {
        const { current_password, new_password, confirm_password } = data;
        try {
          const response = await changePassword(data).unwrap();
          const successMessage = response?.message || "Password changed successfully";
          toast.success(successMessage);
          dispatch(userLoggedOut());
          router.push("/");
        } catch (error: any) {
          if (error?.data?.error) {
            console.log("error", error);
            toast.error(error.data.error);
          }
        }
    };
    return (
        <DefaultLayout>
            <div className=" space-y-5 shadow-md border py-2 bg-white overflow-x-auto max-w-3xl ">
                <div className="p-3  border-b items-center flex space-x-2">
                    <PiLockKeyLight size={25} />
                    <h2 className="font-semibold text-black md:text-xl text-md lg:text-xl">
                        Change Password
                    </h2>
                </div>
                <div className="p-3">
                {isSubmitting || isLoading  && <Spinner />}
            
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-2 lg:grid-cols-2 gap-2 lg:gap-3">
                            <div>
                                <label
                                    htmlFor="firstName"
                                    className="block text-gray-900 md:text-lg text-sm lg:text-lg  font-normal  mb-2"
                                >
                                    Current Password
                                </label>
                                <input
                                    type="text"
                                    id="firstName"
                                    placeholder="Enter current password"
                                    {...register("current_password")}
                                    className="w-full py-2 px-4 rounded-md border border-1 border-gray-300 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
                                />
                                {errors.current_password && (
                                    <p className="text-red-500 text-sm">
                                        {String(errors.current_password.message)}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label
                                    htmlFor="new password"
                                    className="block text-gray-900 md:text-lg text-sm lg:text-lg  font-normal  mb-2"
                                >
                                    New Password
                                </label>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="new password"
                                    placeholder="Enter new password"
                                    {...register("new_password")}
                                    className="w-full py-2 px-4 rounded-md border border-1 border-gray-300 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
                                />
                                {errors.new_password && (
                                    <p className="text-red-500 text-sm">
                                        {String(errors.new_password.message)}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div>
                            <label
                                htmlFor="new password"
                                className="block text-gray-900 md:text-lg text-sm lg:text-lg  font-normal  mb-2"
                            >
                                Confirm Password
                            </label>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="confirm password"
                                placeholder="Enter confirm password"
                                {...register("confirm_password")}
                                className="w-full py-2 px-4 rounded-md border border-1 border-gray-300 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
                            />
                            {errors.confirm_password && (
                                <p className="text-red-500 text-sm">
                                    {String(errors.confirm_password.message)}
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


                        <div className="flex justify-end mt-6">

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-[#36A000] text-white rounded-md py-1 px-2 md:px-4 md:py-2 lg:px-4 lg:py-2 text-xs lg:text-sm md:text-sm hover:bg-[#36A000] focus:outline-none"
                            >
                                {isSubmitting ? "Changing..." : "Change"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </DefaultLayout>
    );
};
export default ChangePassword;
