"use client";

import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
// import ProtectedRoute from "@/src/app/authorization/authentication";
import DefaultLayout from "../Layouts/DefaultLayout";
import CardDataStats from "./CardData";
import { PiStudentLight } from "react-icons/pi";
import { BsShop, BsBarChart } from "react-icons/bs";
import { LiaChalkboardTeacherSolid } from "react-icons/lia";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import PageLoadingSpinner from "../../layouts/PageLoadingSpinner";

const DashboardData = () => {
  const { user, loading } = useAppSelector((state: RootState) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const ProtectedRoute = dynamic(() => import("@/src/app/authorization/authentication"), {
    ssr: false,
    loading: () => <PageLoadingSpinner />,
    
  });
  const cardData = [
    { title: "Total Students", total: "150", icon: <PiStudentLight className="text-[#771BCC]" size={36} />, bgColor: "bg-[#E1D9E7]",  path: "/students" },
    { title: "Total Classes", total: "150", icon: <BsShop className="text-[#F9B72F]" size={36} />, bgColor: "bg-[#F3EEF6]", path: "/classes" },
    { title: "Total Streams", total: "150", icon: <BsBarChart className="text-primary" size={36} />, bgColor: "bg-[#E1D9E7]", path: "/streams" },
    { title: "Total Teachers", total: "150", icon: <LiaChalkboardTeacherSolid className="text-[#22C55E]" size={36} />,bgColor: "bg-[#61F31D]", path: "/teachers" },
  ];

  return (
    <DefaultLayout>
      <ProtectedRoute requiredRoles={["Admin", "Teacher"]}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:gap-6 lg:gap-6 lg:grid-cols-4  xl:grid-cols-4 2xl:gap-7.5">
          {cardData.map((card) => (
            <CardDataStats key={card.title} title={card.title} bgColor={card.bgColor} total={card.total}>
              {card.icon}
            </CardDataStats>
          ))}
        </div>
      </ProtectedRoute>
    </DefaultLayout>
  );
};

export default DashboardData;
