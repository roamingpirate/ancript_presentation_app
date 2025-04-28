import { Project } from '@/types/types'
import { ArrowLeft, ChevronLeft, Play, Redo2, RotateCcw, RotateCw, Share, Undo2 } from 'lucide-react';
import React from 'react'

const TopBar = ({projectDetails}:{projectDetails: Project}) => {

  const projectName = projectDetails.projectName;

  return (
    <div className='flex justify-between items-center rounded-xl bg-white h-[70px] w-[99%] mt-1 mx-2 fixed top-1 p-2 px-6'>
        <div className="flex items-center gap-5 h-[40px] ">
        <ChevronLeft
            size={30}
            strokeWidth={1}
            className="text-gray-500 cursor-pointer"
            onClick={() => window.history.back()}
        />
        <p className="text-gray-800 font-medium min-w-[100px]">{projectName}</p>

        {/* Undo Icon */}
        <Undo2 size={24} strokeWidth={1} className="text-gray-500 cursor-pointer" onClick={() => {/* handle undo */}} />

        {/* Redo Icon */}
        <Redo2 size={24}  strokeWidth={1} className="text-gray-500 cursor-pointer" onClick={() => {/* handle redo */}} />
        </div>
        <div className='flex items-center gap-4'>
            <button className='flex items-center bg-primary-100/80 text-white px-4 py-2 rounded-md'>
                <Play size={16} strokeWidth={2} className="mr-2" />
                Preview
            </button>
            <button className='flex  items-center bg-secondary/80 text-white   px-4 py-2 font-worksans rounded-md'>
                <Share size={16} strokeWidth={2} className="mr-2" />
                Share
            </button>
        </div>
    </div>
  )
}

export default TopBar