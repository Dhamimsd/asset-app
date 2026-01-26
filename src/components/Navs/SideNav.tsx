"use client";

import * as React from "react";
import { NextPage } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, ReactElement } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import {
    
  LayoutGrid,
  UsersRound,
  PanelRight,
  PanelRightClose,
  Package,
  MousePointer,
  Keyboard,
  Monitor,
  Computer,
  Headphones,
  Laptop,
  Phone
} from "lucide-react";

interface SideNavProps {
  className?: string;
}

interface SidebarSubItem {
  title: string;
  icon: ReactElement;
  path: string;
  badge?: string;
}

interface SidebarItem {
  title: string;
  icon: ReactElement;
  path?: string;
  subItems?: SidebarSubItem[];
  disabled?: boolean;
  badge?: string;
}

const sidebarItems: SidebarItem[] = [
  { title: "Overview", icon: <LayoutGrid size={20} />, path: "/dashboard/overview" },
  { title: "Employee", icon: <UsersRound size={20} />, path: "/dashboard/employee" },
  { title: "Assets", icon: <Package size={20} />, 
  subItems: [
    { title: "Mouse", icon: <MousePointer size={16} />, path: "/dashboard/assets/mouse_Asset" },
    { title: "Keyborad", icon: <Keyboard size={16} />, path: "/dashboard/assets/keyboard_Asset" },
    {title:"Heatset", icon:<Headphones size={16} />, path:"/dashboard/assets/heatset_Asset" },
    {title:"Phone", icon:<Phone size={16} />, path:"/dashboard/assets/phone_Asset" },
    {title:"Monitor", icon:<Monitor size={16} />, path:"/dashboard/assets/monitor_Asset" },
    { title: "PC", icon: <Computer size={16} />, path: "/dashboard/assets/pc_Asset" },
    { title: "Laptop", icon: <Laptop size={16} />, path: "/dashboard/assets/laptop_Asset" }
  ],
   },
];

const SideNav: NextPage<SideNavProps> = ({ className }) => {
  const path = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [sidebarDisabled, setSidebarDisabled] = useState(false);

  const linkClass = (href?: string) =>
    cn(
      "flex items-center p-1.5 rounded-md transition-all duration-200 hover:bg-gray-100 dark:hover:bg-zinc-800",
      href === path ? "bg-zinc-100 dark:bg-zinc-800 font-medium" : "text-gray-700 dark:text-white"
    );

  return (
    <div
      className={cn(
        "sticky top-20 left-4 h-[calc(100vh-7rem)] mb-4 border rounded-lg border-zinc-200 dark:border-neutral-700 flex flex-col transition-all duration-300 overflow-hidden",
        collapsed ? "w-20" : "w-60 lg:w-60",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-2 border-b border-zinc-200 dark:border-neutral-700">
        {!collapsed && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center py-1 px-1.5 hover:bg-zinc-100 dark:hover:bg-neutral-800 text-sm rounded-lg cursor-default">
                Activ8 Asia Admin
              </div>
            </DropdownMenuTrigger>
          </DropdownMenu>
        )}

        <Button
          size="sm"
          variant="ghost"
          className="p-2 transition-colors hover:bg-gray-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-white"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <PanelRightClose size={20} className="text-zinc-700 dark:text-white" />
          ) : (
            <PanelRight size={20} className="text-zinc-700 dark:text-white" />
          )}
        </Button>
      </div>

      {/* Sidebar items */}
      <div className="px-2 py-4 overflow-y-auto bg-gray-50 dark:bg-neutral-900 flex-1">
        <ul className="space-y-1 text-sm">
          {sidebarItems.map((item, idx) => (
            <li
              key={idx}
              className={cn({
                "filter blur-5 cursor-not-allowed opacity-50":
                  item.disabled || sidebarDisabled,
              })}
            >
              {item.subItems && item.subItems.length > 0 ? (
                <Accordion type="single" collapsible>
                  <AccordionItem value={item.title}>
                    <AccordionTrigger className="flex items-center p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800 group">
                      <div className="flex items-center w-full">
                        {React.cloneElement(item.icon, {
                          className: cn(
                            "transition-colors duration-200 text-zinc-700 dark:text-white",
                            path === item.path &&
                              "text-purple-800 dark:text-purple-400"
                          ),
                          variant: path === item.path ? "Bulk" : "Linear",
                        })}
                        {!collapsed && (
                          <span className="ml-3">{item.title}</span>
                        )}
                      </div>
                    </AccordionTrigger>

                    {!collapsed && (
                      <AccordionContent className="flex flex-col pl-6">
                        {item.subItems.map((sub, sidx) => (
                          <Link key={sidx} href={sub.path}>
                            <div
                              className={cn(
                                "flex items-center p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800",
                                {
                                  "bg-zinc-100 dark:bg-zinc-800 font-medium":
                                    path === sub.path,
                                }
                              )}
                              onClick={(e) =>
                                sidebarDisabled && e.preventDefault()
                              }
                            >
                              {React.cloneElement(sub.icon, {
                                className: cn(
                                  "transition-colors duration-200 text-zinc-700 dark:text-white",
                                  path === sub.path &&
                                    "text-purple-800 dark:text-purple-400"
                                ),
                                variant: path === sub.path ? "Bulk" : "Linear",
                              })}
                              <span className="ml-3">{sub.title}</span>
                              {sub.badge && (
                                <span className="inline-flex items-center justify-center w-3 h-3 p-2.5 ml-3 text-xs font-medium text-red-500 bg-red-100 rounded-full dark:bg-red-900 dark:text-red-500">
                                  {sub.badge}
                                </span>
                              )}
                            </div>
                          </Link>
                        ))}
                      </AccordionContent>
                    )}
                  </AccordionItem>
                </Accordion>
              ) : (
                <Link href={item.path || "#"}>
                  <div
                    className={
                      linkClass(item.path) +
                      " flex items-center justify-between"
                    }
                  >
                    {React.cloneElement(item.icon, {
                      className: cn(
                        "transition-colors duration-200 text-zinc-700 dark:text-white",
                        path === item.path &&
                          "text-purple-800 dark:text-purple-400"
                      ),
                      variant: path === item.path ? "Bulk" : "Linear",
                    })}
                    {!collapsed && (
                      <span className="ml-3  flex-1">{item.title}</span>
                    )}
                    {!collapsed && item.badge && (
                      <span className="inline-flex items-center justify-center px-1 py-0.5  text-xs font-medium text-green-500 bg-green-200 rounded-sm dark:bg-green-950 dark:text-green-500">
                        {item.badge}
                      </span>
                    )}
                  </div>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SideNav;
