'use client';
import React, { ReactNode } from "react";

interface CardDataStatsProps {
  title: string;
  total: string;
  children: ReactNode;
  bgColor: string;
}

const CardDataStats=({title,total,children,bgColor}:CardDataStatsProps) => {
  return (
    <div className={`rounded-md border border-stroke   px-7.5 py-3 shadow-md  bg-white border border-1 `}>
     <div className="flex items-center justify-between">

      <span className="text-sm font-medium">{title}</span>
      <div className="flex h-11.5 w-11.5 p-2 items-center justify-center rounded-full dark:bg-meta-4">
      {children}
    </div>
     </div>
    <div className="mt-4 flex items-end justify-between">
      <div>
        <h4 className="text-title-md font-bold text-black dark:text-white">
          {total}
        </h4>
      
      </div>

     
    </div>
  </div>
  );
};

export default CardDataStats;
