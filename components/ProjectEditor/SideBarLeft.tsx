'use client'

import { useAppDispatch, useAppSelector } from '@/store/hook'
import { setCurrentPage } from '@/store/slices/editorSlice'
import React, { useState } from 'react'
import { Document, Page } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

type SideBarLeftProps = {
  pdfUrl: string | null | undefined;
}

const SideBarLeft = ({ pdfUrl }: SideBarLeftProps) => {
  const [numPages, setNumPages] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const dispatch = useAppDispatch()
  const currentPageNumber = useAppSelector(state => state.editor.currentPage)

  if (!pdfUrl) return null

  const onLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
    setIsLoading(false)
  }

  const onLoadError = (error: any) => {
    console.error('Error while loading PDF:', error)
    setIsLoading(false)
  }

  return (
    <div className='rounded-xl pt-4 bg-white h-[84%] w-[180px] flex flex-col items-center mx-2 fixed top-[90px] left-0 bottom-20 overflow-y-scroll scrollbar-clean'>
      
      {isLoading && (
        <div className="py-4 flex justify-center">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <Document file={pdfUrl} onLoadSuccess={onLoadSuccess} onLoadError={onLoadError}>
        {numPages && Array.from(new Array(numPages), (_, index) => {
          const pageNumber = index + 1
          const isSelected = pageNumber === currentPageNumber

          return (
            <div
              key={index}
              onClick={() => dispatch(setCurrentPage(pageNumber))}
              className={`mb-2 flex items-center group cursor-pointer transition-all duration-150 ${
                isSelected ? 'scale-105' : ''
              }`}
            >
              <div className='flex gap-1'>
                <span className="text-xs w-4 text-gray-500 mr-1 text-right">{pageNumber}</span>

                <div
                  className={`p-1 rounded overflow-hidden border-2 ${
                    isSelected ? 'border-blue-500' : 'border-gray-300'
                  }`}
                >
                  <Page
                    pageNumber={pageNumber}
                    width={120}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </Document>
    </div>
  )
}

export default SideBarLeft
