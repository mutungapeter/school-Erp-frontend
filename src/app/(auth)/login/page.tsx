"use client";
import { useAppSelector } from "@/redux/hooks";
import { useLoginMutation } from "@/redux/queries/auth/authApi";
import { RootState } from "@/redux/store";
import InlineSpinner from "@/src/components/layouts/inlineSpinner";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { BiUser } from "react-icons/bi";
import { IoLockClosedOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import { z } from "zod";
const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [login, { data, error, isSuccess, isLoading }] = useLoginMutation();
  const router = useRouter();

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
    try {
      const response = await login(data).unwrap();
      const successMessage = response?.message || "Login successful";
      toast.success(successMessage);
    } catch (error: any) {
      if (error?.data?.error) {
        console.log("error", error);
        toast.error(error.data.error);
      }
    }
  };
  const { user, loading } = useAppSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (isSuccess) {
      setRedirecting(true);

      if (!user.role) {
        router.push("/");
      } else if (user.role === "Admin" || user.role === "Principal") {
        router.push("/dashboard");
      } else if (user.role === "Teacher") {
        router.push("/teacher-dashboard");
      }
    }
  }, [isSuccess, router, user?.role]);
  const redirectToResetPassword = () => {
    router.push("/reset-password-request");
  };
  return (
    <>
      {redirecting ? (
        <div className="text-center  h-screen flex flex-col justify-center bg-white items-center">
          <InlineSpinner />
        </div>
      ) : (
        <div className="bg-[#F4F7FA] h-screen flex items-center justify-center p-4 ">
          <div className=" flex justify-center items-center py-10 mx-auto min-h-screen">
            <div className="bg-white lg:p-8 md:p-8 p-5 shadow-lg rounded-md w-full max-w-md   ">
              <div className="flex items-center justify-center ">
                <div className="w-[100px] h-[150px]  ">
                  <Image
                    src="/images/logo.jpg"
                    // src="/ShuleHub.png"
                    alt="logo"
                    width={200}
                    height={150}
                    className="object-contain w-full h-full "
                  />
                </div>
              </div>
              <div className="flex items-center py-3">
                <hr className="flex-grow border-gray-300" />
                <h3 className="px-4 text-[#1F4772] text-center">
                  Sign in to your Account
                </h3>
                <hr className="flex-grow border-gray-300" />
              </div>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                  <div className="capitalize text-xl mb-3">
                    {/* <label>username</label> */}
                  </div>
                  <div className=" relative">
                    <span className="absolute px-3 inset-y-0 left-0 flex items-center text-gray-400">
                      <BiUser size={24} color="" />
                    </span>

                    <input
                      className="w-full placeholder:capitalize px-10 py-3 border border-gray-300 focus:outline-none focus:border-blue-300 focus:bg-white text-lg text-gray-900 rounded-md"
                      type="text"
                      {...register("username")}
                      placeholder="enter username"
                    />
                  </div>
                  {errors.username && (
                    <p className="text-red-500">
                      {String(errors.username.message)}
                    </p>
                  )}
                </div>
                <div className="mt-6">
                  <div className="capitalize text-xl mb-3">
                    {/* <label>password</label> */}
                  </div>
                  <div className="relative">
                    <span className="absolute px-3 inset-y-0 left-0 flex items-center text-gray-400">
                      <IoLockClosedOutline size={24} color="" />
                    </span>
                    <input
                      className="w-full placeholder:capitalize px-10 py-3 border border-gray-300 focus:border-blue-300 focus:outline-none focus:bg-white text-lg rounded-md "
                      type={showPassword ? "text" : "password"}
                      {...register("password")}
                      placeholder="enter password"
                    />
                  </div>
                  {errors.password && (
                    <p className="text-red-500">
                      {String(errors.password.message)}
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

                  <div
                    onClick={redirectToResetPassword}
                    className="text-primary cursor-pointer text-xs lg:text-sm md:text-sm"
                  >
                    <span>Forgot password?</span>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className={`${
                      isSubmitting ? "bg-gray-100 text-gray-400" : "bg-[#28d196ff]"
                    } text-lg font-medium py-2 rounded-lg w-full flex items-center justify-center opacity-90 hover:opacity-100 border border-gray-300`}
                  >
                    {isSubmitting ? (
                      <div className="w-6 h-6 border-2 border-gray-300 border-t-primary rounded-full animate-spin"></div>
                    ) : (
                      <div className="flex items-center">
                        <IoLockClosedOutline
                          size={20}
                          className="text-white mr-2"
                        />
                        <span className="text-lg text-white font-medium">
                          Login
                        </span>
                      </div>
                    )}
                  </button>
                 
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default LoginPage;
