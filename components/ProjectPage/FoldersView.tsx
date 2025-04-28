"use client";

import { Folder } from "@/types/types";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import FolderBox from "../Folder";
import NewFolderButton from "../NewFolderButton";
import { useFolder } from "@/context/FolderContext";

const FoldersView = ({ parentFolderId }: { parentFolderId: string }) => {
    const searchParams = useSearchParams();
    const folderQueryParam = searchParams.get("folder");

    const { folderList, updateFoldersList } = useFolder();
    const [isFolderVisible, setFolderVisibility] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);
    
    const folderListUpdate = async () => {
        setLoading(true);
        await updateFoldersList();
        setLoading(false);
    };

    useEffect(() => {
        folderListUpdate();
    }, [parentFolderId,folderQueryParam]);

    return (
        <div>
            {/* Header Section */}
            <div className="flex flex-grow justify-between items-center select-none mx-9 my-4">
                <div 
                    onClick={() => setFolderVisibility(!isFolderVisible)} 
                    className="flex h-[20px] justify-center items-center cursor-pointer"
                >
                    {isFolderVisible ? (
                        <ChevronDown size={24} strokeWidth={2} />
                    ) : (
                        <ChevronRight size={24} strokeWidth={2} />
                    )}
                    <p className="text-[18px] font-worksans font-medium">Folders</p>
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
            {!loading && folderList.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12">
                    <p className="text-lg font-medium text-gray-700">You have no folders</p>
                    <p className="text-sm text-gray-500">Start by creating a new folder to organize your work.</p>
                </div>
            )}

            {/* Folder List */}
            {isFolderVisible && !loading && folderList.length > 0 && (
                <div className="mx-10 my-6 grid grid-cols-4 gap-4 pl-[20px] pr-[100px]">
                    {folderList.map((folder: Folder) => (
                        <FolderBox key={folder.folderId} folder={folder} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default FoldersView;
