"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { Folder, Project } from "@/types/types";
import { getFoldersList } from "@/app/actions/getFoldersList";
import { getProjectsList } from "@/app/actions/getProjectsList";

interface FolderContextType {
  folderList: Folder[];
  updateFoldersList: () => void;
  projectList: Project[];
  updateProjectsList: () => void;
}

const FolderContext = createContext<FolderContextType | undefined>(undefined);

export const FolderProvider = ({ folderId, children }: { folderId: string; children: React.ReactNode }) => {
  const [folderList, setFolderList] = useState<Folder[]>([]);
  const [projectList, setProjectList] = useState<Project[]>([]);

  const updateFoldersList = async () => {
    if (!folderId) return;
    const data = await getFoldersList(folderId);
    setFolderList(data);
  };

  const updateProjectsList = async () => {
    if (!folderId) return;
    const data = await getProjectsList(folderId);
    setProjectList(data);
  };

  return (
    <FolderContext.Provider value={{ folderList, updateFoldersList, projectList, updateProjectsList }}>
      {children}
    </FolderContext.Provider>
  );
};

export const useFolder = () => {
  const context = useContext(FolderContext);
  if (!context) {
    throw new Error("useFolder must be used within a FolderProvider");
  }
  return context;
};
