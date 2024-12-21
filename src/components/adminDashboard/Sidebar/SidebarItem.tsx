import React from "react";
import Link from "next/link";
import SidebarDropdown from "./SidebarDropdown";
import { usePathname } from "next/navigation";
import { GoChevronRight } from "react-icons/go";
const SidebarItem = ({ item, pageName, setPageName }: any) => {
  const handleClick = () => {
    const updatedPageName =
      pageName !== item.label.toLowerCase() ? item.label.toLowerCase() : "";
    return setPageName(updatedPageName);
  };

  const pathname = usePathname();

  const isActive = (item: any) => {
    if (item.route === pathname) return true;
    if (item.children) {
      return item.children.some((child: any) => isActive(child));
    }
    return false;
  };

  const isItemActive = isActive(item);

  return (
    <>
      <li>
        <Link
          href={item.route}
          onClick={handleClick}
          className={`${isItemActive ? "  text-[#771BCC] bg-[#F3EEF6]" : ""} 
          group relative flex items-center gap-4
           rounded-lg p-2  
           text-[#585882ff] md:text-md text-md lg:text-md  hover:text-[#771BCC] hover:bg-[#F3EEF6]
           transform transition-transform 
                    hover:translate-x-3  `}
        >
          {item.icon}
          {item.label}
          {item.children && (
           
            <GoChevronRight 
            className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${
              pageName === item.label.toLowerCase() && "rotate-90"
            }`}
            />
          )}
        </Link>

        {item.children && (
          <div
            className={`translate transform overflow-hidden ${
              pageName !== item.label.toLowerCase() && "hidden"
            }`}
          >
            <SidebarDropdown item={item.children} />
          </div>
        )}
      </li>
    </>
  );
};

export default SidebarItem;
