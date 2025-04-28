"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Folder as FolderIcon } from "lucide-react";
import { Folder } from "@/types/types";

const ProjectHeader = ({ folder, userId }: { folder: Folder; userId: string }) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleBackNavigation = () => {
        if (!folder.parentFolderId) return; 

        const params = new URLSearchParams(searchParams);
        params.set("folder", folder.parentFolderId);
        router.push(`?${params.toString()}`);
    };

    if (folder.folderId === userId) {
        return (
            <div>
                <p className="text-[23px] mx-4 sm:mx-8 my-6 font-worksans font-medium">Projects</p>
            </div>
        );
    }

    return (
        <div className="flex ml-6 sm:ml-8 items-center h-[20px] my-6 space-x-2">
            <ArrowLeft 
                className="mx-2 cursor-pointer rounded-lg p-1 hover:bg-gray-300" 
                strokeWidth={1.5} 
                size={30} 
                onClick={handleBackNavigation} 
            />
            <FolderIcon strokeWidth={1.5} size={24} />
            <p className="text-lg">{folder.folderName}</p>
        </div>
    );
};

export default ProjectHeader;
