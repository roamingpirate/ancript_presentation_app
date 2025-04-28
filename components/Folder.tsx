import { Folder } from '@/types/types';
import { FolderIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';
import FolderNameField from './FolderNameField';
import FolderMenuOption from './FolderMenuOption';


const FolderBox = ({ folder }: { folder: Folder }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`?folder=${folder.folderId}`);
  };

  return (
    <div 
      onClick={handleClick} 
      className="group flex items-center justify-between font-worksans border border-gray-300 rounded-lg cursor-pointer select-none pl-4 py-3 pr-4 transition-all duration-75 ease-in-out hover:outline-blue-500 hover:outline"
    >
      <div className="flex items-center space-x-2">
        <FolderIcon size={20} strokeWidth={2} />
        <div onClick={(e) => e.stopPropagation()}>
          <FolderNameField folder={folder} />
          <p className="text-xs text-gray-500">{folder.itemsCount} items</p>
        </div>
      </div>
      <FolderMenuOption folder={folder}/>
    </div>
  );
};

export default FolderBox;