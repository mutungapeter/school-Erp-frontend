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
import { useCreateClassMutation, useGetClassesQuery } from "@/redux/queries/classes/classesApi";
import { format } from "date-fns";
import { formatDate } from "@/src/utils/dates";
import "../style.css";
import styles from "../custom.module.css";
import { useCreateStudentMutation } from "@/redux/queries/students/studentsApi";
import { useGetFormLevelsQuery } from "@/redux/queries/formlevels/formlevelsApi";
import { useGetStreamsQuery } from "@/redux/queries/streams/streamsApi";

interface CreateClassProps {
    refetchClasses: () => void;
}

export const CreateClassLevel = ({ refetchClasses }: CreateClassProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    isLoading: loadingFormLevels,
    data: formLevelsData,
    refetch: refetchFormLevels,
  } = useGetFormLevelsQuery({}, { refetchOnMountOrArgChange: true });
  const {
    isLoading: loadingStreams,
    data: streamsData,
    refetch:refetchStreams,
  } = useGetStreamsQuery({}, { refetchOnMountOrArgChange: true });
  const [createClass, { data, error, isSuccess }] =
  useCreateClassMutation();
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const today = new Date();
  const schema = z.object({
    
    form_level: z.string().min(1, "Select a Form level"),
    stream: z.string().min(1, "Select a class").optional().or(z.literal("")),
   
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
    const { form_level, stream,  } = data;
    try {
      await createClass(data).unwrap();
      toast.success("Class added successfully!");
      handleCloseModal();
      refetchClasses()
    } catch (error:any) {
     console.log("error", error)
      if (error?.data?.error) {
        toast.error(error.data.error);
      } else {
        toast.error("Failed to add Class. Please try again.");
      }
    }
  };
  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValue("form_level", e.target.value);
  };
  const handleStreamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValue("stream", e.target.value);
  };


  const handleOpenModal = () => setIsOpen(true);
  const handleCloseModal = () => setIsOpen(false);
console.log("formlevesdata", formLevelsData)
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
                  Add New Class
                </p>
 
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
         

              
                  <div className="relative">
                    <label
                      htmlFor="form_level"
                      className="block text-gray-700 text-sm  font-semibold mb-2"
                    >
                     Form Level
                    </label>
                    <select
                      id="form_level"
                      {...register("form_level")}
                      onChange={handleClassChange}
                      className="w-full appearance-none py-2 px-4 text-lg rounded-md border border-blue-500 focus:outline-none"
                    >
                      {loadingFormLevels ? (
                        <option value="">Loading...</option>
                      ) : (
                        <>
                          <option value="">Select Form level</option>
                          {formLevelsData?.map((fl: any) => (
                            <option key={fl.id} value={fl.id}>
                              {fl.name} 
                            </option>
                          ))}
                        </>
                      )}
                    </select>
                    <IoMdArrowDropdown
                      size={30}
                      className="absolute top-[60%] right-4 transform -translate-y-1/2 text-[#1F4772] pointer-events-none"
                    />
                    {errors.form_level && (
                      <p className="text-red-500 text-sm">
                        {String(errors.form_level.message)}
                      </p>
                    )}
                  </div>
                  <div className="relative">
                    <label
                      htmlFor="stream"
                      className="block text-gray-700 text-sm  font-semibold mb-2"
                    >
                    Stream
                    </label>
                    <select
                      id="stream"
                      {...register("stream")}
                      onChange={handleStreamChange}
                      className="w-full appearance-none py-2 px-4 text-lg rounded-md border border-blue-500 focus:outline-none"
                    >
                      {loadingStreams ? (
                        <option value="">Loading...</option>
                      ) : (
                        <>
                          <option value="">Select Stream</option>
                          {streamsData?.map((stream: any) => (
                            <option key={stream.id} value={stream.id}>
                              {stream.name} 
                            </option>
                          ))}
                        </>
                      )}
                    </select>
                    <IoMdArrowDropdown
                      size={30}
                      className="absolute top-[60%] right-4 transform -translate-y-1/2 text-[#1F4772] pointer-events-none"
                    />
                    {errors.stream && (
                      <p className="text-red-500 text-sm">
                        {String(errors.stream.message)}
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
