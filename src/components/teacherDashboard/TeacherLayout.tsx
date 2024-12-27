"use client";
import React, { useState, ReactNode } from "react";
import Sidebar from "./Sidebar";
import Header from "../adminDashboard/Header";


export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
  return (
    <>
      <div className="flex flex-col min-h-screen w-full">
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          desktopSidebarOpen={desktopSidebarOpen}
          setDesktopSidebarOpen={setDesktopSidebarOpen}
        />

        <div
        // relative
          className={`
            
             flex flex-1 flex-col transition-all duration-300 ease-linear ${desktopSidebarOpen ? "lg:ml-62.5" : "lg:ml-0"}`}
        >
          <Header
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            desktopSidebarOpen={desktopSidebarOpen}
            setDesktopSidebarOpen={setDesktopSidebarOpen}
          />

          {/* <main> */}
            <main className="mx-auto w-full md:max-w-screen-2xl lg:max-w-screen-2xl min-h-screen p-2 lg:p-3 md:p-3 2xl:p-3">
              {children}
            </main>
          {/* </main> */}
        </div>
      </div>
    </>
  );
}
