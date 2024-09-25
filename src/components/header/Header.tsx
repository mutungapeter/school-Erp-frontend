"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
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
import { FaLaptopHouse } from "react-icons/fa";
import { FaShop } from "react-icons/fa6";
import { SiLevelsdotfyi } from "react-icons/si";
import { FaChevronDown } from "react-icons/fa6";
import { FaChevronUp } from "react-icons/fa";
import { FaRegUser } from "react-icons/fa6";
import { IoSettingsOutline } from "react-icons/io5";
import { TbLogout2 } from "react-icons/tb";
import Image from "next/image";
import { MdOutlineArrowDropDown } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

import { useRouter } from "next/navigation";
import { userLoggedOut } from "@/redux/queries/auth/authSlice";
import { RootState } from "@/redux/store";
import { MdOutlineLibraryBooks } from "react-icons/md";
export const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user, loading, error } = useAppSelector(
    (state: RootState) => state.auth
  );
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);
  const cardData = [
    { text: "Dashboard", icon: <MdDashboard />, path: "/dashboard" },
    { text: "Students", icon: <FaBookReader />, path: "/students" },
    { text: "Teachers", icon: <FaUserTie />, path: "/teachers" },
    { text: "Classes", icon: <FaShop />, path: "/classes" },
    { text: "Form Levels", icon: <SiLevelsdotfyi  />, path: "/form-levels" },
    { text: "Streams", icon: <BsHousesFill  />, path: "/streams" },
    { text: "Subjects", icon: <FaBookOpen />, path: "/subjects" },
    { text: "marks", icon: <MdOutlineLibraryBooks />, path: "/marks" },
    { text: "Grading", icon: <FaUserGraduate />, path: "/grading" },
    { text: "Reports", icon: <HiClipboardDocumentList />, path: "/reports" },
    { text: "Accounts", icon: <FaUser />, path: "/accounts" },
  ];
  const handleLogout = () => {
    dispatch(userLoggedOut());
    router.push('/'); 
  };
if(loading){
  return <div>Loading</div>;
}
  return (
    <>
      {/* First nav */}
      <div className="w-full fixed top-0 left-0 z-50 transition flex items-center justify-between bg-primary  h-[60px] px-5">
        <div className="w-full flex items-center justify-between">
        <button
            className="block sm:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FiX size={25} /> : <FiMenu size={25} />}  
          
          </button>
          <h2 className=" text-white">SCHOOL MANAGER</h2>

      
         
        <div className="relative flex cursor-pointer">
          <div
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center  cursor-pointer space-x-5 lg:p-2 md:p-2 p-1 rounded-md bg-light"
        
      >
        <div className="flex items-center space-x-3">

        <span className="lg:h-5 lg:w-5 w-6 h-6 rounded-full">
          <Image
            width={70}
            height={70}
            src="/user.png"
            style={{
              width: "auto",
              height: "auto",
            }}
            alt="User"
            className="overflow-hidden rounded-full"
          />
        </span>
{loading && <span>Loading...</span>}
                {error && <span>Error loading user data</span>}
                {isMounted && !loading && !error && user && (
                  <span className="hidden lg:block text-primary">{user.first_name} {user.last_name}</span>
                )}
          
        </div>
        <span className="flex items-center gap-2 font-medium text-dark dark:text-dark-6 ">
          
          <MdOutlineArrowDropDown   size={30}     className={` duration-200 text-blue-500 ease-in ${dropdownOpen && "rotate-180"}`} />
        </span>
      </div>


      {dropdownOpen && (
        <div
          className='absolute right-0 mt-[60px] z-50 flex w-[280px] flex-col rounded-lg border-[0.5px] border-stroke bg-white shadow-default dark:border-dark-3 dark:bg-gray-dark'
        >
          <div className="flex items-center gap-2.5 px-5 pb-5.5 pt-3.5">
            <span className="relative block h-12 w-12 rounded-full">
              <Image
                width={112}
                height={112}
                src="/user.png"
                style={{
                  width: "auto",
                  height: "auto",
                }}
                alt="User"
                className="overflow-hidden rounded-full"
              />
 </span>
  {loading && <div>Loading...</div>}
                {error && <div>Error loading user data</div>}
                {isMounted && !loading && !error && user && (
            <div className="block">
              <span className="block font-medium text-dark dark:text-white">
               {user?.first_name} {user?.last_name}
              </span>
              <span className="block font-medium text-dark-5 dark:text-dark-6">
                {user?.email}
              </span>
            </div>
            )}
          </div>
          <ul className="flex flex-col gap-1 border-y-[0.5px] border-stroke p-2.5 dark:border-dark-3">
            <li>
              <Link
                href="/profile"
                className="flex w-full items-center gap-2.5 rounded-[7px] p-2.5 text-sm font-medium text-dark-4 duration-300 ease-in-out hover:bg-gray-2 hover:text-dark dark:text-dark-6 dark:hover:bg-dark-3 dark:hover:text-white lg:text-base"
              >
                <FaRegUser />
             
                View profile
              </Link>
            </li>

            <li>
              <Link
                href="/pages/settings"
                className="flex w-full items-center gap-2.5 rounded-[7px] p-2.5 text-sm font-medium text-dark-4 duration-300 ease-in-out hover:bg-gray-2 hover:text-dark dark:text-dark-6 dark:hover:bg-dark-3 dark:hover:text-white lg:text-base"
              >
                  <IoSettingsOutline />
                Account Settings
              </Link>
            </li>
          </ul>
          <div className="p-2.5" onClick={handleLogout}>
            <button className="flex w-full items-center gap-2.5 rounded-[7px] p-2.5 text-sm font-medium text-dark-4 duration-300 ease-in-out hover:bg-gray-2 hover:text-dark dark:text-dark-6 dark:hover:bg-dark-3 dark:hover:text-white lg:text-base">
              <TbLogout2 />
              Logout
            </button>
          </div>
        </div>
      )}
      </div>
        </div>
      </div>
      {/* Second nav with mobile toggle and transition effect */}
      <div className="w-full fixed top-[60px] left-0 z-30 transition hidden sm:flex sm:px-5 lg:flex items-center space-x-5  h-[60px]">
        {/* <div className="flex items-center space-x-5"> */}
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
        {/* </div> */}
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



















