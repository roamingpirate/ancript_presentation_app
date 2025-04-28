import { getFoldersList } from '@/app/actions/getFoldersList';
import { Folder } from '@/types/types';
import React, { useEffect, useState } from 'react';
import FolderView from './FolderView';
import { Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FolderListBox = ({ parentFolderId, selectedFolderId, setSelectedFolderId, subFolderLevel,folderIdToMove }: { parentFolderId: string, selectedFolderId: string, setSelectedFolderId: React.Dispatch<React.SetStateAction<string>>, subFolderLevel: number,folderIdToMove: string }) => {
  
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getFoldersList(parentFolderId)
      .then((data) => {
        setFolders(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [parentFolderId]);

  return (
    <div className=''>
      {loading ? (
        <div className="py-2 flex justify-center">
          <Loader className="animate-spin text-gray-500" size={24} strokeWidth={2} />
        </div>
      ) : (
        <AnimatePresence>
          {folders.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {folders.map((folder) => (
                <FolderView key={folder.folderId} folderIdToMove={folderIdToMove} subFolderLevel={subFolderLevel} folder={folder} selectedFolderId={selectedFolderId} setSelectedFolderId={setSelectedFolderId} />
              ))}
            </motion.div>
          ) : (
            <p className="text-gray-400 text-center">No folders found</p>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}

export default FolderListBox;
