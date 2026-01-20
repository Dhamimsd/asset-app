"use client";

import { NextPage } from "next";
import { signOut, signIn, useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { ModeToggle } from "@/components/misc/themeToggler";

interface Props {
  user: { name: string; };
}

const TopNav: NextPage<Props> = ({ user }) => {
  const firstLetter =
  user?.name?.charAt(0)?.toUpperCase() ?? "A";


  return (
    <nav className="flex justify-between items-center px-8 py-3 sticky top-0 z-50 shadow-lg">
      {/* Logo */}
      <p className="text-2xl font-bold tracking-wide select-none">
        Activ8
        <span className="font-semibold ml-1 text-purple-800 dark:text-purple-600">
          Asia
        </span>
      </p>

      {/* Right menu */}
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-200 dark:bg-purple-400/30 text-purple-800 dark:text-purple-200 font-bold cursor-pointer shadow-lg hover:scale-105 transition">
              {firstLetter}
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-44 rounded-lg border border-purple-700 bg-purple-900 text-white shadow-xl"
          >
            <DropdownMenuLabel className="text-sm font-semibold text-purple-300">
              My Account
            </DropdownMenuLabel>

            <DropdownMenuItem
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="hover:bg-purple-700 hover:text-white rounded-md cursor-pointer"
            >
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <ModeToggle />
      </div>
    </nav>
  );
};

export default TopNav;
