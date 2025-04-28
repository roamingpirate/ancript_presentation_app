import React, { Suspense } from 'react'
import { getFolder } from '../../actions/getFolder'
import {  getFoldersList } from '../../actions/getFoldersList';
import { getProjectsList } from '../../actions/getProjectsList';
import { Folder, Project } from '@/types/types';
import { getServerSession } from 'next-auth';
import { authOption } from '../../api/auth/[...nextauth]/route';
import ProjectHeader from '@/components/ProjectPage/ProjectHeader';
import ProjectLayout from '@/components/ProjectPage/ProjectLayout';
import Loading from '@/components/Loading';


const page = async ({ searchParams }: { searchParams: { folder?: string } }) => {

  const session = await getServerSession(authOption);
  const userId = session?.user?.id;
  if(userId === undefined) return <></>  // Add Error Page
  
  const folderId = searchParams.folder ?? userId;
  console.log("folderId", folderId);

  return (
    <>
        <Suspense fallback={<Loading/>}>
          <ProjectLayout folderId={folderId} userId={userId}/>
        </Suspense>
    </>

  )
}

export default page