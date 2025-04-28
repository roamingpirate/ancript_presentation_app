'use client'

import React, { useState } from 'react'
import { OctagonX, User } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/store/hook'
import { Annotation, deleteAnnotation, selectAnnotation, setAnnotationToDeleteId, setShowDeleteAnnotationModal } from '@/store/slices/editorSlice'

interface Props {
  annotation: Annotation
}

const AnnotationListView: React.FC<Props> = ({ annotation }) => {
  const [showModal, setShowModal] = useState(false)
  const isSelecteAnnotation = useAppSelector(
    (state) => state.editor.selectedAnnotationId === annotation.annotationId
  )
  const dispatch = useAppDispatch()

  const isAnnotationSelected = useAppSelector(
    (state) => state.editor.selectedAnnotationId === annotation.annotationId
  )

  const handleClickDelete = () => {
    dispatch(setAnnotationToDeleteId(annotation.annotationId))
    dispatch(setShowDeleteAnnotationModal(true))
  }

  const handleDelete = () => {
    // TODO: Add your server-side delete logic here before dispatch
    dispatch(deleteAnnotation(annotation.annotationId))
    setShowModal(false)
  }

  return (
    <>
      <div onClick={() => {dispatch(selectAnnotation(annotation.annotationId))}} className={`flex items-center gap-2 cursor-pointer hover:bg-gray-100 rounded-md py-1 px-2 ${isSelecteAnnotation ? 'bg-gray-200' : ''}`}>
        <div className='p-1 flex justify-center items-center border rounded-full'>
          <User size={10} strokeWidth={2} className='text-gray-500' />
        </div>
        <p className='truncate w-[100px] text-[13px] text-gray-800 font-worksans'>
          Ann_{annotation.annotationId}
        </p>
        <div className='px-2' onClick={handleClickDelete}>
          <OctagonX size={15} strokeWidth={2} className='text-gray-500 hover:text-red-500' />
        </div>
      </div>
    </>
  )
}

export default AnnotationListView



