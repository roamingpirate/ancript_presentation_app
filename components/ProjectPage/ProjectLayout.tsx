
import { getFolder } from '@/app/actions/getFolder';
import { Folder } from '@/types/types';
import React from 'react'
import ProjectHeader from './ProjectHeader';
import FoldersView from './FoldersView';
import { FolderProvider } from '@/context/FolderContext';
import ProjectsView from './ProjectsView';

const ProjectLayout = async ({folderId,userId} :{folderId: string, userId : string}) => {
    
    const folderInfo: Folder = await getFolder(folderId);
    console.log("folder", folderInfo);
    if(folderInfo === null) return <>Folder Not Found</>  // Folder Not Found
  
    if(folderInfo.userId != userId) return <>Not Authorised</>  // Not Authorised for this folder

    return (
        <FolderProvider folderId={folderId}>
            <div className='flex flex-col w-full '>
            <ProjectHeader folder={folderInfo} userId={userId} />
            <FoldersView parentFolderId={folderId}/>
            <ProjectsView parentFolderId={folderId}/>
            </div>
        </FolderProvider>
    )
}

export default ProjectLayout