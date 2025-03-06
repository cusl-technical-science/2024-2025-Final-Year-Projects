
"use client"; 
import React from "react";

 // Ensure correct export and path
import { SidebarRoutes } from "./Sidebar-routes";
import { Logo } from " @/app/(dashboard)/_components/logo";
 // Ensure correct export and path

 const Sidebar = () => {
  return (
    <div className="h-full border-r flex flex-col overflow-y-auto bg-white">
      <div className="p-6">
        <Logo />
      </div>

      {/* Sidebar routes */}
      <div className="flex flex-col w-full">
        <SidebarRoutes />
      </div>
    </div>
  );
};

export default Sidebar;