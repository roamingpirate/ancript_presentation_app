"use client";

import { Folder, Project } from "@/types/types";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import FolderBox from "../Folder";
import NewFolderButton from "../NewFolderButton";
import { useFolder } from "@/context/FolderContext";
import ProjectBox from "../ProjectBox";

const ProjectsView = ({ parentFolderId }: { parentFolderId: string }) => {
    const searchParams = useSearchParams();
    const folderQueryParam = searchParams.get("folder");

    const { projectList, updateProjectsList } = useFolder();
    const [isProjectVisible, setProjectVisibility] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);
    
    const folderListUpdate = async () => {
        setLoading(true);
        await updateProjectsList();
        setLoading(false);
    };

    useEffect(() => {
       console.log("Project List peopo", projectList);
    }, [projectList]);

    useEffect(() => {
        folderListUpdate();
    }, [parentFolderId,folderQueryParam]);

    return (
        <div>
            {/* Header Section */}
            <div className="flex flex-grow justify-between items-center select-none mx-9 my-4">
                <div 
                    onClick={() => setProjectVisibility(!isProjectVisible)} 
                    className="flex h-[20px] justify-center items-center cursor-pointer"
                >
                    {isProjectVisible ? (
                        <ChevronDown size={24} strokeWidth={2} />
                    ) : (
                        <ChevronRight size={24} strokeWidth={2} />
                    )}
                    <p className="text-[18px] font-worksans font-medium">Projects</p>
                </div>
                <NewFolderButton parentFolderId={parentFolderId} />
            </div>

            {/* Loader */}
            {loading && (
                <div className="flex h-[200px] justify-center items-center py-6">
                    <div className="w-6 h-6 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                </div>
            )}

            {/* No Folders Message */}
            {!loading && projectList.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12">
                    <p className="text-lg font-medium text-gray-700">You have no Projects</p>
                    <p className="text-sm text-gray-500">Start by creating a new Project.</p>
                </div>
            )}

            {/* Folder List */}
            {isProjectVisible && !loading && projectList.length > 0 && (
                <div className="ml-4 my-6 grid grid-cols-4 gap-1 pl-[20px] pr-[50px]">
                    {projectList.map((project: Project) => (
                        <ProjectBox key={project.projectId} project={project}/>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProjectsView;
