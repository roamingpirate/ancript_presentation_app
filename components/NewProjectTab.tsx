import React, { useState } from 'react'
import NewProjectModal from './NewProjectComponents/NewProjectModal';
import {  useRouter } from "next/navigation";

const NewProjectTab = () => {
 
  const router = useRouter();

  function openModal() {
    const newParams = new URLSearchParams(window.location.search);
    newParams.set("createProject", "true");
    router.push(`${window.location.pathname}?${newParams.toString()}`);
  }
  

  return (
    <>
      <div onClick={openModal} className='flex justify-center items-center p-2 mt-8 rounded-lg bg-primary-100 cursor-pointer'>
          <p className='text-md text-white font-worksans'> Create New Project</p>
      </div>
    </>
  )
}

export default NewProjectTab