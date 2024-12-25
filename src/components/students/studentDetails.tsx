import { usePermissions } from "@/src/hooks/hasAdminPermission";
import AssignElectives from "./assignElectives";
import UpdateElectives from "./updateElectives";
import { FaDigitalTachograph } from "react-icons/fa";
import { PiChalkboardTeacherBold } from "react-icons/pi";
import {
  useGetStudentPerformanceQuery,
  useGetStudentQuery,
} from "@/redux/queries/students/studentsApi";
import StudentPerformanceChart from "../perfomance/studentPerformace";
import PageLoadingSpinner from "@/src/components/layouts/PageLoadingSpinner";
import Image from "next/image";
import { ClassLevel } from "@/src/definitions/classlevels";
import {
  useDeleteClassLevelsMutation,
  useGetClassesQuery,
} from "@/redux/queries/classes/classesApi";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { BsChevronDown } from "react-icons/bs";

import ContentSpinner from "../perfomance/contentSpinner";
import { MdOutlineCalendarMonth } from "react-icons/md";
import { FaUserTie } from "react-icons/fa6";
import { FaPhoneAlt } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import Link from "next/link";
import Announcements from "../adminDashboard/dashboard/Announcements";
interface StudentDetailsProps {
  student_id: number;
}

const StudentDetails = ({ student_id }: StudentDetailsProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialFilters = useMemo(
    () => ({
      class_level_id: searchParams.get("class_level_id") || "",
    }),
    [searchParams]
  );
  const [filters, setFilters] = useState(initialFilters);
  const {
    data,
    isLoading: isLoadingStudent,
    isSuccess,
    error: isErrorLoadingStudent,
    refetch: refetchStudent,
  } = useGetStudentQuery({
    id: student_id,
    class_level_id: filters.class_level_id,
  });
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.class_level_id) {
      params.set("class_level_id", filters.class_level_id);
    }

    router.push(`?${params.toString()}`);
  }, [filters]);

  console.log("data", data);
  const level = data?.class_level?.level;
  console.log("level", level);
  const subjectCount = data?.subjects?.length;
  const studentId = data?.id;
  // console.log("student", studentId)
  const {
    hasAdminPermissions,
    hasClassMasterPermissions,
    loading: loadingPermissions,
  } = usePermissions();
  const {
    data: performanceData,
    refetch,
    error: errorLoadingPerformance,
    isLoading: isLoadingPerformance,
  } = useGetStudentPerformanceQuery({
    id: studentId,
    term_id: data?.current_term,
  });
  const {
    isLoading: loadingClasses,
    data: classesData,
    refetch: refetchClasses,
  } = useGetClassesQuery({}, { refetchOnMountOrArgChange: true });
  
  const refetchDetails = () => {
    refetchStudent();
  };
  const handleFilterChange = (
    e: ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setFilters((prev) => ({ ...prev, [name]: value }));
  };
  if (isLoadingStudent || loadingPermissions || loadingClasses) {
    return <PageLoadingSpinner />;
  }
  return (
    <>
  
    <div className="flex items-center justify-end py-3">
 
    </div>
      <div className="flex-1  flex flex-col gap-4 xl:flex-row">
        <div className="w-full xl:w-2/3">
          {/* TOP */}
          {/* border-[#E60A14] */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* USER INFO CARD */}
            <div className="bg-blue-100 py-6 px-4 rounded-md shadow-sm border border-blue-600   flex-1 flex gap-4">
              <div className="w-25 h-25 ">
                <Image
                  src="/profile.png"
                  alt=""
                  width={144}
                  height={144}
                  className="w-25 h-25 rounded-full object-cover"
                />
              </div>
              <div className="w-2/3 flex flex-col justify-between gap-4">
                <div className="flex items-center gap-4">
                  <h1 className="text-xl text-blue-600 font-semibold">
                    {data?.first_name} {data?.last_name}
                  </h1>
                </div>
               
                <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
                  <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                    <FaDigitalTachograph className="text-blue-600 w-4 h-4" />
                    <span> {data?.admission_number}</span>
                  </div>
                  <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                    <PiChalkboardTeacherBold className="text-blue-600 w-4 h-4" />
                    <span> {data?.class_level.name}</span>
                  </div>
                </div>
              </div>
            </div>
            {/* SMALL CARDS */}
            <div className="flex-1 flex gap-4 justify-between flex-wrap">
              {/* CARD */}
              <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
                <Image
                  src="/icons/singleAttendance.png"
                  alt=""
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
                <div className="">
                  <h1 className="text-xl font-semibold">50%</h1>
                  <span className="text-sm text-gray-400">Attendance</span>
                </div>
              </div>
              {/* CARD */}
              <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
                <Image
                  src="/icons/singleBranch.png"
                  alt=""
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
                <div className="">
                  <h1 className="text-xl font-semibold">{subjectCount}</h1>
                  <span className="text-sm text-gray-400">Subjects</span>
                </div>
              </div>
              {/* CARD */}
              <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
                <Image
                  src="/icons/singleLesson.png"
                  alt=""
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
                <div className="">
                  <h1 className="text-xl font-semibold">0</h1>
                  <span className="text-sm text-gray-400">Lessons</span>
                </div>
              </div>
              {/* CARD */}
              <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
                <Image
                  src="/icons/singleClass.png"
                  alt=""
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
                <div className="">
                  {/* <h1 className="text-xl font-semibold">0</h1> */}
                  <span className="text-sm text-gray-400">
                    {data?.class_level.name}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* <div className="mt-4 bg-white  rounded-md shadow-sm p-4 h-auto min-h-[400px]">
            <div className="flex flex-col gap-3 lg:gap-0 md:gap-0 lg:items-center md:items-center lg:flex-row md:flex-row md:justify-between lg:justify-between p-2 bg-light mb-5">
              <h2 className="text-black font-semibold  md:text-2xl lg:text-2xl ">
                Subjects
              </h2>
              <div className="flex flex-col md:flex-row lg:flex-row lg:items-center md:items-center gap-4 md:gap-4 lg:gap-4 w-full md:w-auto">
              <div className="flex items-center self-end gap-4 ">
              {(hasAdminPermissions() || hasClassMasterPermissions()) && (
                <div className=" inline-flex">
                  {level >= 3 && subjectCount > 5 ? (
                    <UpdateElectives
                      studentsData={data}
                      refetchDetails={refetchDetails}
                    />
                  ) : level >= 3 && subjectCount === 5 ? (
                    <AssignElectives
                      studentId={data?.id}
                      refetchDetails={refetchDetails}
                    />
                  ) : null}
                </div>
              )}
              </div>
              <div className="relative w-full lg:w-56 md:w-56 xl:w-56  ">
            <select
              name="class_level_id"
              value={filters.class_level_id || ""}
              onChange={handleFilterChange}
              className="w-full lg:w-56 md:w-56 xl:w-56
             appearance-none py-2 px-4
               text-sm md:text-lg lg:text-lg font-normal rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
            >
              <option value="">---Filter by class---</option>
              {classesData?.map((classLevel: ClassLevel) => (
                <option key={classLevel.id} value={classLevel.id}>
                  {classLevel.name} {classLevel?.stream?.name} - {classLevel.calendar_year}
                </option>
              ))}
            </select>
            <BsChevronDown
              color="gray"
              size={20}
              className="absolute top-[50%] right-4 transform -translate-y-1/2 text-[#1F4772] pointer-events-none"
            />
          </div>
                </div>
             
            </div>
            <div className=" w-full  relative p-3 rounded-sm  overflow-x-auto  ">
              <table className="w-full    bg-white text-sm border text-left rounded-md rtl:text-right text-gray-500 ">
                <thead className="text-xs text-gray-700 uppercase border-b bg-gray-50 rounded-t-md">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      #
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Subject
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Subject category
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isLoadingStudent ? (
                    <div className="flex justify-center items-center py-6">
                      <ContentSpinner />
                    </div>
                  ) : isErrorLoadingStudent ? (
                    <tr>
                      <td colSpan={8} className=" py-4">
                        <div className="flex items-center justify-center space-x-6 font-semibold text-sm md:text-md lg:text-md text-red-500">
                          <span>
                            {(isErrorLoadingStudent as any)?.data?.error ||
                              "No data to show"}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ) : data && data.subjects.length > 0 ? (
                    data?.subjects?.map((subject: any, index: number) => (
                      <tr key={index} className="bg-white border-b">
                        <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap">
                          {index + 1}
                        </td>
                        <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap">
                          {subject.subject.subject_name}
                        </td>
                        <td className="px-6 py-2 font-medium text-gray-500 whitespace-nowrap">
                          {subject.subject.subject_type}
                        </td>
                        <td className="px-6 py-2 font-medium text-gray-500 whitespace-nowrap">
                          {subject.subject.category}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="text-center py-4">
                        <span className="text-sm lg:text-lg md:text-lg text-red-500">
                          No data to show
                        </span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
          </div> */}
          <div className="mt-4 w-full m-h-[400px] overflow-x-auto bg-white rounded-md shadow-sm">
      {isLoadingPerformance ? (
          <div className="flex justify-center items-center py-6">
            <ContentSpinner /> 
          </div>
        ) : (
          <StudentPerformanceChart performanceData={performanceData} />
        )}
        
      </div>
        </div>
        <div className="w-full xl:w-1/3 flex flex-col gap-4">
        <div className="bg-white p-4 rounded-md">
            <h1 className="text-xl font-semibold">Shortcuts</h1>
            <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500">
              <Link className="p-3 rounded-md bg-lamaSkyLight" href={`/students/${student_id}/subjects`}>
                Student&apos;s subjects
              </Link>
             
              <Link className="p-3 rounded-md bg-lamaYellowLight" href="#">
                Student&apos;s Lessons
              </Link>
              <Link className="p-3 rounded-md bg-pink-50" href="#">
                Student&apos;s Exams
              </Link>
              <Link className="p-3 rounded-md bg-lamaSkyLight" href="#">
                Student&apos;s Assignments
              </Link>
            </div>
          </div>
          
          <Announcements />
        </div>
      </div>
    </>
  );
};

export default StudentDetails;
