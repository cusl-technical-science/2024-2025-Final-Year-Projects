"use client";

import { SearchContainer } from " @/components/search-container";
import { Button } from " @/components/ui/button";
import { UserButton, useUser } from "@clerk/nextjs";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export const NavbarRoutes = () => {
  const pathname = usePathname();
  const { user } = useUser(); // Get the current user from Clerk

  const [message, setMessage] = useState<string | null>(null); // State for the error message

  const isAdminPage = pathname?.startsWith("/admin");
  const isPlayerPage = pathname?.startsWith("/jobs");
  const isSearchPage = pathname?.startsWith("/search");
  const isHomePage = pathname === "/dashboard"; // Check if we are on the "/" route
  const isUserDashBoard = pathname?.startsWith("/user/dashboard");

  // Check if the current user is an admin
  const isAdmin = user?.publicMetadata?.role === "admin";

  // Handle non-admin users trying to access the Admin Mode
  useEffect(() => {
    if (!isAdmin && isAdminPage) {
      setMessage("You can't access the admin page.");
      setTimeout(() => {
        window.location.href = "/dashboard"; // Redirect to home after 2 seconds
      }, 2000);
    }
  }, [isAdmin, isAdminPage]);

  return (
    <>
      {message && (
        <div className="text-red-500 text-center mb-4">
          <p>{message}</p>
        </div>
      )}

      {isSearchPage && (
        <div className="hidden md:flex w-full px-2 pr-8 items-center gap-x-6">
          <SearchContainer />
        </div>
      )}

      <div className="flex gap-x-2 ml-auto">
        {/* Show "Admin Mode" only for admin users on the home page ("/") */}
        {isHomePage && isAdmin && (
          <Link href={"/admin/jobs"}>
            <Button
              variant={"outline"}
              size={"sm"}
              className="border-purple-700/20"
            >
              Admin Mode
            </Button>
          </Link>
        )}

        {/* Show Exit button if in Admin Mode, Jobs page, or User Dashboard */}
        {(isAdminPage || isPlayerPage || isUserDashBoard) && (
          <Link href={"/"}>
            <Button
              variant={"outline"}
              size={"sm"}
              className="border-purple-700/20"
            >
              <LogOut />
              Exit
            </Button>
          </Link>
        )}

        {/* Only show UserButton if user is logged in */}
        <UserButton afterSignOutUrl="/" />
      </div>
    </>
  );
};
