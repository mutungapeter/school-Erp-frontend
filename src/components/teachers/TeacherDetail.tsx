"use client";
import { MdAccountCircle, MdOutlineCalendarMonth } from "react-icons/md";
import Image from "next/image";
import { groupBy } from "lodash";
import EditTeacher from "./eidtTeacherSubjects";
import Spinner from "../layouts/spinner";
import EditTeacherSubjects from "./eidtTeacherSubjects";
import { FaUserTie } from "react-icons/fa6";
import { FaPhoneAlt } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import Announcements from "../adminDashboard/dashboard/Announcements";
import Link from "next/link";
import { useGetTeacherQuery } from "@/redux/queries/teachers/teachersApi";
import TeacherPerformance from "./Perfomance";
import AssignTeacher from "./assignSubjectsAndClasses";
import { usePermissions } from "@/src/hooks/hasAdminPermission";
import PageLoadingSpinner from "../layouts/PageLoadingSpinner";
interface Props {
  teacher_id: number;
}
const TeacherDetails = ({ teacher_id }: Props) => {
  const { data, isLoading, isSuccess, error, refetch } =
    useGetTeacherQuery(teacher_id);
  const { hasAdminPermissions, loading: loadingPermissions } = usePermissions();
  const groupedSubjects = groupBy(
    data?.subjects,
    (s) => s.subject.subject_name
  );
  console.log("groupedsubjects", groupedSubjects);
  const uniqueSubjects = Array.from(
    new Set(data?.subjects?.map((s: any) => s.subject.subject_name))
  );

  const numOfSubjects = uniqueSubjects.length;

  const refetchDetails = () => {
    refetch();
  };
  const groupedClasses = data?.subjects?.map((s: any) => {
    const subjectName = s.subject.subject_name;
    const className = `${s.class_level.name} ${
      s.class_level.stream ? s.class_level.stream.name : ""
    }`;
    return { subjectName, className };
  });

  // Count unique classes (combination of subject and class level/stream)
  const uniqueClasses = Array.from(
    new Set(groupedClasses?.map((s: any) => `${s.subjectName}-${s.className}`))
  );

  // Calculate the number of unique classes
  const numOfClasses = uniqueClasses.length;
  if (loadingPermissions) {
    return <PageLoadingSpinner />;
  }
  return (
    <>
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
                    {data?.user?.first_name} {data?.user?.last_name}
                  </h1>
                </div>
                <p className="text-sm text-gray-500">Mathematics ethusiast</p>
                <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
                  <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                    {/* <Image src="/icons/date.png" alt="" width={14} height={14} /> */}
                    <MdOutlineCalendarMonth className="text-blue-600 w-4 h-4" />
                    <span>January 2025</span>
                  </div>
                  <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                    {/* <Image src="/icons/mail.png" alt="" width={14} height={14} /> */}
                    <HiOutlineMail className="text-blue-600 w-4 h-4" />
                    <span>{data?.user?.email}</span>
                  </div>
                  <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                    {/* <Image src="/icons/phone.png" alt="" width={14} height={14} /> */}
                    <FaPhoneAlt className="text-blue-600 w-4 h-4" />
                    <span> {data?.user?.phone_number}</span>
                  </div>
                  <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                    <FaUserTie className="text-blue-600 w-4 h-4" />
                    <span> {data?.staff_no}</span>
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
                  <h1 className="text-xl font-semibold">{numOfSubjects}</h1>
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
                  <h1 className="text-xl font-semibold">{numOfClasses}</h1>
                  <span className="text-sm text-gray-400">Classes</span>
                </div>
              </div>
            </div>
          </div>
          {/* BOTTOM */}
          {/* <div className="mt-4 bg-white rounded-md p-4 h-[800px]">
          <h1>Teacher&apos;s Schedule</h1>
          <BigCalendar />
        </div> */}
          <div className="mt-4 bg-white overflow-x-auto rounded-md shadow-sm p-4 h-auto min-h-[400px]">
            <div className="flex items-center justify-between p-2 bg-light mb-5">
              <h2 className="text-black font-semibold text-sm md:text-xl lg:text-xl ">
                Subjects
              </h2>
              {hasAdminPermissions() && (
<div>

              {data?.subjects && data.subjects.length > 0 ? (
                <div>
                  <EditTeacherSubjects
                    teacher_id={data?.id}
                    refetchDetails={refetchDetails}
                  />
                </div>
              ) : (
                <div>
                  <AssignTeacher
                    teacher_id={data?.id}
                    refetchDetails={refetchDetails}
                  />
                </div>
              )}
</div>
              )}
            </div>
            <table className="w-full    bg-white text-sm border text-left rounded-md rtl:text-right text-gray-500 ">
              <thead className="text-xs text-gray-700 uppercase border-b bg-gray-50 rounded-t-md">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Subject
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Classes
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(groupedSubjects).map((subject, index) => (
                  <tr key={index} className="bg-white border-b">
                    <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap">
                      {subject}
                    </td>
                    <td className="px-6 py-2 font-medium text-gray-500 whitespace-nowrap">
                      {groupedSubjects[subject]
                        .map(
                          (s) =>
                            `${s.class_level.name}${
                              s.class_level.stream
                                ? ` ${s.class_level.stream.name}`
                                : ""
                            } (${s.class_level.calendar_year})`
                        )
                        .join(", ")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT */}
        <div className="w-full xl:w-1/3 flex flex-col gap-4">
          <div className="bg-white p-4 rounded-md">
            <h1 className="text-xl font-semibold">Shortcuts</h1>
            <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500">
              <Link className="p-3 rounded-md bg-lamaSkyLight" href="#">
                Teacher&apos;s Perfomance
              </Link>
              <Link className="p-3 rounded-md bg-lamaPurpleLight" href="#">
                Teacher&apos;s Students
              </Link>
              <Link className="p-3 rounded-md bg-lamaYellowLight" href="#">
                Teacher&apos;s Lessons
              </Link>
              <Link className="p-3 rounded-md bg-pink-50" href="#">
                Teacher&apos;s Exams
              </Link>
              <Link className="p-3 rounded-md bg-lamaSkyLight" href="#">
                Teacher&apos;s Assignments
              </Link>
            </div>
          </div>

          {/* <TeacherPerformance /> */}
          <Announcements />
        </div>
      </div>
    </>
  );
};

export default TeacherDetails;
