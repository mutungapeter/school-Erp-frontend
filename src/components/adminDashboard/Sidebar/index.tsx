"use client";

import ClickOutside from "@/components/ClickOutside";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
// import AdminPermissions from "@/src/hooks/AdminProtected";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HiOutlineClipboardDocument
} from "react-icons/hi2";
import { IoHomeOutline } from "react-icons/io5";
import { LiaChalkboardTeacherSolid, LiaSchoolSolid } from "react-icons/lia";
import { MdOutlineDashboard } from "react-icons/md";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import {
  PiStudentDuotone,
  PiStudentLight,
  PiUsersThreeLight,
} from "react-icons/pi";
import { SlSettings } from "react-icons/sl";
import { TfiAlignLeft } from "react-icons/tfi";
import { TiDocumentText } from "react-icons/ti";
import PageLoadingSpinner from "../../layouts/PageLoadingSpinner";
import SidebarItem from "./SidebarItem";
import { PiChalkboardTeacherThin } from "react-icons/pi";
import { PiChalkboardThin } from "react-icons/pi";
interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
  desktopSidebarOpen: boolean;
  setDesktopSidebarOpen: (arg0: boolean) => void;
}

interface MenuItem {
  icon?: JSX.Element;
  label: string;
  route: string;
  children?: MenuItem[];
}
const AdminPermissions = dynamic(() => import('@/src/hooks/AdminProtected'), {
  ssr: false,
});
interface MenuGroup {
  name?: string;
  menuItems: MenuItem[];
}
const menuGroups: MenuGroup[] = [
  {
    name: "MENU",
    menuItems: [
      {
        icon: <IoHomeOutline size={20} />,
        label: "Dashboard",
        route: "/dashboard",
      },
    
      {
        icon: <PiStudentLight size={20} />,
        label: "Students",
        route: "/students",
      },
      {
        icon: <LiaChalkboardTeacherSolid size={20}  />,
        label: "Teachers",
        route: "/teachers",
      },
      {
        icon: <LiaSchoolSolid size={20}  />,
        label: "Subjects",
        route: "/subjects",
      },
      {
        icon: <MdOutlineDashboard size={20}  />,
        label: "Terms",
        route: "/terms",
      },
      {
        icon: <PiChalkboardTeacherThin size={20}  />,
        label: "Classes",
        route: "/classes",
      },
      
      {
        icon: <PiChalkboardThin size={20}  />,
        label: "Streams",
        route: "/streams",
      },
   
    

     
    ],
  },
  {
    // name: "OTHERS",
    menuItems: [
      {
        icon: <PiChalkboardTeacherThin size={20}  />,
        label: "Perfomance",
        route: "#",
      },
      {
        icon: <HiOutlineClipboardDocumentList size={20} />,
        label: "Results",
        route: "#",
        children: [
          { label: "Upload Marks", route: "/marks" },
          { label: "View Marks", route: "/marks/list" },
          { label: "Report Forms", route: "/reports/reportcard" },
        ],
      },  
      {
        icon: <SlSettings size={20} />,
        label: "Settings",
        route: "#",
        children: [
          { label: "Grading configs", route: "/grading" },
          { label: "Mean grade configs", route: "/grading/meangradeconfigs" },
        ],
      },
      {
        icon: <HiOutlineClipboardDocument size={20}  />,
        label: "Promotion Records",
        route: "/promotions",
      },
      {
        icon: <PiStudentDuotone size={20} />,
        label: "Alumni",
        route: "/alumni",
      },
      {
        icon: <PiUsersThreeLight size={20} />,
        label: "Admins",
        route: "/accounts",
      },
    ],
  },
];

const Sidebar = ({
  sidebarOpen,
  setSidebarOpen,
  desktopSidebarOpen,
  setDesktopSidebarOpen,
}: SidebarProps) => {

  const pathname = usePathname();
  const [pageName, setPageName] = useLocalStorage("selectedMenu", "dashboard");
  const { user, loading, error } = useAppSelector(
    (state: RootState) => state.auth
  );
  if (loading) {
    return <PageLoadingSpinner />;
  }
  return (
    <ClickOutside onClick={() => setSidebarOpen(false)}>
      <aside
        className={`fixed left-0 top-0 z-9999 transition-all duration-300 ease-linear flex h-screen ${
          desktopSidebarOpen ? "lg:w-62.5" : "w-0 lg:w-0"
        } flex-col overflow-y-hidden bg-white  dark:bg-boxdark lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0 w-62.5" : "-translate-x-full"
        }`}
      >
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

        <div className=" flex flex-col overflow-y-auto duration-300 ease-linear">
          <nav className="mt-5 px-4 py-4 lg:mt-9 lg:px-4">
            {menuGroups.map((group, groupIndex) => (
              <div key={groupIndex}>
                {/* <h3 className="mb-4 ml-4 text-sm font-semibold text-[#585882ff]">
                  {group.name}
                </h3> */}

                <ul className="mb-6 flex flex-col gap-4">
                  {group.menuItems.map((menuItem, menuIndex) => {
                   
                    return (
                      <SidebarItem
                        key={menuIndex}
                        item={menuItem}
                        pageName={pageName}
                        setPageName={setPageName}
                      />
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </aside>
    </ClickOutside>
  );
};

export default Sidebar;
