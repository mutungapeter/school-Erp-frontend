"use client";
import { formattDate } from "@/src/utils/dates";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import DatePicker from "react-datepicker";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import { useGetClassesQuery } from "@/redux/queries/classes/classesApi";
import { useGetFormLevelsQuery } from "@/redux/queries/formlevels/formlevelsApi";
import { addMonths, subMonths } from "date-fns";
import { PiCalendarDotsLight } from "react-icons/pi";
import { ClassLevel } from "@/src/definitions/classlevels";
import { FormLevel } from "@/src/definitions/formlevels";
import { formatYear } from "@/src/utils/dates";
import { BsChevronDown } from "react-icons/bs";
import { IoCloseOutline } from "react-icons/io5";
import { LuRefreshCcw } from "react-icons/lu";
import Spinner from "../../layouts/spinner";
import "../../style.css";
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import { useUploadStudentsMutation } from "@/redux/queries/students/studentsApi";

const termsData = [
  { id: 1, term: "Term 1", start_date: "", end_date: "" },
  { id: 2, term: "Term 2", start_date: "", end_date: "" },
  { id: 3, term: "Term 3", start_date: "", end_date: "" },
];

interface Props {
  refetchStudents: () => void;
}

const UploadStudents = ({ refetchStudents }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [calendarYear, setCalendarYear] = useState<number>(
    parseInt(formatYear(new Date()))
  );
  const {
    isLoading: loadingFormLevels,
    data: formLevelsData,
    refetch,
  } = useGetFormLevelsQuery({}, { refetchOnMountOrArgChange: true });
  const {
    isLoading: loadingClasses,
    data: classesData,
    refetch: refetchClasses,
  } = useGetClassesQuery({}, { refetchOnMountOrArgChange: true });

  const termsObj = z.object({
    term: z.string(),
    start_date: z.string().date(),
    end_date: z.string().date(),
  });
  const schema = z.object({
    class_level: z.number().min(1, "Select current class").optional(),
    form_level: z.number().min(1, "Select target Form Level").optional(),
    calendar_year: z.number().min(4, "Enter a valid year"),
    stream: z.number().min(4, "Stream is required").optional(),
    terms: z.array(termsObj),
    admission_type: z.enum(["New Admission", "Transfer"], {
      errorMap: () => ({ message: "Select admission type" }),
    }),
    students_file: z
      .any()
      .refine(
        (fileList) => fileList instanceof FileList && fileList.length > 0,
        {
          message: "Please upload a valid file",
        }
      ),
  });
  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    watch,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      class_level: undefined,
      form_level: undefined,
      calendar_year: calendarYear,
      admission_type: undefined,
      stream: undefined,
      terms: termsData,
      students_file: undefined,
    },
  });
  const handleStreamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const streamValue = e.target.value
      ? parseInt(e.target.value, 10)
      : undefined;
    setValue("stream", streamValue);
  };

  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const classValue = e.target.value
      ? parseInt(e.target.value, 10)
      : undefined;
    setValue("class_level", classValue);
  };
  const handleOpenModal = () => {
    setIsOpen(true)
  };
  const handleCloseModal = () => {
    reset();
    setIsOpen(false);
  };

  return <>
   <div 
          onClick={handleOpenModal}
          className=" py-2 px-3 bg-green-700 cursor-pointer text-sm text-white rounded-md inline-flex items-center space-x-2 max-w-max">
                <PiMicrosoftExcelLogoFill size={20} className="text-white" />
                <span>Upload students</span>
              </div>
  </>;
};
export default UploadStudents;
