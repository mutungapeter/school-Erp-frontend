import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ClickOutside from "@/components/ClickOutside";
import dynamic from "next/dynamic";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { userLoggedOut } from "@/redux/queries/auth/authSlice";
import { SlUser } from "react-icons/sl";
import { BsChevronDown } from "react-icons/bs";
import { PiGearLight } from "react-icons/pi";
import { IoIosLogIn } from "react-icons/io";
const DropdownUser = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const DynamicUserDisplay = dynamic(() => import("../../users/userData"), {
    ssr: false,
  });
  const router = useRouter();
  const { user, loading, error } = useAppSelector(
    (state: RootState) => state.auth
  );
  const dispatch = useAppDispatch();
  const handleLogout = () => {
    dispatch(userLoggedOut());
    router.push("/");
  };
  const handleNavigate = (path: string): void => {
    router.push(path);
  };

  if (loading) {
    return <div>Loading</div>;
  }
  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <Link
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-4"
        href="#"
      >
        <span className="hidden text-right lg:block">
          {/* <span className="block text-sm font-medium text-black dark:text-white"> */}
            <DynamicUserDisplay />
          {/* </span> */}
          {/* <span className="block text-xs">UX Designer</span> */}
        </span>

        <span className="relative h-8 w-8 lg:h-9 lg:w-9 md:h-9 md:w-9">
          <span className="absolute inset-0 rounded-full border-3 border-gray-300" />
          <Image
            width={112}
            height={112}
            src={"/profile.png"}
            alt="User"
            className="rounded-full h-8 w-8 lg:h-9 lg:w-9 md:h-9 md:w-9 z-10"
            style={{
              width: "auto",
              height: "auto",
            }}
          />
          <span className="absolute bottom-0 right-0 h-4 w-4 bg-green-500 border-2 border-white rounded-full" />
        </span>

     
        <BsChevronDown size={12} className="hidden text-current sm:block" />
      </Link>

      {/* <!-- Dropdown Start --> */}
      {dropdownOpen && (
        <div
          className={`absolute right-0 mt-4 flex w-62.5 z-9999 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark`}
        >
          <ul className="flex flex-col gap-5 border-b border-stroke px-6 py-7.5 dark:border-strokedark">
            <li>
              <Link
                href="/profile"
                className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
              >
               <SlUser size={22} className="text-current" />
                My Profile
              </Link>
            </li>
           
            <li>
              <Link
                href="/change-password"
                className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
              >
             
                <PiGearLight size={22} className="text-current"  />
                Account Settings
              </Link>
            </li>
          </ul>
          <button 
          onClick={handleLogout}
          className="flex items-center gap-3.5 px-6 py-4 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base">
        
            <IoIosLogIn size={22} className="text-current"  />
            Log Out
          </button>
        </div>
      )}
      {/* <!-- Dropdown End --> */}
    </ClickOutside>
  );
};

export default DropdownUser;
