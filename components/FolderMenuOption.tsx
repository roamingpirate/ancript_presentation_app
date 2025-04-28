import React, { useEffect, useRef, useState } from 'react';
import { EllipsisVertical } from 'lucide-react';
import MoveFolderModal from './MoveFolderComponents/MoveFolderModal';
import { SessionProvider } from 'next-auth/react';
import { Folder } from '@/types/types';

const FolderMenuOption = ({folder}:{folder: Folder}) => {
  const [menuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const onClose = () => {
    setModalOpen(false);
  };

  return (
    <SessionProvider>
    <div       
      ref={menuRef}
      className={`relative rounded-lg p-1 hover:bg-gray-100 ${menuOpen || modalOpen ? 'block' : 'group-hover:block hidden'}`}
      onClick={(e) => { e.stopPropagation(); setIsMenuOpen(!menuOpen); }}
    >
      <EllipsisVertical size={20} strokeWidth={2} />
      {menuOpen && (
        <div className='absolute right-7 top-5 bg-white border border-gray-300 rounded-lg p-2 shadow-lg'>
          <p onClick={() => {setIsMenuOpen(false); setModalOpen(true); }} className='text-sm rounded-lg p-2 hover:bg-gray-200'>Move</p>
        </div>
      )}
      { modalOpen && <MoveFolderModal isOpen={modalOpen} onClose={onClose} folder={folder}/> }
     </div>
     </SessionProvider>
  );
};

export default FolderMenuOption;
