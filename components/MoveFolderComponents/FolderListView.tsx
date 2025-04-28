import { getFolder } from '@/app/actions/getFolder';
import { Folder } from '@/types/types';
import React, { useEffect, useState } from 'react'
import FolderView from './FolderView';
import FolderListBox from './FolderListBox';
import { useSession } from 'next-auth/react';

const FolderListView = ({ selectedFolderId, setSelectedFolderId,userId, folderIdToMove }: { selectedFolderId: string, setSelectedFolderId: any, userId: string, folderIdToMove: string }) => {

   const RootFolder: Folder = {
    folderId: userId,
    folderName: 'My Folders',
    itemsCount: 1,
    folderCreationDate: '2025',
    parentFolderId:'null',
    userId: 'user'
   }

  return (
        <div className='text-gray-900'>
            <FolderView folder={RootFolder} subFolderLevel={0} folderIdToMove={folderIdToMove} selectedFolderId={selectedFolderId} setSelectedFolderId={setSelectedFolderId}/>
        </div>

  )
}

export default FolderListView