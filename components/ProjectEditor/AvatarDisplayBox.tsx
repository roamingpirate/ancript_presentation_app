'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { useDispatch } from 'react-redux'
import { selectAnnotation } from '@/store/slices/editorSlice'
import { X } from 'lucide-react'

const AvatarDisplayBox = () => {
  const dispatch = useDispatch()
  const [isHovered, setIsHovered] = useState(false)

  const handleClose = () => {
    dispatch(selectAnnotation(null))
  }

  return (
    <div className="relative w-[300px] max-w-xs aspect-[3/4]  rounded-xl flex items-center justify-center mx-auto">
      {/* Close Icon + Tooltip */}
      <div
        className="absolute top-8 right-2 z-20"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <button
          onClick={handleClose}
          className="bg-white rounded-full p-1 shadow hover:bg-gray-200 transition"
        >
          <X className="w-5 h-5 text-gray-800" />
        </button>

        {/* Tooltip */}
        {isHovered && (
          <div className="absolute bottom-full left-0 mb-1 bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap z-30">
            Close Annotation
          </div>
        )}
      </div>

      {/* Centered Circular Image */}
      <div className=" rounded-full  overflow-hidden border-2 border-blue-400 shadow">
        <Image
          src="/avatar.webp"
          alt="Avatar"
          width={160}
          height={160}
          className="object-cover w-full h-full"
        />
      </div>
    </div>
  )
}

export default AvatarDisplayBox
