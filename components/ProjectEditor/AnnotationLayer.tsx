'use client'

import React, { useEffect, useState } from 'react'
import { useTransformContext } from 'react-zoom-pan-pinch'
import { useAppDispatch, useAppSelector } from '@/store/hook'
import AvatarAnnotation from './AvatarAnnotation'
import {
  addAnnotation,
  selectAnnotation,
  setAnnotations,
  setEditorMode,
} from '@/store/slices/editorSlice'
import { toast } from 'sonner'
import { getAnnotations } from '@/app/actions/getAnnotations'
import addAnnotationServer from '@/app/actions/addAnnotation'

const MAX_ANNOTATIONS = 8

const AnnotationLayer = () => {
  const dispatch = useAppDispatch()
  const { transformState: state } = useTransformContext()
  const editorMode = useAppSelector((s) => s.editor.editorMode)
  const projectName = useAppSelector((s) => s.editor.projectName)
  const projectId = useAppSelector((s) => s.editor.projectId!)
  const currentPage = useAppSelector((s) => s.editor.currentPage)
  const annotations = useAppSelector((s) =>
    s.editor.annotations.filter((a) => a.pageNo === currentPage)
  )
   const [dragging, setDragging] = useState(false)



  const handleClick = async (e: React.MouseEvent) => {
    if (editorMode !== 'avatarAdd') return

    if (annotations.length >= MAX_ANNOTATIONS) {
      toast.error('You can only add up to 8 avatars on a page.')
      return
    }

    const container = e.currentTarget.getBoundingClientRect()
    const rawX = e.clientX - container.left
    const rawY = e.clientY - container.top
    const adjustedX = rawX / state.scale
    console.log(rawX, "layer")
    const adjustedY = rawY / state.scale

    try {
      const newAnnotation = await addAnnotationServer({
        x: adjustedX,
        y: adjustedY,
        pageNo: currentPage,
        projectId: projectId,
        avatarId: '1',
        annotationNumber: annotations.length + 1,
        avatarImgId: '1',
      })



      if(!newAnnotation) { return }

      dispatch(addAnnotation(newAnnotation))
      dispatch(selectAnnotation(newAnnotation.annotationId))
      dispatch(setEditorMode('idle'))
    } catch (err) {
      console.error('Error adding annotation:', err)
      toast.error('Failed to add annotation.')
    }
  }

  // const handleClickCapture = () => {
  //   if (!dragging && editorMode === 'idle') {
  //     dispatch(selectAnnotation(null))
  //   }
  // }

  return (
    <div
      data-annotation-layer
      className="absolute top-0 left-0"
      style={{
        width: '100%',
        height: '100%',
        pointerEvents: 'auto',
        zIndex: 10,
      }}
      onClick={handleClick}
      //onClickCapture={handleClickCapture}
    >
      {annotations.map((ann) => (
        <AvatarAnnotation
          annotation={ann}
          key={ann.annotationId}
          id={ann.annotationId}
          pageNo={ann.pageNo}
          x={ann.x}
          y={ann.y}
          dragging= {dragging}
          setDragging={setDragging}
        />
      ))}
    </div>
  )
}

export default AnnotationLayer
