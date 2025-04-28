import { Folder } from '@/types/types';
import { ChevronDown, ChevronRight, CircleCheckIcon, FolderIcon } from 'lucide-react';
import React, { useState } from 'react';
import FolderListBox from './FolderListBox';

const FolderView = ({ 
    folder, 
    selectedFolderId, 
    setSelectedFolderId, 
    subFolderLevel, 
    folderIdToMove 
}: { 
    folder: Folder | undefined, 
    selectedFolderId: string, 
    setSelectedFolderId: any, 
    subFolderLevel: number, 
    folderIdToMove: string 
}) => {
    if (!folder) return null;

    const itemsCount = folder.itemsCount;
    const folderName = folder.folderName;
    const currentFolderId = folder.folderId;
    const isSelected = selectedFolderId === folder.folderId;
    const [isFolderExpanded, setIsFolderExpanded] = useState(false);
    const isDisabled = currentFolderId === folderIdToMove;

    const toggleFolderExpand = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isDisabled) {
            setIsFolderExpanded(prev => !prev);
        }
    };

    const selectFolder = () => {
        if (!isDisabled) {
            setSelectedFolderId(folder.folderId);
        }
    };

    return (
        <>
            <div 
                onClick={isDisabled ? undefined : selectFolder} 
                className={`p-3 rounded-lg flex items-center space-x-3 
                    ${isSelected ? 'border-2 border-blue-500' : ''} 
                    ${isDisabled ? 'bg-gray-200 my-1 opacity-50' : 'hover:bg-gray-100 cursor-pointer'}
                `} 
                style={{ marginLeft: `${subFolderLevel * 35}px` }}
            >
                {/* Expand/Collapse Button */}
                <div className='w-[24px]'>
                    {itemsCount > 0 && !isDisabled && (
                        <button 
                            className={`hover:bg-gray-300 p-1 rounded-lg ${isDisabled ? 'cursor-not-allowed' : ''}`}
                            onClick={toggleFolderExpand} 
                            disabled={isDisabled}
                        >
                            {isFolderExpanded ? (
                                <ChevronDown size={18} strokeWidth={2} />
                            ) : (
                                <ChevronRight size={18} strokeWidth={2} />
                            )}
                        </button>
                    )}
                </div>

                {/* Folder Icon */}
                {isSelected ? (
                    <CircleCheckIcon color='blue' size={18} strokeWidth={2} />
                ) : (
                    <FolderIcon size={18} strokeWidth={2} />
                )}

                {/* Folder Name */}
                <p className='text-sm font-worksans'>{folderName}</p>
            </div>

            {/* Render Subfolders */}
            {isFolderExpanded && !isDisabled && (
                <FolderListBox 
                    parentFolderId={folder.folderId} 
                    selectedFolderId={selectedFolderId} 
                    setSelectedFolderId={setSelectedFolderId} 
                    subFolderLevel={subFolderLevel + 1}
                    folderIdToMove={folderIdToMove}
                />
            )}
        </>
    );
}

export default FolderView;
