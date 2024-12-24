import { useCreateTeacherMutation } from "@/redux/queries/teachers/teachersApi";
import { useGetAvailableTeacherUsersQuery } from "@/redux/queries/users/usersApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { FieldValues, useForm } from "react-hook-form";
import { FaPlus, FaPlusCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import { z } from "zod";
import Spinner from "../layouts/spinner";
import "../style.css";
import { BsChevronDown } from "react-icons/bs";
import { IoCloseOutline } from "react-icons/io5";
import { BiCheckCircle } from "react-icons/bi";
interface CreateTeacherProps {
  refetchTeachers: () => void;
}

export const CreateTeacher = ({ refetchTeachers }: CreateTeacherProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    isLoading: loadingTeacherUsers,
    data: teacherUsersData,
    refetch,
  } = useGetAvailableTeacherUsersQuery({}, { refetchOnMountOrArgChange: true });
  const [createTeacher, { data, error, isSuccess }] =
    useCreateTeacherMutation();
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
    staff_no: z.string().min(1, "staff number is required"),
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

  const onSubmit = async (data: FieldValues) => {
    const { staff_no, user, gender } = data;
    try {
      await createTeacher(data).unwrap();
      toast.success("Teacher added successfully!");
      handleCloseModal();
      refetchTeachers();
    } catch (error: any) {
      if (error?.data?.error) {
        console.log("error", error);
        toast.error(error.data.error);
      } else {
        toast.error("Failed to add Teacher. Please try again.");
      }
    }
  };
  const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValue("user", e.target.value);
  };

  const handleOpenModal = () => setIsOpen(true);
  const handleCloseModal = () => setIsOpen(false);

  return (
    <>
       <button
  onClick={handleOpenModal}
  className="cursor-pointer inline-flex text-center p-2 bg-green-700 rounded-full"

>
  <FaPlus size={18} className="text-white" />
</button>


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
              <div className="relative transform animate-fadeIn overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-4 w-full sm:max-w-xl p-4 md:p-5 lg:p-5 md:max-w-xl">
                {isSubmitting && <Spinner />}

                <div className="flex justify-between items-center pb-3">
                  <p className="text-sm md:text-lg lg:text-lg font-semibold text-black">
                    Add New Teacher/Staff
                  </p>
                  <div className="flex justify-end cursor-pointer">
                    <IoCloseOutline
                      size={35}
                      onClick={handleCloseModal}
                      className=" text-gray-500 "
                    />
                  </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                      
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
                  
                
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-3">
                  <div>
                      
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
                    <div>
                     
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
                   
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-3">
                    <div>
                    
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

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-5">
                  <div>
                     
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
                    <div className="relative">
                     
                      <select
                        id="gender"
                        {...register("gender")}
                        className="w-full appearance-none py-2 px-4 text-lg rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
                      >
                        <option value="">Select gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                      <BsChevronDown 
                      color="gray" 
                      size={20}
                        className="absolute top-[50%] right-4 transform -translate-y-1/2 text-[#1F4772] pointer-events-none"
                      />
                      {errors.gender && (
                        <p className="text-red-500 text-sm">
                          {String(errors.gender.message)}
                        </p>
                      )}
                    </div>

                   
                  </div>
                  <div>
                  <div>
                    
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
                      <span  className="block text-gray-900 md:text-lg text-sm lg:text-lg  font-normal  mb-2">Show Password</span>
                    </div>
                  </div>

                  <div className="flex justify-start lg:justify-end md:justify-end mt-3 py-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4
                       focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm space-x-4
                       text-white rounded-md  px-5 py-2"
                    >
                      <BiCheckCircle className="text-white " size={18} />
                     <span> {isSubmitting ? "Submitting..." : "Save Teacher"}</span>
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
