
import { useState } from "react";
import { toast } from "react-toastify";
import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useCreateSubjectMutation,
  useGetSubjectCategoriesQuery,
} from "@/redux/queries/subjects/subjectsApi";
import Spinner from "../layouts/spinner";
import { FaCalendarAlt } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useGetClassesQuery } from "@/redux/queries/classes/classesApi";
import { format } from "date-fns";
import { formatDate } from "@/src/utils/dates";
import "../style.css";
import styles from "../custom.module.css";
import { useCreateStudentMutation } from "@/redux/queries/students/studentsApi";
import { useCreateUserMutation } from "@/redux/queries/users/usersApi";
import { FaPlusCircle } from "react-icons/fa";
import { BsChevronDown } from "react-icons/bs";

interface CreateAccountProps {
  refetchUsers: () => void;
}

export const CreateAccount = ({ refetchUsers }: CreateAccountProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [Open, setOpen] = useState(false);
  const {
    isLoading: loadingClassLevels,
    data: ClassLevelsData,
    refetch,
  } = useGetClassesQuery({}, { refetchOnMountOrArgChange: true });
  const [createUser, { data, error, isSuccess }] = useCreateUserMutation();
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [showPassword, setShowPassword] = useState(false);
  const today = new Date();
  const schema = z.object({
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    phone_number: z.string().min(1, "Phone number is required"),
    email: z.string().email("Invalid email address"),
    username: z.string().min(1, "Username is required"),
    password: z
      .string()
      .min(4, "Password should be at least 4 characters long"),
    role: z.enum(["Admin", "Principal"], {
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

  const onSubmit = async (data: FieldValues) => {
    const {
      first_name,
      last_name,
      phone_number,
      username,
      email,
      role,
      password,
    } = data;
    try {
      await createUser(data).unwrap();
      toast.success("Account created successfully!");
      handleCloseModal();
      refetchUsers();
    } catch (error: any) {
      if (error?.data?.error) {
        toast.error(error.data.error);
      } else {
        toast.error("Failed to Create account. Please try again.");
      }
    }
  };
  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValue("class_level", e.target.value);
  };
  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    const formattedDate = date ? formatDate(date) : "";
    setValue("birth_date", formattedDate);
  };

  const handleOpenModal = () => setIsOpen(true);
  const handleCloseModal = () => setIsOpen(false);

  return (
    <>
      <div
        onClick={handleOpenModal}
        className=" cursor-pointer text-center md:py-2 md:px-4 py-1 px-2  lg:py-2 lg:px-4  bg-green-700 rounded-sm  flex items-center md:space-x-2 space-x-1 lg:space-x-2 "
      >
        <FaPlusCircle size={20} className="text-white   " />
        <span className=" lg:text-lg md:text-lg text-xs text-white">
          Add Admin Account
        </span>
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
              <div className="relative transform animate-fadeIn overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 w-full sm:max-w-2xl p-4 md:p-6 lg:p-6 md:max-w-2xl">
                {isSubmitting && <Spinner />}

                <div className="flex justify-between items-center pb-3">
                  <p className="font-semibold text-black  md:text-lg text-md lg:text-lg">
                    Create Admin/Principal Account
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
                        className="w-full appearance-none py-2 px-4 text-lg rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
                      >
                        <option value="">Select Role</option>
                        <option value="Admin">Admin</option>
                        <option value="Principal">Principal</option>
                      </select>
                      <BsChevronDown 
                      color="gray" 
                      size={20}
                        className="absolute top-[70%] right-4 transform -translate-y-1/2 text-[#1F4772] pointer-events-none"
                      />
                      {errors.role && (
                        <p className="text-red-500 text-sm">
                          {String(errors.role.message)}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="block text-gray-900 md:text-lg text-sm lg:text-lg  font-normal  mb-2"
                    >
                      Password
                    </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      placeholder="Enter password"
                      {...register("password")}
                      className="w-full py-2 px-4 rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
                    />
                    {errors.password && (
                      <p className="text-red-500 text-sm">
                        {String(errors.password.message)}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      className="w-5 h-5"
                      onChange={() => setShowPassword(!showPassword)}
                    />
                    <span className="text-gray-700">Show Password</span>
                  </div>
                  <div className="flex justify-between mt-6">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="bg-gray-400 text-white rounded-md py-1 px-2 md:px-4 md:py-2 lg:px-4 lg:py-2 text-xs lg:text-sm md:text-sm hover:bg-gray-500 focus:outline-none"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-[#36A000] text-white rounded-md py-1 px-2 md:px-4 md:py-2 lg:px-4 lg:py-2 text-xs lg:text-sm md:text-sm hover:bg-[#36A000] focus:outline-none"
                    >
                      {isSubmitting ? "Creating..." : "Submit"}
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
