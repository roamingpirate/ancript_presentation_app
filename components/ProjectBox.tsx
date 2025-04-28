"use client";
import { Folder, Project } from '@/types/types';
import { FolderIcon, PanelsTopLeft } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import FolderNameField from './FolderNameField';
import FolderMenuOption from './FolderMenuOption';
import ProjectNameField from './ProjectNameField';


const ProjectBox = ({ project }: { project: Project }) => {

  const router = useRouter();

  const handleClick = () => {
    if (project?.projectId) {
      // Modify the browser history to remove the query param without causing a page reload
      const url = new URL(window.location.href);
      url.searchParams.delete("createProject");
      window.history.replaceState({}, "", url.toString());

      // Navigate to the new project page
      router.push(`/project/editor/${project.projectId}`);
  } else {
      console.error("Project creation failed. No projectId returned.");
  }
  };

  return (
    <div className="p-1 transition-all duration-200 border border-transparent rounded-lg hover:shadow-2xl hover:border-gray-100 hover:-translate-y-0.5">
      <div
        onClick={handleClick}
        className="group flex flex-col  justify-between items-center font-worksans  rounded-lg cursor-pointer select-none pl-1.5 py-1 pr-1.5 transition-all duration-150 ease-in-out"
      >
      <div className='h-[150px] w-full bg-blue-100 border border-gray-300 rounded-md'></div>
        <div className="flex w-full pt-2 items-center space-x-3 pl-1">
        <PanelsTopLeft size={20} strokeWidth={2} className="text-blue-500" />
        <div onClick={(e) => e.stopPropagation()}>
            <ProjectNameField project={project} />
            <p className="text-xs text-gray-500">
              {new Date(project.creationDate).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
        {/* <FolderMenuOption folder={folder}/> */}
      </div>
    </div>
  );
  

};

export default ProjectBox;