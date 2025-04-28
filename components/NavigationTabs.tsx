"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface NavigationTabProps {
  TabName: string;
  TabIcon: React.ElementType; 
  TabLink: string;
}

const NavigationTabs: React.FC<NavigationTabProps> = ({ TabName, TabIcon, TabLink }) => {
  const pathname = usePathname();
  const isActive = pathname === TabLink;
  
  const Icon = TabIcon; 

  return (
    <Link href={TabLink}>
      <div className={`flex py-3 px-3 my-2 bg-gray-transition rounded-lg items-center ${isActive ? "bg-gray-200" : "bg-white"}`}>
        <Icon size={18} color={`${isActive? '#6E5EE5':'black'}`} /> 
        <p className="text-sm font-worksans font-normal ml-2">{TabName}</p>
      </div>
    </Link>
  );
};

export default NavigationTabs;
