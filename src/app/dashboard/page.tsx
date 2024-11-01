// "use client";
// import { useAppSelector } from "@/redux/hooks";
// import { RootState } from "@/redux/store";
// import DefaultLayout from "@/src/components/adminDashboard/Layouts/DefaultLayout";
// // import { DefaultLayout } from "@/src/components/layouts/DefaultLayout";
// import PageLoadingSpinner from "@/src/components/layouts/PageLoadingSpinner";
// import dynamic from 'next/dynamic';
// import Link from "next/link";
// import { BsHousesFill } from "react-icons/bs";
// import {
//   FaBookReader,
//   FaUser
// } from "react-icons/fa";
// import { FaBookOpen, FaShop } from "react-icons/fa6";
// import { HiClipboardDocumentList } from "react-icons/hi2";
// import { SiLevelsdotfyi } from "react-icons/si";

import DashboardData from "@/src/components/adminDashboard/dashboard/DashboardContent"

// const ProtectedRoute = dynamic(() => import("../authorization/authentication"), {
//   ssr: false,
//   loading: () => <PageLoadingSpinner />
// });
// const DashboardPage = () => {
//   const { user, loading, error } = useAppSelector(
//     (state: RootState) => state.auth
//   );

//   const cardData = [
//     { text: "Students", icon: <FaBookReader size={40} />, path: "/students" },
//     { text: "Subjects", icon: <FaBookOpen size={40} />, path: "/subjects" },
//     { text: "Classes", icon: <FaShop size={40} />, path: "/classes" },
//     {
//       text: "Form Levels",
//       icon: <SiLevelsdotfyi size={40} />,
//       path: "/form-levels",
//     },
//     { text: "Streams", icon: <BsHousesFill size={40} />, path: "/streams" },
//     {
//       text: "Reports",
//       icon: <HiClipboardDocumentList size={40} />,
//       path: "/reports",
//     },
//     { text: "Accounts", icon: <FaUser size={40} />, path: "/accounts" },
//   ];
//   return (
//       <ProtectedRoute requiredRoles={["Admin", "Teacher"]}>
//     <DefaultLayout>
     
//         {/* <div className="mt-[50px] sm:mt-[110px] lg:mt-[110px] grid grid-cols-1 lg:grid-cols-5 sm:grid-cols-4 sm:gap-5 gap-3 lg:gap-5"> */}
//         <div className="grid grid-cols-1 lg:grid-cols-5 sm:grid-cols-4 sm:gap-5 gap-3 lg:gap-5">
//           {cardData.map((card, index) => {
//             if (card.text === "Accounts" && user?.role !== "Admin") {
//               return null;
//             }
//             return (
//               <Link href={card.path} key={index}>
//                 <div className="max-w-sm rounded overflow-hidden flex flex-col gap-5 text-[#1F4772] hover:text-[#36A000] font-semibold cursor-pointer items-center  bg-white  p-6 border">
//                   {card.icon}

//                   <h2 className="">{card.text}</h2>
//                 </div>
//               </Link>
//             );
//           })}
//         </div>
//     </DefaultLayout>
//       </ProtectedRoute>
     
//   );
// };
// export default DashboardPage;
const DashboardPage=()=>{
  return(
    <DashboardData />
  )
}
export default DashboardPage;