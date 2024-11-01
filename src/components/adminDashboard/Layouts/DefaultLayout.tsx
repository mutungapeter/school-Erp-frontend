"use client";
import React, { useState, ReactNode } from "react";
import Sidebar from "../Sidebar";
import Header from "../Header";


export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
  return (
    <>
      <div className="flex flex-col w-full">
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          desktopSidebarOpen={desktopSidebarOpen}
          setDesktopSidebarOpen={setDesktopSidebarOpen}
        />

        <div
          className={`relative flex flex-1 flex-col transition-all duration-300 ease-linear ${desktopSidebarOpen ? "lg:ml-72.5" : "lg:ml-0"}`}
        >
          <Header
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            desktopSidebarOpen={desktopSidebarOpen}
            setDesktopSidebarOpen={setDesktopSidebarOpen}
          />

          <main>
            <div className="mx-auto w-full md:max-w-screen-2xl lg:max-w-screen-2xl p-3 md:p-4 2xl:p-5">
              {children}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
