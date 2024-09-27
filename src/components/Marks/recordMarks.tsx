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
import { useRecorMarkMutation } from "@/redux/queries/marks/marksApi";
import { StudentSubject } from "@/src/definitions/students";

interface CreateStudentProps {
  refetchStudents: () => void;
}
interface Addmarkprops{
  studentSubject:StudentSubject;
}
  
export const AddMark = ({studentSubject}:Addmarkprops ) => {
    console.log("studentSubject",studentSubject)
  const [isOpen, setIsOpen] = useState(false);
 const [recorMark, { data, error, isSuccess }] =
 useRecorMarkMutation();
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const schema = z.object({
    cat_mark: z.number().min(0, "Cat mark must be a positive number").max(30, "Cat mark must be less than or equal to 30"),
    exam_mark: z.number().min(0, "Exam mark must be a positive number").max(70, "Exam mark must be less than or equal to 70"),
  });
  

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: zodResolver(schema),
  });
  const catMark = watch("cat_mark", 0);
  const examMark = watch("exam_mark", 0);

  
  const totalMark = Number(catMark) + Number(examMark);
  const onSubmit = async (data: FieldValues) => {
    const { cat_mark, exam_mark } = data;
    const studentId = studentSubject.student.id;
    const subjectId = studentSubject.id;

    try {
        const payload = {
            student:studentId,
            student_subject:subjectId,
            cat_mark: parseFloat(cat_mark), 
            exam_mark: parseFloat(exam_mark),
          };
          console.log(payload)
          await recorMark(payload).unwrap();
      toast.success("Mark recorded successfully!");
      handleCloseModal();
    } catch (error:any) {
        console.log(error)
        if (error?.data?.error) {
            toast.error(error.data.error);
          } else {
            toast.error("Failed to record mark. Please try again.");
          }
      
    }
  };


  const handleOpenModal = () => setIsOpen(true);
  const handleCloseModal = () => setIsOpen(false);

  return (
    <>
      <div
        onClick={handleOpenModal}
       className="p-2 rounded-md text-white bg-[#1F4772] cursor-pointer"
      >
        Record Marks
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
                  Record Mark for 
                </p>
 
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-3">
                  <div>
                    <label
                      htmlFor="cat"
                      className="block text-gray-700 font-semibold text-sm mb-2"
                    >
                      Cat Mark
                    </label>
                    <input
                      type="number"
                      id="cat"
                      placeholder="Enter cart mark"
                      {...register("cat_mark", { valueAsNumber: true })}
                      className="w-full py-2 px-4 rounded-md border border-blue-500 focus:outline-none"
                    />
                    {errors.cat_mark && (
                      <p className="text-red-500 text-sm">
                        {String(errors.cat_mark.message)}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="exam"
                      className="block text-gray-700 font-semibold mb-2"
                    >
                      Exam Mark
                    </label>
                    <input
                      type="number"
                      id="exam"
                      placeholder="Enter exam mark"
                      {...register("exam_mark", { valueAsNumber: true })}
                      className="w-full py-2 px-4 rounded-md border border-blue-500 focus:outline-none"
                    />
                    {errors.exam_mark && (
                      <p className="text-red-500 text-sm">
                        {String(errors.exam_mark.message)}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="total" className="block text-gray-700 font-semibold mb-2">
                    Total Marks
                  </label>
                  <input
                    type="number"
                    id="total"
                    value={totalMark}
                    readOnly
                    className="w-full py-2 px-4 rounded-md border border-gray-300 focus:outline-none bg-gray-200"
                  />
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
