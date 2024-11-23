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
const ClassPerformance = dynamic(
  () => import("../../perfomance/classPerformance"),
  { ssr: false ,
    loading: () => <ContentSpinner />
   ,
  }
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
      title: "Total Students",
      total: totalStudents,
      icon: <PiStudentLight className="text-[#771BCC]" size={36} />,
      bgColor: "bg-[#F3EEF6]",
      path: "/students",
    },
    {
      title: "Total Classes",
      total: totalClasses,
      icon: <BsShop className="text-[#F9B72F]" size={36} />,
      bgColor: "bg-[#FFF8DE]",
      path: "/classes",
    },
    {
      title: "Total Streams",
      total: totalStreams,
      icon: <BsBarChart className="text-[#0077B6]" size={36} />,
      bgColor: "bg-[#CDEEFF]",
      path: "/streams",
    },
    {
      title: "Total Teachers",
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
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:gap-4 lg:gap-4 lg:grid-cols-4  xl:grid-cols-4 2xl:gap-7.5">
        {cardData.map((card) => (
          <CardDataStats
            key={card.title}
            title={card.title}
            bgColor={card.bgColor}
            total={card.total}
          >
            {card.icon}
          </CardDataStats>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2 lg:gap-5 md:gap-5">
      <div className=" space-y-4 px-2 md:py-4 lg:px-4 py-3 bg-white shadow-md">
            <div className="  md:px-3 py-2 px-2 lg:px-3">
            <h2 className="   font-semibold text-lg lg:text-xl md:text-xl">Class Performance Analysis</h2>
            </div>
            <ClassPerformance />
               
        </div>
        {/* <div className=" flex justify-center items-center text-center p-3 bg-white">
          <ClassPerformance />
        </div> */}
        
      </div>
    </div>
  );
};

export default DashboardData;
