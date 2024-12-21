import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SidebarDropdown = ({ item }: any) => {
  const pathname = usePathname();

  return (
    <>
      <ul className="mb-5.5 mt-4 flex flex-col gap-3 pl-6">
        {item.map((item: any, index: number) => (
          <li key={index}>
            <Link
              href={item.route}
              className={`group relative flex items-center gap-2.5 
                 text-md rounded-md px-2   text-[#585882ff] 
                 hover:text-[#771BCC] hover:bg-[#F3EEF6]
                 duration-300 ease-in-out
                 transform transition-transform 
                    hover:translate-x-3 ${
                pathname === item.route ? "text-[#771BCC] bg-[#F3EEF6]" : ""
              }`}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
};

export default SidebarDropdown;
