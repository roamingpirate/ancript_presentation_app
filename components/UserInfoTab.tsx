"use client";
import { signOut, useSession } from 'next-auth/react';
import React, { useState } from 'react'
import { ChevronDown, ChevronUp, LogOut, Settings, User } from "lucide-react";

const UserInfoTab = () => {

  const session = useSession();
  const user = session?.data?.user;

  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className='relative select-none'>
        <div onClick={() => setIsExpanded(!isExpanded)} className='flex bg-gray-transition mt-8 py-3 px-2 rounded-md justify-center cursor-pointer'>
            <div className='rounded-lg mr-3 w-[40px] flex justify-center items-center h-[40px] overflow-hidden'>
                <img className='w-[49px] h-[49px]  object-cover'  src={user?.image || '/user_pic_fallback.png'} alt="User Image" />
            </div>

            <div className='flex-grow space-y-[1px]'>
                <p className='text-sm  font-medium font-mono '>{user?.name}</p>
                <p className='bg-primary-100/30 px-[4px] py-[0.5px] text-gray-600 rounded-md w-fit text-[10px]'>Free</p>
            </div>

            {!isExpanded? <ChevronDown size={16}/> : <ChevronUp size={16}/>}
        </div>

        {isExpanded && <UserDetailsModal/>}
    </div>
  )
}


const UserDetailsModal = () => {

    const session = useSession();
    const user = session?.data?.user;

    return (
        <div className='absolute pt-4 pb-10 top-16 left-0 rounded-xl shadow-[0_0_10px_rgba(0,0,0,0.4)] z-10 w-[280px] bg-white border-gray-400 '>
            <p className=' px-6 text-gray-400 text-xs'>Signed in as</p>

            <div className='flex justify-center items-center mt-4 cursor-pointer px-6'>
                <img className='w-[36px] h-[36px] rounded-full mr-2'  src={user?.image || '/default-image.png'} alt="User Image" />
                <div className='flex-grow space-y-[1px]'>
                    <p className='text-sm font-medium font-worksans '>{user?.name}</p>
                    <p className='text-xs text-gray-400 font-sans max-w-[160px] break-words'>{user?.email}</p>
                </div>
                <User size={18}/>
            </div>
            <hr className="border-t-[0.2px] mx-3 border-gray-200 my-4" />
            <div className='flex px-6 py-2 bg-gray-transition mt-4 mb-1 items-center cursor-pointer '>
                <Settings size={18}/>
                <p className='text-sm ml-2 font-worksans font-medium'>Settings</p>
            </div>
            <div onClick={()=>signOut()} className='flex px-6 py-2 bg-gray-transition items-center cursor-pointer'>
                <LogOut size={18}/>
                <p className='text-sm ml-2 font-worksans font-medium'>Logout</p>
            </div>

        </div>
    )
}

export default UserInfoTab