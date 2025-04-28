import { Triangle } from 'lucide-react'
import React from 'react'
import StepProgress from '../utils/StepProgress'
import ExplanationInputBox from './ExplanationInputBox'
import { useAppDispatch, useAppSelector } from '@/store/hook'
import { motion, AnimatePresence } from 'framer-motion'
import { Annotation, updateAnnotation, updateAnnotationFields } from '@/store/slices/editorSlice'
import { updateAnnotationFieldsServer } from '@/app/actions/updateAnnotationFieldsServer'


const AddExplanationBox:React.FC<{annotation: Annotation}> = ({annotation}) => {

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
      {selectedAnnotationId && currentStage === 1 && (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className='fixed  left-[350px] bottom-4 w-[50vw] '
            >
          <div className='flex w-full px-4 py-2 justify-between cursor-pointer'>
            <div className='flex items-center gap-3'>
              <img src="/triangle.svg" alt="triangle" className="w-5 h-5 rotate-90" />
              <div className='p-1 bg-[#0D59A6]/90 rounded-lg px-3 text-[14px]'>
                <p className='text-gray-50  font-worksans'>Explain what your avatar needs to say</p>
              </div>
            </div>
            <StepProgress currentStep={currentStage} />
          </div>
          <ExplanationInputBox annotation={annotation}/>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default AddExplanationBox
