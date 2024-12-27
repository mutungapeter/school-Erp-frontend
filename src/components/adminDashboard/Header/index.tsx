import Link from "next/link";
import DarkModeSwitcher from "./DarkModeSwitcher";
import DropdownMessage from "./DropdownMessage";
import DropdownNotification from "./DropdownNotification";
import DropdownUser from "./DropdownUser";
import Image from "next/image";
import { BiMenuAltLeft, BiMenuAltRight } from "react-icons/bi";
import { RiMenuFill } from "react-icons/ri";
import { useMediaQuery } from "react-responsive";
import dynamic from "next/dynamic";
import { TfiAlignJustify, TfiAlignLeft, TfiAlignRight } from "react-icons/tfi";
import { CiMenuBurger } from "react-icons/ci";
interface Props {
  sidebarOpen: string | boolean | undefined;
  setSidebarOpen: (arg0: boolean) => void;
  desktopSidebarOpen: boolean;
  setDesktopSidebarOpen: (arg0: boolean) => void;
}

const Header: React.FC<Props> = ({
  sidebarOpen,
  setSidebarOpen,
  desktopSidebarOpen,
  setDesktopSidebarOpen,
}) => {
  const isMobile = useMediaQuery({ maxWidth: 1024 });
  
  const toggleSidebar = () => {
    if (isMobile) {
      setSidebarOpen(!sidebarOpen);
    } else {
      setDesktopSidebarOpen(!desktopSidebarOpen);
    }
  };

  return (
    <header className={`sticky top-0 z-999 flex w-full transition-all duration-300 ease-linear bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none ${
      desktopSidebarOpen ? "lg:ml-0" : "lg:ml-0"  
    } `}>
      <div className="flex flex-grow items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11">
        <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
       
          <button
            aria-controls="sidebar"
           
            onClick={toggleSidebar}
            className="z-99999 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm dark:border-strokedark dark:bg-boxdark lg:hidden"
          >
            <span className="relative block h-5.5 w-5.5 cursor-pointer">
              <span className="du-block absolute right-0 h-full w-full">
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-[0] duration-200 ease-in-out dark:bg-white ${
                    !sidebarOpen && "!w-full delay-300"
                  }`}
                ></span>
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-150 duration-200 ease-in-out dark:bg-white ${
                    !sidebarOpen && "delay-400 !w-full"
                  }`}
                ></span>
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-200 duration-200 ease-in-out dark:bg-white ${
                    !sidebarOpen && "!w-full delay-300"
                  }`}
                ></span>
              </span>
              <span className="absolute right-0 h-full w-full rotate-45">
                <span
                  className={`absolute left-2.5 top-0 block h-full w-0.5 rounded-sm bg-black delay-300 duration-200 ease-in-out dark:bg-white ${
                    !sidebarOpen && "!h-0 !delay-[0]"
                  }`}
                ></span>
                <span
                  className={`delay-400 absolute left-0 top-2.5 block h-0.5 w-full rounded-sm bg-black duration-200 ease-in-out dark:bg-white ${
                    !sidebarOpen && "!h-0 !delay-500"
                  }`}
                ></span>
              </span>
            </span>
          </button>
         

          <Link className="block flex-shrink-0 lg:hidden" href="/">
            <Image
              width={32}
              height={32}
              src={"/images/logo.jpg"}
              alt="Logo"
            />
          </Link>
        </div>
        
        <div className="hidden cursor-pointer lg:block">
          <button
           
            onClick={toggleSidebar}
            className="text-gray-600 dark:text-gray-300"
          >
            {desktopSidebarOpen ? (
              <TfiAlignLeft size={30} />
            ) : (
              <TfiAlignRight   size={30} />
            )}
          </button>
        </div>
        
        <div className="flex items-center gap-3 2xsm:gap-7">
          <ul className="flex items-center gap-2 2xsm:gap-4">
            {/* Dark Mode Toggler */}
            {/* <DarkModeSwitcher /> */}
            {/* Notification Menu Area */}
            {/* <DropdownNotification /> */}
            {/* Chat Notification Area */}
            {/* <DropdownMessage /> */}
          </ul>

          {/* User Area */}
          <DropdownUser />
        </div>
      </div>
    </header>
  );
};

export default Header;
