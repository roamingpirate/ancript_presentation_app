import React from 'react'
import AnnotationLayer from './AnnotationLayer'
import AnnotationList from './AnnotationsList'
import AnnotationEditBox from './AnnotationEditBox'

const SideBarRight = () => {
  return (
    <div className='rounded-xl pt-4 bg-white h-[84%] w-[200px] mx-2 fixed top-[90px] right-0 bottom-20'>
      <AnnotationList/>
      <AnnotationEditBox/>
    </div>
  )
}

export default SideBarRight