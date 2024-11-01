"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import SidebarItem from "./SidebarItem";
import ClickOutside from "@/components/ClickOutside";
import useLocalStorage from "@/hooks/useLocalStorage";
import { BsCalendar4Week } from "react-icons/bs";
import { IoHomeOutline } from "react-icons/io5";
import { RiMenuFill } from "react-icons/ri";
import { BiMenuAltLeft } from "react-icons/bi";
import { FaBookReader, FaUserTie } from "react-icons/fa";
import { LiaChalkboardTeacherSolid } from "react-icons/lia";
import { GrGroup } from "react-icons/gr";
import { TiDocumentText } from "react-icons/ti";
import { LiaSchoolSolid } from "react-icons/lia";
import { BsShop } from "react-icons/bs";
import { SlSettings } from "react-icons/sl";
import { BsBarChart } from "react-icons/bs";
import { BiLayer } from "react-icons/bi";
import { PiUsersThreeLight } from "react-icons/pi";
import { PiStudentLight } from "react-icons/pi";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { TfiAlignLeft } from "react-icons/tfi";
interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
  desktopSidebarOpen: boolean;  
  setDesktopSidebarOpen: (arg0: boolean) => void;
}


const menuGroups = [
  {
    name: "MENU",
    menuItems: [
      {
        icon:<IoHomeOutline size={20} />,
        label: "Dashboard",
        route: "/dashboard",
       
      },
      {
        icon:<PiStudentLight size={20} />,
        label: "Students",
        route: "/students",
      },
      {
        icon:<LiaChalkboardTeacherSolid /> ,
        label: "Teachers",
        route: "/teachers",
      },
      {
        icon:<BsShop />,
        label: "Classes",
        route: "/classes",
      },
      {
        icon:<BsBarChart />,
        label: "Form Levels",
        route: "/form-levels",
      },
      {
        icon:<BiLayer />,
        label: "Streams",
        route: "/streams",
      },
      {
        icon:<LiaSchoolSolid />,
        label: "Subjects",
        route: "/subjects",
      },
    ],
  },
  {
    // name: "OTHERS",
    menuItems: [
      {
        icon: <TiDocumentText />,
        label: "Marks",
        route: "#",
        children: [
          { label: "Record Marks", route: "/marks" },
          { label: "View Marks", route: "/marks/list" },
        ],
      },
      {
        icon:<HiOutlineClipboardDocumentList />,
        label: "Reports",
        route: "#",
        children: [
          { label: "Report Forms", route: "/reports/reportcard" },
          
        ],
      },
      {
        icon: <SlSettings />,
        label: "Settings",
        route: "#",
        children: [
          { label: "Grading configs", route: "/grading" },
          { label: "Mean grade configs", route: "/grading/meangradeconfigs" },
        ],
      },
      {
        icon:<PiUsersThreeLight />,
        label: "Accounts",
        route: "/accounts",
      },
      
    ],
  },
];

const Sidebar = ({ sidebarOpen, setSidebarOpen,desktopSidebarOpen,setDesktopSidebarOpen
}: SidebarProps) => {
  const pathname = usePathname();
  const [pageName, setPageName] = useLocalStorage("selectedMenu", "dashboard");
  

 
  return (

    <ClickOutside onClick={() => setSidebarOpen(false)}>
   <aside
  className={`fixed left-0 top-0 z-9999 transition-all duration-300 ease-linear flex h-screen ${
    desktopSidebarOpen ? "lg:w-72.5" : "w-0 lg:w-0" 
  } flex-col overflow-y-hidden bg-white  dark:bg-boxdark lg:translate-x-0 ${
    sidebarOpen ? "translate-x-0 w-72.5" : "-translate-x-full"
  }`}
>

        {/* <!-- SIDEBAR HEADER --> */}
        <div className="flex items-center justify-between gap-2 px-6 py-3 lg:py-4">
          <Link href="/" className="w-[176px] h-[60px]">
            <Image
              width={176}
              height={60}
              src={"/images/logo.jpg"}
              alt="Logo"
              priority
              className="w-[176px] h-[60px] object-contain"
            />
          </Link>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            className="block lg:hidden"
          >
           <TfiAlignLeft size={30} />
          </button>
        </div>
        {/* <!-- SIDEBAR HEADER --> */}

        <div className=" flex flex-col overflow-y-auto duration-300 ease-linear">
          {/* <!-- Sidebar Menu --> */}
          <nav className="mt-5 px-4 py-4 lg:mt-9 lg:px-6">
            {menuGroups.map((group, groupIndex) => (
              <div key={groupIndex}>
                {/* <h3 className="mb-4 ml-4 text-sm font-semibold text-[#585882ff]">
                  {group.name}
                </h3> */}

                <ul className="mb-6 flex flex-col gap-4">
                  {group.menuItems.map((menuItem, menuIndex) => (
                    <SidebarItem
                      key={menuIndex}
                      item={menuItem}
                      pageName={pageName}
                      setPageName={setPageName}
                    />
                  ))}
                </ul>
              </div>
            ))}
          </nav>
          {/* <!-- Sidebar Menu --> */}
        </div>
      </aside>
    </ClickOutside>
  );
};

export default Sidebar;
