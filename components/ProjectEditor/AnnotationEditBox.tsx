'use client'

import React, { useEffect, useState } from 'react'
import { RefreshCcw } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/store/hook'
import { Annotation, updateAnnotationPosition } from '@/store/slices/editorSlice'
import DragInput from './DragInput'
import { updateAnnotationPositionServer } from '@/app/actions/updateAnnotationPosition'

let debounceTimer: NodeJS.Timeout

const AnnotationEditBox: React.FC = () => {
  const dispatch = useAppDispatch()
  const selectedAnnotationId = useAppSelector(s => s.editor.selectedAnnotationId)

  const annotation: Annotation | undefined = useAppSelector((state) =>
    state.editor.annotations.find(a => a.annotationId === selectedAnnotationId)
  )
  const projectId = useAppSelector((s) => s.editor.projectId)

  const [x, setX] = useState(annotation?.x ?? 0)
  const [y, setY] = useState(annotation?.y ?? 0)
  const [scale, setScale] = useState(annotation?.scale ?? 1)

  // Sync UI when annotation changes
  useEffect(() => {
    if (annotation) {
      setX(annotation.x)
      setY(annotation.y)
      setScale(annotation.scale || 1)
    }
  }, [annotation?.x, annotation?.y, annotation?.scale])

  // Update Redux immediately
  useEffect(() => {
    if (annotation) {
      dispatch(updateAnnotationPosition({
        id: annotation.annotationId,
        x,
        y,
        scale
      }))
    }
  }, [x, y, scale])

  // Debounced backend update
  useEffect(() => {
    if (!annotation || !projectId) return

    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
      console.log("updating backend")
      updateAnnotationPositionServer({
        projectId,
        annotationId: annotation.annotationId,
        pageNo: annotation.pageNo,
        x,
        y,
        scale
      })
    }, 500) // Adjust debounce delay as needed
  }, [x, y, scale])

  if (!annotation) return null

  return (
    <div className='px-4 select-none border border-gray-200 m-1 rounded-xl'>
      <div className='flex py-2 gap-2 cursor-pointer items-center'>
        <p className="text-[14px] text-gray-800 overflow-hidden font-medium font-worksans text-ellipsis whitespace-nowrap">
          Avatar_{annotation.annotationId}
        </p>
      </div>

      <hr />

      <div className='flex-col my-1 mb-3 justify-center'>
        <p className='text-gray-500 text-xs font-medium'>Avatar</p>
        <div className='mx-4 flex cursor-pointer px-2 mt-1 p-1 bg-gray-200 rounded-md gap-2 w-fit items-center text-gray-900'>
          <RefreshCcw size={16} strokeWidth={2} />
          <p className='text-[12px]'>Replace Avatar</p>
        </div>
      </div>

      <hr />

      <div className='flex-col my-1 mb-4 justify-center'>
        <p className='text-gray-500 text-xs font-medium'>Position</p>
        <div className='flex mx-2 gap-1 pt-1'>
          <DragInput label="X" value={x} setValue={setX} min={0} max={870} />
          <DragInput label="Y" value={y} setValue={setY} min={0} max={870} />
        </div>
      </div>

      <div className='flex-col my-1 mb-4 justify-center'>
        <p className='text-gray-500 text-xs font-medium'>Scale</p>
        <div className='flex mx-2 gap-1 pt-1 w-fit'>
          <DragInput label="" iconName="Rotate3D" value={scale} setValue={setScale} min={0.5} max={4} offset={0.05} />
        </div>
      </div>
    </div>
  )
}

export default AnnotationEditBox
