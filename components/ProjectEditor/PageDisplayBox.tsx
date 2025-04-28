'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Document, Page } from 'react-pdf'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'
import AnnotationLayer from './AnnotationLayer'
import { useAppSelector } from '@/store/hook'
import AvatarDisplayBox from './AvatarDisplayBox'

type Props = {
  documentUrl: string | null | undefined
}

const PageDisplayBox = ({ documentUrl }: Props) => {
  const baseWidth = 1000
  const pageRef = useRef<HTMLDivElement>(null)
  const [pageHeight, setPageHeight] = useState<number | null>(null)

  const currentPageNumber = useAppSelector(state => state.editor.currentPage)
  const editorMode = useAppSelector(state => state.editor.editorMode)
  const selectedAnnotationId = useAppSelector(state => state.editor.selectedAnnotationId)

  useEffect(() => {
    const updateSize = () => {
      if (pageRef.current) {
        setPageHeight(pageRef.current.clientHeight)
      }
    }

    updateSize()
    window.addEventListener('resize', updateSize)
    return () => {
      window.removeEventListener('resize', updateSize)
    }
  }, [currentPageNumber])

  if (!documentUrl) return null

  // Determine cursor style
  const cursorStyle =
    editorMode === 'avatarAdd'
      ? 'cursor-crosshair'
      : editorMode === 'moveZoom'
      ? 'cursor-grab'
      : 'cursor-default'

  // Width and alignment
  const wrapperWidth = selectedAnnotationId ? 'w-[40vw]' : 'w-[60vw]'
  const wrapperHeight = selectedAnnotationId ? 'h-[calc(100vh-400px)]' : 'h-[calc(100vh-240px)]'
  const alignment = 'left-[210px]'
  const topPosition = selectedAnnotationId ? 'top-[120px]':'top-[90px]'

  return (
    <div className={`fixed ${topPosition} ${alignment} flex ${wrapperHeight}`}>
      {/* PDF Display Area */}
      <div
        className={`transition-all duration-500 ease-in-out overflow-auto rounded-2xl  touch-none ${wrapperWidth} ${cursorStyle}`}
      >
        <TransformWrapper
          minScale={0.5}
          maxScale={3}
          initialScale={1}
          wheel={{ step: 0.1 }}
          doubleClick={{ disabled: true }}
          pinch={{ step: 8 }}
          panning={{ velocityDisabled: true }}
        >
          <TransformComponent wrapperStyle={{ width: '100%', height: '100%' }}>
            <div style={{ width: baseWidth, position: 'relative'}}>
              <div ref={pageRef}>
                <Document file={documentUrl}>
                  <Page
                    pageNumber={currentPageNumber}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    width={baseWidth}
                  />
                  <AnnotationLayer />
                </Document>
              </div>
            </div>
          </TransformComponent>
        </TransformWrapper>
      </div>

      {/* Avatar Panel (optional) */}
      <div
        className={`transition-opacity duration-500 ease-in-out ${
          selectedAnnotationId ? 'opacity-100' : 'opacity-0 pointer-events-none'
        } flex items-center justify-center h-full px-5 p-10`}
      >
        {selectedAnnotationId && <AvatarDisplayBox />}
      </div>
    </div>
  )
}

export default PageDisplayBox
