"use client";
import Link from "next/link";
import { useState } from "react";
import {
  FaBookReader,
  FaUser,
  FaUserGraduate,
  FaUserTie,
} from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { FaBookOpen } from "react-icons/fa6";
import { BsHousesFill } from "react-icons/bs";
import { HiClipboardDocumentList } from "react-icons/hi2";
import { FiMenu, FiX } from "react-icons/fi"; 

export const Header = () => {

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const cardData = [
    { text: "Dashboard", icon: <MdDashboard />, path: "/dashboard" },
    { text: "Students", icon: <FaBookReader />, path: "/students" },
    { text: "Teachers", icon: <FaUserTie />, path: "/teachers" },
    { text: "Classes", icon: <BsHousesFill />, path: "/classes" },
    { text: "Subjects", icon: <FaBookOpen />, path: "/subjects" },
    { text: "Grading", icon: <FaUserGraduate />, path: "/grading" },
    { text: "Reports", icon: <HiClipboardDocumentList />, path: "/reports" },
    { text: "Accounts", icon: <FaUser />, path: "/accounts" },
  ];

  return (
    <>
      {/* First nav */}
      <div className="w-full fixed top-0 left-0 z-30 transition flex items-center justify-between bg-[#1F4772] h-[50px] px-5">
        <div className="w-full flex items-center justify-between">
        <button
            className="block sm:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FiX size={25} /> : <FiMenu size={25} />}  
          
          </button>
          <h2 className="text-white">SCHOOL MANAGER</h2>
          <h2 className="text-white">Admin</h2>

      
         
        </div>
      </div>

      {/* Second nav with mobile toggle and transition effect */}
      <div className="w-full fixed top-[50px] left-0 z-30 transition hidden sm:flex sm:px-5 lg:flex items-center justify-between bg-white h-[60px]">
        <div className="flex items-center space-x-5">
          {cardData.map((card, idx) => (
            <div key={idx}>
              <Link
                href={card.path}
                className="text-[#1F4772] hover:text-[#36A000]  cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <h2>{card.icon}</h2>
                  <h2>{card.text}</h2>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div
        className={`w-full fixed top-[50px] left-0 z-30 bg-slate-200 transition-all duration-500 ease-in-out sm:px-5 lg:flex items-center justify-between h-auto sm:h-[60px] overflow-hidden ${
          isMenuOpen ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"
        } sm:max-h-full sm:opacity-100 sm:block`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-5 p-4 sm:p-0">
          {cardData.map((card, idx) => (
            <div key={idx}>
              <Link
                href={card.path}
                className="text-[#1F4772] hover:text-[#36A000] cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <h2>{card.icon}</h2>
                  <h2>{card.text}</h2>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};




















// "use client";
// import Link from "next/link";
// import {
//   FaBookReader,
//   FaUniversity,
//   FaUser,
//   FaUserGraduate,
//   FaUserTie,
// } from "react-icons/fa";
// import { MdDashboard } from "react-icons/md";
// import { FaBookOpen } from "react-icons/fa6";
// import { BsHousesFill } from "react-icons/bs";
// import { HiClipboardDocumentList } from "react-icons/hi2";
// export const Header = () => {
//   const cardData = [
//     { text: "Dashboard", icon: <MdDashboard />, path: "/dashboard" },
//     { text: "Students", icon: <FaBookReader />, path: "/students" },
//     { text: "Teachers", icon: <FaUserTie />, path: "/teachers" },
//     { text: "Classes", icon: <BsHousesFill />, path: "/classes" },
//     { text: "Subjects", icon: <FaBookOpen />, path: "/subjects" },
//     { text: "Grading", icon: <FaUserGraduate />, path: "/grading" },
//     { text: "Reports", icon: <HiClipboardDocumentList />, path: "/reports" },
//     { text: "Accounts", icon: <FaUser />, path: "/accounts" },
//   ];

//   return (
//     <>
//     {/* first nav  */}
    
//       <div className="w-full fixed top-0 left-0 z-30 transition flex  items-center justify-between bg-[#1F4772] h-[50px] px-5">
//         <div className="w-full flex items-center justify-between ">
//           <h2 className="text-white">SCHOOL MANAGER</h2>
//           <h2 className="text-white">Admin</h2>
//         </div>
//       </div>

// {/* second nav */}
      // <div className="w-full fixed top-[50px] left-0 z-30 transition hidden sm:flex sm:px-5 lg:flex items-center justify-between bg-white h-[60px]">
      //   <div className="flex items-center space-x-5">
      //     {cardData.map((card, idx) => (
      //       <div key={idx}>
      //         <Link
      //           href={card.path}
      //           className="text-[#1F4772] hover:text-[#36A000]  cursor-pointer"
      //         >
      //           <div className="flex items-center gap-2">
      //             <h2>{card.icon}</h2>
      //             <h2>{card.text}</h2>
      //           </div>
      //         </Link>
      //       </div>
      //     ))}
      //   </div>
      // </div>
//     </>
//   );
// };
