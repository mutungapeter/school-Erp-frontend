import { FaChevronDown, FaPlus } from "react-icons/fa6";
import { IoMdArrowDropdown } from "react-icons/io";
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
import { useGetAvailableTeacherUsersQuery } from "@/redux/queries/users/usersApi";
import { useCreateTeacherMutation } from "@/redux/queries/teachers/teachersApi";

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

  const today = new Date();
  const schema = z.object({
    user: z.number().min(1, "User ID is required"),
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
    const { staff_no,user,gender} = data;
    // const formData = {
    //     user: Number(data.user), 
    //     staff_no: data.staff_no,
    //     gender: data.gender,
    //   };
    try {
      await createTeacher(data).unwrap();
      toast.success("Teacher added successfully!");
      handleCloseModal();
      refetchTeachers()
    } catch (error:any) {
     
      if (error?.data?.error) {
        console.log("error", error)
        toast.error(error.data.error);
      } else {
        toast.error("Failed to add Teacher. Please try again.");
      }
    }
  };
  const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // const selectedValue = e.target.value;
    // const userId = selectedValue ? Number(selectedValue) : '';
    setValue('user', e.target.value);
  };
 
  const handleOpenModal = () => setIsOpen(true);
  const handleCloseModal = () => setIsOpen(false);

  return (
    <>
      <div
        onClick={handleOpenModal}
        className="bg-[#36A000] cursor-pointer text-center justify-center text-white py-2 px-4 flex items-center space-x-3 rounded-md hover:bg-[#36A000]"
      >
        <FaPlus color="white" size={20} />
        <span>Add New</span>
      </div>

      {isOpen && (
        <div className="modal fixed z-50 w-full h-full top-0 left-0 flex items-start justify-center">
          <div
            className="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"
            onClick={handleCloseModal}
          ></div>

          <div className="modal-container bg-white  w-10/12 md:max-w-3xl mx-auto rounded shadow-lg z-50 mt-10 transform transition-all">
            {isSubmitting && <Spinner />}
            <div className="modal-content py-6 text-left px-6 ">
              <div className="flex justify-between items-center pb-3">
                <p className="text-2xl font-bold text-[#1F4772]">
                  Add New Teacher/Stafff
                </p>
 
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
           
                  <div>
                    <label
                      htmlFor="staff_no"
                      className="block text-gray-700 text-sm  font-semibold mb-2"
                    >
                      Staff Number
                    </label>
                    <input
                      type="text"
                      id="staff_no"
                      placeholder="Enter staff no"
                      {...register("staff_no")}
                      className="w-full py-2 px-4 rounded-md border border-blue-500 focus:outline-none"
                    />
                    {errors.staff_no && (
                      <p className="text-red-500 text-sm">
                        {String(errors.staff_no.message)}
                      </p>
                    )}
                  </div>
                 
            

            
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-5">
                  <div className="relative">
                    <label
                      htmlFor="user"
                      className="block text-gray-700 text-sm  font-semibold mb-2"
                    >
                      User
                    </label>
                    <select
                      id="user"
                      {...register("user", { valueAsNumber: true })}
                      onChange={handleUserChange}
                      className="w-full appearance-none py-2 px-4 text-lg rounded-md border border-blue-500 focus:outline-none"
                    >
                      {loadingTeacherUsers ? (
                        <option value="">Loading...</option>
                      ) : (
                        <>
                          <option value="">Select user</option>
                          {teacherUsersData?.map((user: any) => (
                            <option key={user.id} value={user.id}>
                              {user.first_name} {user.last_name}
                            </option>
                          ))}
                        </>
                      )}
                    </select>
                    <IoMdArrowDropdown
                      size={30}
                      className="absolute top-[60%] right-4 transform -translate-y-1/2 text-[#1F4772] pointer-events-none"
                    />
                    {errors.user && (
                      <p className="text-red-500 text-sm">
                        {String(errors.user.message)}
                      </p>
                    )}
                  </div>
                  <div className="relative">
                  <label
                    htmlFor="gender"
                    className="block text-gray-700 text-sm  font-semibold mb-2"
                  >
                    Gender
                  </label>
                  <select
                    id="gender"
                    {...register("gender")}
                    className="w-full appearance-none py-2 px-4 text-lg rounded-md border border-blue-500 focus:outline-none"
                  >
                    <option value="">Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                  <IoMdArrowDropdown
                    size={30}
                    className="absolute top-[60%] right-4 transform -translate-y-1/2 text-[#1F4772] pointer-events-none"
                  />
                  {errors.gender && (
                    <p className="text-red-500 text-sm">
                      {String(errors.gender.message)}
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
                    disabled={isSubmitting}
                    className="bg-[#36A000] text-white rounded-md px-6 py-3 hover:bg-[#36A000] focus:outline-none"
                  >
                    {isSubmitting ? "Submitting..." : "Submit"}
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
