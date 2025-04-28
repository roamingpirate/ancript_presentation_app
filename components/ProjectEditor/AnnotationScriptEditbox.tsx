import { updateAnnotationFieldsServer } from '@/app/actions/updateAnnotationFieldsServer';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { Annotation, updateAnnotationFields } from '@/store/slices/editorSlice';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react'
import StepProgress from '../utils/StepProgress';
import ExplanationInputBox from './ExplanationInputBox';
import { ChevronLast, ChevronLeft } from 'lucide-react';
import ScriptEditBox from './ScriptEditBox';

const AnnotationScriptEditbox = ({annotation}:{annotation: Annotation}) => {

const selectedAnnotationId: string | null = useAppSelector((s) => s.editor.selectedAnnotationId);
  const currentStage = annotation.currentStage;
  const projectId = useAppSelector((s) => s.editor.projectId)
  const dispatch = useAppDispatch();
  const nextStage = () => {
    dispatch(updateAnnotationFields({annotationId: annotation.annotationId, updates: {currentStage: 2}}))
    updateAnnotationFieldsServer({projectId,annotationId: annotation.annotationId,pageNo:annotation.pageNo,updates:{currentStage: 2}})
  }

  return (
    <AnimatePresence>
      {selectedAnnotationId && currentStage === 2 && (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className='fixed  left-[350px] bottom-4 w-[50vw] '
            >
          <div className='flex w-full px-4 py-2 justify-between cursor-pointer'>
            <div className='flex items-center gap-3'>
              <div className='m-1 p-0.5 border-2 border-gray-700 text-gray-700 rounded-full hover:bg-gray-300 hover:border-gray-300 '>
                  <ChevronLeft size={16} strokeWidth={3}/>
              </div>
              <img src="/triangle.svg" alt="triangle" className="w-5 h-5 " />
              <div className='p-1 bg-[#0D59A6]/90 rounded-lg px-3 text-[14px]'>
                <p className='text-gray-50  font-worksans'>Script Review and Edit</p>
              </div>
            </div>
            <StepProgress currentStep={currentStage} />
          </div>
          <ScriptEditBox annotation={annotation}/>
          <div className='flex w-full justify-end pt-3 cursor-pointer'>
            <div onClick={nextStage} className='rounded-lg py-1 px-3 bg-[#0D59A6] text-white font-medium font-worksans'>Next</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default AnnotationScriptEditbox