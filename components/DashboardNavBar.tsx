"use client";
import React from "react";
import Logo from "./Logo";
import UserInfoTab from "./UserInfoTab";
import SessionProviderWrapper from "./utils/SessionProviderWrapper";
import NewProjectTab from "./NewProjectTab";
import NavigationTabs from "./NavigationTabs";
import { Folder, Home, Mic, UserPlus } from "lucide-react";


const DashboardNavBar = () => {
  return (
      <div className="w-[265px] h-screen border-r-[0.5px] border-r-gray-200 px-3 py-4">
        <Logo/>
            <UserInfoTab />
            <NewProjectTab/>
        <div className="mt-12 ">
        <NavigationTabs TabIcon={Home} TabLink="/home" TabName="Home"/>
        <NavigationTabs TabIcon={Folder} TabLink="/projects" TabName="Projects"/>
        <p className="text-xs text-gray-400 font-worksans my-4">Assets</p>
        <NavigationTabs TabIcon={UserPlus} TabLink="/avatar" TabName="Avatar"/>
        <NavigationTabs TabIcon={Mic} TabLink="/voice" TabName="AI Voice"/>
        </div>
      </div>
  );
};

export default DashboardNavBar;
