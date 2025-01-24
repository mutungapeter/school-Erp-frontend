import { useRecorMarkMutation } from "@/redux/queries/marks/marksApi";
import {
  useGetActiveTermsQuery,
  useGetTermsQuery,
} from "@/redux/queries/terms/termsApi";
import { StudentSubject } from "@/src/definitions/students";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { FieldValues, useForm } from "react-hook-form";
import { FiPlus } from "react-icons/fi";
import { toast } from "react-toastify";
import { z } from "zod";
import Spinner from "../layouts/spinner";
import "../style.css";
import { BsChevronDown } from "react-icons/bs";
import { IoCloseOutline } from "react-icons/io5";
import { TermInterface } from "@/src/definitions/terms";

interface Addmarkprops {
  studentSubject: StudentSubject;
  terms: TermInterface[] | [];
  term:TermInterface;
}

export const AddMark = ({ studentSubject, terms, term }: Addmarkprops) => {
  // console.log("studentSubject", studentSubject);
  const [isOpen, setIsOpen] = useState(false);
  const [recorMark, { data, error, isSuccess }] = useRecorMarkMutation();
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const {
    isLoading: loadingTerms,
    data: termsData,
    refetch: refetchTerms,
  } = useGetActiveTermsQuery({}, { refetchOnMountOrArgChange: true });
  const schema = z.object({
    total_score: z
    .coerce
    .number()
    .min(0, "Exam marks must be a positive number")
    .max(100, "Exam mark must be less than or equal to 100"),
    exam_type: z.enum(["Midterm", "Endterm"], {
      errorMap: () => ({ message: "Exam type is required" }),
    }),
    // exam_mark: z.coerce
    //   .number()
    //   .min(0, "Exam mark must be a positive number")
    //   .max(70, "Exam mark must be less than or equal to 70"),
    // term: z.coerce.number().min(1, "Term is required"),
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: zodResolver(schema),
  });
  // const catMark = watch("cat_mark", 0);
  // const examMark = watch("exam_mark", 0);

  const handleTermChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValue("term", e.target.value);
  };
  // const totalMark = Number(catMark) + Number(examMark);
  const onSubmit = async (data: FieldValues) => {
    const {total_score, exam_type } = data;
    const studentId = studentSubject.student.id;
    const subjectId = studentSubject.id;
    const term_id = term?.id;

    try {
      const payload = {
        student: studentId,
        student_subject: subjectId,
        total_score: parseFloat(total_score),
        exam_type: exam_type,
        term:term_id
      };
      console.log(payload);
      await recorMark(payload).unwrap();
      toast.success("Mark recorded successfully!");
      handleCloseModal();
    } catch (error: any) {
      console.log(error);
      if (error?.data?.error) {
        toast.error(error.data.error);
      } else {
        toast.error("Failed to record mark. Please try again.");
      }
    }
  };

  const handleOpenModal = () => setIsOpen(true);
  const handleCloseModal = () => {
    reset();
    setIsOpen(false);
  };

  return (
    <>
      <div
        onClick={handleOpenModal}
        className=" cursor-pointer lg:text-center md:text-center  py-1 px-2    bg-green-700 rounded-sm  flex items-center md:space-x-2 space-x-1 lg:space-x-2 "
      >
        <FiPlus size={16} className="text-white   " />
        <span className=" lg:text-sm md:text-sm text-xs text-white">
          Add Marks
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
              <div className="relative transform animate-fadeIn overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 w-full sm:max-w-lg p-4 md:p-6 lg:p-6 md:max-w-lg">
                {isSubmitting && <Spinner />}

                <div className="flex justify-between items-center pb-3">
                  <p className="lg:text-2xl md:text-2xl text-md font-bold text-black">
                    Record Marks
                  </p>
                  <div className="flex justify-end cursor-pointer">
                    <IoCloseOutline
                      size={30}
                      onClick={handleCloseModal}
                      className=" text-gray-500 "
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-3 py-2">
                  <div>
                    <label
                      htmlFor="student"
                      className="block text-gray-900 md:text-lg text-sm lg:text-lg font-normal mb-2"
                    >
                      Student
                    </label>
                    <div
                      id="student"
                      className="w-full py-2 px-4 rounded-md font-semibold border border-gray-400 shadow-sm bg-gray-100"
                    >
                      {studentSubject.student.first_name +
                        " " +
                        studentSubject.student.last_name}
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-gray-900 md:text-lg text-sm lg:text-lg font-normal mb-2"
                    >
                      Subject
                    </label>
                    <div
                      id="subject"
                      className="w-full py-2 px-4 rounded-md font-semibold border border-gray-400  shadow-sm bg-gray-100"
                    >
                      {studentSubject.subject.subject_name}
                    </div>
                  </div>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-3">
                    <div>
                      <label
                        htmlFor="cat"
                        className="block text-gray-900 md:text-lg text-sm lg:text-lg  font-normal  mb-2"
                      >
                        Exam marks
                      </label>
                      <input
                        type="number"
                        id="total_score"
                        placeholder="Enter exam_marks"
                        {...register("total_score")}
                        className="w-full py-2 px-4 rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
                      />
                      {errors.total_score && (
                        <p className="text-red-500 text-sm">
                          {String(errors.total_score.message)}
                        </p>
                      )}
                    </div>
                    <div>
                    <label
                      htmlFor="subject"
                      className="block text-gray-900 md:text-lg text-sm lg:text-lg font-normal mb-2"
                    >
                      Term
                    </label>
                    <div
                      id="subject"
                      className="w-full py-2 px-4 rounded-md font-semibold border border-gray-400  shadow-sm bg-gray-100"
                    >
                      {term?.term}
                    </div>
                  </div>
                    {/* <div>
                      <label
                        htmlFor="exam"
                        className="block text-gray-900 md:text-lg text-sm lg:text-lg  font-normal  mb-2"
                      >
                        Exam Mark
                      </label>
                      <input
                        type="number"
                        id="exam"
                        placeholder="Enter exam mark"
                        {...register("exam_mark")}
                        className="w-full py-2 px-4 rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
                      />
                      {errors.exam_mark && (
                        <p className="text-red-500 text-sm">
                          {String(errors.exam_mark.message)}
                        </p>
                      )}
                    </div> */}
                  </div>
                  <div className="relative">
                  <label
                    htmlFor="exam_type"
                    className="block text-gray-900 md:text-lg text-sm lg:text-lg  font-normal  mb-2"
                  >
                   Exam type
                  </label>
                  <select
                    id="exam_type"
                    {...register("exam_type")}
                    className="w-full appearance-none py-2 px-4 text-md rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
                  >
                    <option value="">--- Exam Type ---</option>
                    <option value="Midterm">Midterm</option>
                    <option value="Endterm">Endterm</option>
                  </select>
                  <BsChevronDown 
                      color="gray" 
                      size={20}
                    className="absolute top-[70%] right-4 transform -translate-y-1/2 text-[#1F4772] pointer-events-none"
                  />
                </div>
                  <div className="flex justify-start lg:justify-end md:justify-end  py-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className=" inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4
                       focus:outline-none focus:ring-blue-300 font-medium  text-sm space-x-4
                       text-white rounded-md  px-5 py-2"
                    >
                      {/* <LiaEdit className="text-white " size={18} /> */}
                      <span>
                        {isSubmitting ? "Submitting..." : "Save Marks"}
                      </span>
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
