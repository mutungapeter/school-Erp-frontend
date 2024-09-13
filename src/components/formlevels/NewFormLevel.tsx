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
import { useCreateUserMutation } from "@/redux/queries/users/usersApi";
import { useCreateFormLevelMutation } from "@/redux/queries/formlevels/formlevelsApi";

interface CreateFormLevelsProps {
  refetchFormLevels: () => void;
}

export const CreateFormLevel = ({ refetchFormLevels }: CreateFormLevelsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const [createFormLevel, { data, error, isSuccess }] =
  useCreateFormLevelMutation();
  
  const today = new Date();
  const schema = z.object({
    name: z.string().min(1, "Form naame is required"),
    level: z.string().min(1, "Level is required"),
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
    const { name, level } = data;
    try {
      await createFormLevel(data).unwrap();
      toast.success("Form Level created successfully!");
      handleCloseModal();
      refetchFormLevels()
    } catch (error:any) {
     
      if (error?.data?.error) {
        toast.error(error.data.error);
      } else {
        toast.error("Failed to Create Form Level. Please try again.");
      }
    }
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
                 Add New Form Level
                </p>
 
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
            
                  <div>
                    <label
                      htmlFor="Name"
                      className="block text-gray-700 font-semibold text-sm mb-2"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="Name"
                      placeholder="name e.g Form One , Form Two"
                      {...register("name")}
                      className="w-full py-2 px-4 rounded-md border border-blue-500 focus:outline-none"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm">
                        {String(errors.name.message)}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="Level"
                      className="block text-gray-700 font-semibold mb-2"
                    >
                     Level
                    </label>
                    <input
                      type="number"
                      id="Level"
                      placeholder="Enter level e.g 1 for Form One "
                      {...register("level")}
                      className="w-full py-2 px-4 rounded-md border border-blue-500 focus:outline-none"
                    />
                    {errors.level && (
                      <p className="text-red-500 text-sm">
                        {String(errors.level.message)}
                      </p>
                    )}
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
