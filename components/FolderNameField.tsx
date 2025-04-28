import { updateFolderName } from '@/app/actions/updateFolderName';
import { Folder } from '@/types/types';
import { EditIcon } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';




const FolderNameField = ({ folder }: { folder: Folder}) => {
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(folder.folderName);
  const inputRef = useRef<HTMLInputElement>(null);

  const editFolderName = () => {
    setEditMode(false); 
    updateFolderName(folder.folderId, name);
  }

  useEffect(() => {
    if (editMode && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select(); 
    }
  }, [editMode]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
        editFolderName();
    }
  };

  return (
    <div className="">
      {editMode ? (
        <input
          ref={inputRef}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown} 
          onBlur={() => editFolderName()} 
          className="border-b border-gray-400 p-[2px] outline-none w-full"
        />
      ) : (
        <div
          onClick={() => setEditMode(true)}
          className="group/folder flex space-x-1 cursor-text border-b-2 items-center border-transparent hover:border-gray-400 border-dashed"
        >
          <p className="font-medium">{name}</p>
          <EditIcon size={15} strokeWidth={2} className="hidden group-hover/folder:block" />
        </div>
      )}
    </div>
  );
};

export default FolderNameField;
