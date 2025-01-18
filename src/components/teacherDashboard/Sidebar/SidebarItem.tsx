import React from "react";
import Link from "next/link";
import SidebarDropdown from "./SidebarDropdown";
import { usePathname } from "next/navigation";
import Image from "next/image";
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
  const iconSize = 20;
  const isItemActive = isActive(item);

  return (
    <>
      <li>
        <Link
          href={item.route}
          onClick={handleClick}
          className={`${isItemActive ? " dark:bg-meta-4 text-[#771BCC] bg-[#F3EEF6]" : ""} group relative flex items-center gap-4 rounded-sm px-4 py-2  text-[#585882ff] md:text-xl text-md lg:text-xl  hover:text-[#771BCC] transform transition-transform 
                    hover:translate-x-3  dark:hover:bg-meta-4`}
        >
          {/* {item.icon} */}
        {React.isValidElement(item.icon) ? (
                  React.cloneElement(item.icon, {
                    size: iconSize,
                    className: `${isItemActive ? 'text-white text-gray-500 group-hover:text-gray-500' : 'text-gray-500 hover:text-gray-500'}`,
                  })
                ) : (
                  <Image
                    src={item.icon}
                    alt=""
                    width={iconSize}
                    height={iconSize}
                    className={`transition duration-300 
                      ${isItemActive 
                        ? 'filter invert brightness-0 group-hover:filter group-hover:brightness-100 group-hover:saturate-100 group-hover:contrast-100'  // Active state with filters
                        : 'opacity-70 group-hover:filter group-hover:brightness-100 group-hover:saturate-100 group-hover:contrast-100'  // Inactive state with hover filter
                      } 
                    `}
                  />
                )}
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
