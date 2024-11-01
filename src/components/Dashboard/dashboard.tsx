"use client";
// import { DefaultLayout } from "@/src/components/layouts/DefaultLayout";
import Link from "next/link";
import {
  FaBookReader,
  FaUniversity,
  FaUser,
  FaUserGraduate,
  FaUserTie,
} from "react-icons/fa";
import { BsHousesFill } from "react-icons/bs";
import { HiClipboardDocumentList } from "react-icons/hi2";
import { FaBookOpen } from "react-icons/fa6";
import { FaShop } from "react-icons/fa6";
import { SiLevelsdotfyi } from "react-icons/si";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
// import ProtectedRoute from "../authorization/authentication";
import { MdOutlineLibraryBooks } from "react-icons/md";
import ProtectedRoute from "@/src/app/authorization/authentication";
import { useState } from "react";
import { useRouter } from "next/navigation";
import DefaultLayout from "../adminDashboard/Layouts/DefaultLayout";
const Dashboard = () => {
  const { user, loading, error } = useAppSelector(
    (state: RootState) => state.auth
  );
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const cardData = [
    { text: "Students", icon: <FaBookReader size={40} />, path: "/students" },
    { text: "Subjects", icon: <FaBookOpen size={40} />, path: "/subjects" },
    { text: "Classes", icon: <FaShop size={40} />, path: "/classes" },
    {
      text: "Form Levels",
      icon: <SiLevelsdotfyi size={40} />,
      path: "/form-levels",
    },
    { text: "Streams", icon: <BsHousesFill size={40} />, path: "/streams" },
    {
      text: "Marks",
      icon: <MdOutlineLibraryBooks size={40} />,
      path: "/marks",
    },
    {
      text: "Teachers",
      icon: <FaUserTie size={40} />,
      path: "/teachers",
    },
    {
      text: "Reports",
      icon: <HiClipboardDocumentList size={40} />,
      path: "/Reports",
    },
    { text: "Accounts", icon: <FaUser size={40} />, path: "/accounts" },
  ];

  const handleNavigation = async (path:string) => {
    setIsLoading(true);
    try {
      await router.push(path);
    } catch (error) {
      console.error("Navigation error:", error);
    } finally {
      setIsLoading(false); 
    }
  };
  
  return (
    <DefaultLayout>
      <ProtectedRoute requiredRoles={["Admin", "Teacher"]}>
        <div className=" grid grid-cols-1 lg:grid-cols-5 xl:grid-cols-6 sm:grid-cols-4 sm:gap-5 gap-3 lg:gap-5">
          {cardData.map((card, idx) => {
            if (card.text === "Accounts" && user?.role !== "Admin") {
              return null;
            }
            return (
            <Link href={card.path} key={idx} shallow >
                <div
                className="max-w-sm rounded overflow-hidden flex flex-col gap-5 text-[#1F4772] hover:text-[#36A000] font-semibold cursor-pointer items-center bg-white p-6 border">
                  {card.icon}
                  <h2>{card.text}</h2>
                </div>
            </Link>
            );
          })}
        </div>
      </ProtectedRoute>
  </DefaultLayout>
  );
};
export default Dashboard;
