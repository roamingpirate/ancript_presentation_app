'use client'

import React from 'react'
import { useAppSelector } from '@/store/hook'
import AnnotationListView from './AnnotationListView'



const AnnotationList: React.FC = () => {
  const annotations = useAppSelector(s => s.editor.annotations)
  const currentPage = useAppSelector(s => s.editor.currentPage)
  const currentPageAnnotations = annotations.filter(a => a.pageNo === currentPage)
  const annotation = currentPageAnnotations[0]

  if(currentPageAnnotations.length === 0) { return null }

  return (
    <div className=" space-y-3 mb-4 py-4  overflow-y-auto rounded-md border border-gray-200 m-1">
      <p className='text-gray-800 ml-1 font-medium font-worksans px-2 text-[14px] mb-3'>Annotations</p>
      <div className='px-2 space-y-3 min-h-[10vh] max-h-[20vh] overflow-y-auto scrollbar-clean'>
       {
         currentPageAnnotations.map((annotation, ind) => (
          <AnnotationListView key={annotation.annotationId} annotation={annotation} />
         ))
       } 
       </div>
    </div>
  )
}

export default AnnotationList
