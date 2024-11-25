import { useRecorMarkMutation } from "@/redux/queries/marks/marksApi";
import { useGetActiveTermsQuery, useGetTermsQuery } from "@/redux/queries/terms/termsApi";
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
interface CreateStudentProps {
  refetchStudents: () => void;
}
interface Addmarkprops {
  studentSubject: StudentSubject;
}

export const AddMark = ({ studentSubject }: Addmarkprops) => {
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
    cat_mark: z
      .number()
      .min(0, "Cat mark must be a positive number")
      .max(30, "Cat mark must be less than or equal to 30"),
    exam_mark: z
      .number()
      .min(0, "Exam mark must be a positive number")
      .max(70, "Exam mark must be less than or equal to 70"),
    term: z.number().min(1, "Term is required"),
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

  const handleTermChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValue("term", e.target.value);
  };
  const totalMark = Number(catMark) + Number(examMark);
  const onSubmit = async (data: FieldValues) => {
    const { cat_mark, exam_mark, term } = data;
    const studentId = studentSubject.student.id;
    const subjectId = studentSubject.id;

    try {
      const payload = {
        student: studentId,
        student_subject: subjectId,
        cat_mark: parseFloat(cat_mark),
        exam_mark: parseFloat(exam_mark),
        term,
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
  const handleCloseModal = () => setIsOpen(false);

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
              <div className="relative transform animate-fadeIn overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 w-full sm:max-w-2xl p-4 md:p-6 lg:p-6 md:max-w-2xl">
                {isSubmitting && <Spinner />}

                <div className="flex justify-between items-center pb-3">
                  <p className="lg:text-2xl md:text-2xl text-sm font-bold text-[#1F4772]">
                    Record Marks
                  </p>
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
                        Cat Mark
                      </label>
                      <input
                        type="number"
                        id="cat"
                        placeholder="Enter cart mark"
                        {...register("cat_mark", { valueAsNumber: true })}
                        className="w-full py-2 px-4 rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
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
                        className="block text-gray-900 md:text-lg text-sm lg:text-lg  font-normal  mb-2"
                      >
                        Exam Mark
                      </label>
                      <input
                        type="number"
                        id="exam"
                        placeholder="Enter exam mark"
                        {...register("exam_mark", { valueAsNumber: true })}
                        className="w-full py-2 px-4 rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
                      />
                      {errors.exam_mark && (
                        <p className="text-red-500 text-sm">
                          {String(errors.exam_mark.message)}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-3">
                    <div className="relative">
                      <label
                        htmlFor="term"
                        className="block text-gray-900 md:text-lg text-sm lg:text-lg  font-normal  mb-2"
                      >
                        Term
                      </label>
                      <select
                        id="term"
                        {...register("term", { valueAsNumber: true })}
                        onChange={handleTermChange}
                        className="w-full appearance-none py-2 px-4 text-sm md:text-md lg:text-md rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
                      >
                        {loadingTerms ? (
                          <option value="">Loading...</option>
                        ) : (
                          <>
                            <option value="">Select Term</option>
                            {termsData?.map((term: any) => (
                              <option key={term.id} value={term.id}>
                                {term.term} - {term.calendar_year}
                              </option>
                            ))}
                          </>
                        )}
                      </select>
                      <BsChevronDown
                        color="gray"
                        size={16}
                        className="absolute top-[74%] right-4 transform -translate-y-1/2 text-[#1F4772] pointer-events-none"
                      />
                      {errors.term && (
                        <p className="text-red-500 text-sm">
                          {String(errors.term.message)}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="total"
                        className="block text-gray-900 md:text-lg text-sm lg:text-lg  font-normal  mb-2"
                      >
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
                  </div>
                  <div className="flex justify-between mt-6">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="bg-gray-400 text-white rounded-md  py-2 px-3 md:px-6 md:py-3 lg:px-6 lg:py-3 text-xs lg:text-sm md:text-sm hover:bg-gray-500 focus:outline-none"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-primary text-white rounded-md  py-2 px-3 md:px-6 md:py-3 lg:px-6 lg:py-3 text-xs lg:text-sm md:text-sm hover:bg-primary focus:outline-none"
                    >
                      {isSubmitting ? "Submitting..." : "Submit"}
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
