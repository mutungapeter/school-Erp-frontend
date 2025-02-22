"use client";

import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { useGetClassesQuery } from "@/redux/queries/classes/classesApi";
import { useGetStreamsQuery } from "@/redux/queries/streams/streamsApi";
import { useGetStudentsQuery } from "@/redux/queries/students/studentsApi";
import { useGetTeachersQuery } from "@/redux/queries/teachers/teachersApi";
import dynamic from "next/dynamic";
import { useState } from "react";
import { BsBarChart, BsShop } from "react-icons/bs";
import { LiaChalkboardTeacherSolid } from "react-icons/lia";
import { PiStudentLight } from "react-icons/pi";
import PageLoadingSpinner from "../../layouts/PageLoadingSpinner";
import DefaultLayout from "../Layouts/DefaultLayout";
import CardDataStats from "./CardData";
import ContentSpinner from "../../perfomance/contentSpinner";
import CountChart from "./CountChart";
import AttendanceChart from "./AttendanceChart";
import FinanceChart from "./FinanceChart";
import EventCalendar from "./EventsCalendar";
import Announcements from "./Announcements";
import UserCard from "./UserCard";
const ClassPerformance = dynamic(
  () => import("../../perfomance/classPerformance"),
  { ssr: false, loading: () => <ContentSpinner /> }
);

const DashboardData = () => {
  const { user, loading } = useAppSelector((state: RootState) => state.auth);
  const [isLoading, setIsLoading] = useState(false);

  const {
    isLoading: loadingStudents,
    data: studentsData,
    refetch,
    error,
  } = useGetStudentsQuery({}, { refetchOnMountOrArgChange: true });
  const {
    isLoading: loadingClasses,
    data: classesData,
    refetch: refetchClasses,
  } = useGetClassesQuery({}, { refetchOnMountOrArgChange: true });
  const {
    isLoading: loadingStreams,
    data: streamsData,
    refetch: refetchStreams,
  } = useGetStreamsQuery({}, { refetchOnMountOrArgChange: true });
  const {
    isLoading: loadingTeachers,
    data: teachersData,
    refetch: refetchTeachers,
  } = useGetTeachersQuery({}, { refetchOnMountOrArgChange: true });
  const totalStudents = studentsData?.length || 0;
  const totalClasses = classesData?.length || 0;
  const totalStreams = streamsData?.length || 0;
  const totalTeachers = teachersData?.length || 0;

  const cardData = [
    {
      title: "Students",
      total: totalStudents,
      icon: <PiStudentLight className="text-[#771BCC]" size={36} />,
      bgColor: "bg-[#F3EEF6]",
      path: "/students",
    },
    {
      title: "Classes",
      total: totalClasses,
      icon: <BsShop className="text-[#F9B72F]" size={36} />,
      bgColor: "bg-[#FFF8DE]",
      path: "/classes",
    },
    {
      title: "Streams",
      total: totalStreams,
      icon: <BsBarChart className="text-[#0077B6]" size={36} />,
      bgColor: "bg-[#CDEEFF]",
      path: "/streams",
    },
    {
      title: "Teachers",
      total: totalTeachers,
      icon: <LiaChalkboardTeacherSolid className="text-[#22C55E]" size={36} />,
      bgColor: "bg-[#E0FBE2]",
      path: "/teachers",
    },
  ];
  if (loadingTeachers || loadingStreams || loadingClasses || loadingStudents) {
    return (
      <div className="mx-auto w-full md:max-w-screen-2xl lg:max-w-screen-2xl p-3 md:p-4 2xl:p-5">
        <PageLoadingSpinner />
      </div>
    );
  }
  return (
    <>
      <div className=" flex gap-4 flex-col p-4 md:flex-row">
        <div className="w-full lg:w-2/3 flex flex-col gap-8">
          <div className="flex gap-4 justify-between flex-wrap">
            {cardData.map((card) => (
              <CardDataStats
                key={card.title}
                title={card.title}
                bgColor={card.bgColor}
                total={card.total}
                icon={card.icon}
              >
                {card.total}
              </CardDataStats>
            ))}

          </div>
          <div className="flex gap-4 flex-col lg:flex-row">
            <div className="w-full lg:w-1/3 h-[450px]">
              <CountChart students={studentsData}  />
            </div>
            <div className="w-full lg:w-2/3 h-[450px]">
              <AttendanceChart />
            </div>
          </div>
          <div className="w-full h-[500px]">
          <FinanceChart />
        </div>
        </div>
        <div className="w-full lg:w-1/3 flex flex-col gap-8">
        {/* <EventCalendar /> */}
        <Announcements/>
      </div>
      </div>
    </>
  );
};

export default DashboardData;
