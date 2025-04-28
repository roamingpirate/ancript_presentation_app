'use client'

import { useAppDispatch, useAppSelector } from '@/store/hook'
import {
  deleteAnnotation,
  setAnnotationToDeleteId,
  setShowDeleteAnnotationModal,
} from '@/store/slices/editorSlice'
import deleteAnnotationServer from '@/app/actions/deleteAnnotation'

const AnnotationDeleteModal = () => {
  const dispatch = useAppDispatch()
  const show = useAppSelector((state) => state.editor.showDeleteAnnotationModal)
  const annotationId = useAppSelector((state) => state.editor.annotationToDeleteId)
  const projectId = useAppSelector((state) => state.editor.projectId)
  const currentPage = useAppSelector((state) => state.editor.currentPage)

  if (!show || !annotationId || !projectId ) return null

  const handleCancel = () => {
    dispatch(setShowDeleteAnnotationModal(false))
    dispatch(setAnnotationToDeleteId(null))
  }

  const handleConfirm = async () => {
    dispatch(deleteAnnotation(annotationId))
    await deleteAnnotationServer({projectId,pageNo: currentPage,annotationNumber:annotationId})
  }

  return (
    <div className='fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-[9999] font-worksans'>
      <div className='flex-col justify-center items-center bg-white p-6 rounded-md shadow-md w-[600px] max-w-sm'>
        <h2 className='text-lg font-semibold mb-4 text-gray-800'>Delete Annotation</h2>
        <p className='text-sm text-gray-600 mb-2'>
          Are you sure you want to delete <span className='font-medium text-red-500'>Annotation_{annotationId}</span>?
        </p>
        <div className='flex justify-end gap-2 mt-10 '>
          <button
            className='px-4 py-2 text-sm border border-gray-500 bg-white text-gray-600 hover:bg-gray-200 rounded'
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            className='px-4 border border-white py-2 text-sm bg-red-500 text-white hover:bg-red-600 rounded'
            onClick={handleConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default AnnotationDeleteModal
