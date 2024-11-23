"use client";
import React, { ReactNode } from "react";

interface CardDataStatsProps {
  title: string;
  total: string;
  children: ReactNode;
  bgColor: string;
}

const CardDataStats = ({
  title,
  total,
  children,
  bgColor,
}: CardDataStatsProps) => {
  return (
    <div
      className={`rounded-md border border-stroke cursor-pointer  px-7.5 py-3 shadow-md duration-300 ease-in-out
                     transition-all duration-300 ease-in-out hover:scale-105  bg-white border border-1 `}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{title}</span>
        <div className="flex h-11.5 w-11.5 p-2 items-center justify-center rounded-full dark:bg-meta-4">
          {children}
        </div>
      </div>
      <div className="mt-3 ">
        <div>
          <h4 className="text-title-md font-bold text-black dark:text-white">
            {total}
          </h4>
        </div>
      </div>
      {/* <div className="flex justify-between items-center">
        <div className="text-sm bg-green-900  text-green-500 flex space-x-2  items-center ">
          <span className="">↑</span>
          <span> 12%</span>
        </div>
        <p className="text-xs bg-red-500 text-gray-500 ">Compared to last month</p>
      </div> */}
    </div>
  );
};

export default CardDataStats;
