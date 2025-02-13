"use client";
import React, { ReactNode } from "react";

interface CardDataStatsProps {
  title: string;
  total: string;
  children: ReactNode;
  bgColor: string;
  icon: JSX.Element;
}

const CardDataStats = ({
  title,
  total,
  children,
  bgColor,
  icon
}: CardDataStatsProps) => {
  return (
    <div
      className={`rounded-2xl border-gray-300 cursor-pointer   p-3  flex-1 min-w-[130px] 
                     transition-all duration-300 ease-in-out hover:scale-105  bg-white border  `}
    >
      <div className="flex items-center justify-between">
        <span className="text-md md:text-lg lg:text-lg font-medium text-gray-500">{title}</span>
        <div className="flex h-11.5 w-11.5 p-2 items-center justify-center rounded-full dark:bg-meta-4">
       {icon}
        </div>
      </div>
      <div className="text-2xl font-semibold my-4">
          {children}
        </div>
    
     
    </div>
  );
};

export default CardDataStats;
