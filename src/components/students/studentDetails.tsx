import {
  useGetClassesQuery
} from "@/redux/queries/classes/classesApi";
import {
  useGetStudentPerformanceQuery,
  useGetStudentQuery,
} from "@/redux/queries/students/studentsApi";
import PageLoadingSpinner from "@/src/components/layouts/PageLoadingSpinner";
import { usePermissions } from "@/src/hooks/hasAdminPermission";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { FaDigitalTachograph } from "react-icons/fa";
import { PiChalkboardTeacherBold } from "react-icons/pi";
import StudentPerformanceChart from "../perfomance/studentPerformace";

import Link from "next/link";
import Announcements from "../adminDashboard/dashboard/Announcements";
import ContentSpinner from "../perfomance/contentSpinner";
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
                  src="/images/profile.jpg"
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

          <div className="mt-4 w-full m-h-[400px] overflow-x-auto bg-white rounded-md shadow-sm">
      {isLoadingPerformance ? (
          <div className="flex justify-center items-center py-6">
            <ContentSpinner /> 
          </div>
        ) : (
          // <StudentPerformanceChart 
          // performanceData={performanceData}
          //  />
          <StudentPerformanceChart 
          studentId={studentId} 
            termId={data?.current_term} 
           />
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
