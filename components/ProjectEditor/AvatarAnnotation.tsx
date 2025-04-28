'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion, PanInfo } from 'framer-motion'
import { useAppDispatch, useAppSelector } from '@/store/hook'
import { updateAnnotationPosition, selectAnnotation, Annotation } from '@/store/slices/editorSlice'
import { updateAnnotationPositionServer } from '@/app/actions/updateAnnotationPosition'
import { useTransformContext } from 'react-zoom-pan-pinch'

interface Props {
    x: number
    y: number
    id: string
    pageNo: number
    dragging: boolean
    setDragging: any
    annotation: Annotation
}
  

const AvatarAnnotation: React.FC<Props> = ({annotation, x, y, id, pageNo, dragging, setDragging }) => {
  const dispatch = useAppDispatch()
  const editorMode = useAppSelector(s => s.editor.editorMode)
  const isSelected = useAppSelector(s => s.editor.selectedAnnotationId === id)
  const projectId = useAppSelector(s => s.editor.projectId!)
  const { transformState: state } = useTransformContext()

  //const isSelected = selectedAnnotationId === id
  const [position, setPosition] = useState({ x, y })
  const [scale, setScale] = useState(1)
  
  useEffect(() => {
    setPosition({ x: annotation.x, y: annotation.y })
    if(!annotation.scale) return
    setScale(annotation.scale);
  },[annotation])
  //const [dragging, setDragging] = React.useState(false)

  const handlePointerDown = (e: React.PointerEvent) => {
    if (editorMode !== 'idle') return
    e.stopPropagation()
    e.preventDefault()
   // setDragging(false)
  }

  const handleDragStart = (e: PointerEvent) => {
    if (editorMode === 'idle') {
      setDragging(true)
    } else {
      e.preventDefault()
    }
  }

  const handleDragEnd = async (event: any, info: PanInfo) => {
    if (editorMode !== 'idle') return;

    const newX = position.x + info.offset.x ;
    const newY = position.y + info.offset.y ;
  
    setPosition({ x: newX, y: newY });
    dispatch(updateAnnotationPosition({ id, x: newX, y: newY }));
    await updateAnnotationPositionServer({
      projectId,
      annotationId: id,
      pageNo,
      x: newX,
      y: newY,
    });
    setTimeout(() => {setDragging(false);}, 100);
  };
  
  
  const handleClick = () => {
    if (!dragging && editorMode === 'idle') {
      dispatch(selectAnnotation(isSelected ? null : id))
    }
  }

  return (
    <motion.div
      drag={editorMode === 'idle' && isSelected}
      dragMomentum={false}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onPointerDown={handlePointerDown}
      onClick={handleClick}
      style={{
        x: position.x,
        y: position.y,
        position: 'absolute',
        transform: 'translate(-50%, -50%)',
        touchAction: 'none',
        cursor: editorMode === 'idle' ? 'pointer' : 'default',
      }}
      title="Avatar Annotation"
      className={`group z-10 ${isSelected ? 'border-4 border-blue-500 p-[2px]' : ''}`}
    >
      <div
        className={`overflow-hidden rounded-full shadow-xl transition-transform duration-300 ease-in-out group-hover:scale-105 ${
          isSelected
            ? 'border-2 border-gray-100'
            : 'border-[4px] border-blue-500'
        }`}
        style={{

          backgroundColor: '#f0f4ff',
        }}
      >
        <Image
          src="/avatar.webp"
          alt="Avatar"
          width={60*scale}
          height={60*scale}
          className="object-cover w-full h-full"
        />
      </div>
    </motion.div>
  )
}

export default AvatarAnnotation
