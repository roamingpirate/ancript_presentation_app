import { AnnotationExplanationDetails } from '@/types/types'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type EditorMode = 'idle' | 'moveZoom' | 'avatarAdd' | 'annotationEdit'
export type AvatarStage = 'idle' | 'recording' | 'editing' | 'done'


export interface Annotation {
    annotationId: string
    pageNo: number
    x: number
    y: number
    avatarId: string
    avatarImgId: string
    createdAt: string
    scale?: number
    rotation?: number
    currentStage : number
    explanationText : string
    script: string | null
}

interface EditorState {
  projectName: string
  projectId: string | null
  pdfFile: File | null
  totalPages: number
  currentPage: number
  annotations: Annotation[]
  selectedAnnotationId: string | null
  editorMode: EditorMode
  isEditMode: boolean
  annotationsLocked: boolean
  avatarCreationStage: AvatarStage
  isLoadingPdf: boolean
  isSaving: boolean
  isProcessingAvatar: boolean
  error: string | null
  successMessage: string | null
  undoStack: any[]
  redoStack: any[],
  showDeleteAnnotationModal: boolean,
  annotationToDeleteId: string | null,
}

const initialState: EditorState = {
  projectName: '',
  projectId: null,
  pdfFile: null,
  totalPages: 0,
  currentPage: 1,
  annotations: [],
  selectedAnnotationId: null,
  editorMode: 'idle',
  isEditMode: false,
  annotationsLocked: false,
  avatarCreationStage: 'idle',
  isLoadingPdf: false,
  isSaving: false,
  isProcessingAvatar: false,
  error: null,
  successMessage: null,
  undoStack: [],
  redoStack: [],
  showDeleteAnnotationModal: false,
  annotationToDeleteId: null as string | null,
}

const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    setProjectName: (state, action: PayloadAction<string>) => {
      state.projectName = action.payload
    },
    setProjectId: (state, action: PayloadAction<string>) => {
      state.projectId = action.payload
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload
      state.selectedAnnotationId = null // Reset selected annotation when changing pages
    },
    setAnnotations: (state, action: PayloadAction<Annotation[]>) => {
      state.annotations = action.payload
    },
    addAnnotation: (state, action: PayloadAction<Annotation>) => {
      state.annotations.push(action.payload)
    },
    updateAnnotation: (state, action: PayloadAction<Annotation>) => {
      const index = state.annotations.findIndex(a => a.annotationId === action.payload.annotationId)
      if (index !== -1) {
        state.annotations[index] = action.payload
      }
    },
    updateAnnotationPosition: (
        state,
        action: PayloadAction<{
          id: string
          x?: number
          y?: number
          scale?: number
          rotation?: number
        }>
      ) => {
        const { id, x, y, scale, rotation } = action.payload
        const annotation = state.annotations.find(a => a.annotationId === id)
        if (annotation) {
          if (typeof x === 'number') annotation.x = x
          if (typeof y === 'number') annotation.y = y
          // @ts-ignore - optional props may not exist on the type yet
          if (typeof scale === 'number') annotation.scale = scale
          if (typeof rotation === 'number') annotation.rotation = rotation
        }
      },
      updateAnnotationExplanationText: (
        state,
        action: PayloadAction<{ annotationId: string; explanationText: string }>
      ) => {
        const { annotationId, explanationText } = action.payload;
        const annotation = state.annotations.find(a => a.annotationId === annotationId);
        if (annotation) {
          annotation.explanationText = explanationText;
        }
      }, 
      updateAnnotationFields: (
        state,
        action: PayloadAction<{
          annotationId: string;
          updates: Partial<Annotation>;
        }>
      ) => {
        const { annotationId, updates } = action.payload;
        const annotation = state.annotations.find(a => a.annotationId === annotationId);
        if (annotation) {
          Object.assign(annotation, updates);
        }
      },           
      setShowDeleteAnnotationModal: (state, action) => {
        state.showDeleteAnnotationModal = action.payload
      },
      setAnnotationToDeleteId: (state, action) => {
        state.annotationToDeleteId = action.payload
      },
      deleteAnnotation: (state, action) => {
        state.annotations = state.annotations.filter(
          (a) => a.annotationId !== action.payload
        )
        if (state.annotationToDeleteId === action.payload) {
          state.annotationToDeleteId = null
          state.showDeleteAnnotationModal = false
        }
      },
    selectAnnotation: (state, action: PayloadAction<string | null>) => {
      state.selectedAnnotationId = action.payload
    },
    setEditorMode: (state, action: PayloadAction<EditorMode>) => {
      state.editorMode = action.payload
    },
    setIsEditMode: (state, action: PayloadAction<boolean>) => {
      state.isEditMode = action.payload
    },
    setAnnotationsLocked: (state, action: PayloadAction<boolean>) => {
      state.annotationsLocked = action.payload
    },
    setAvatarCreationStage: (state, action: PayloadAction<AvatarStage>) => {
      state.avatarCreationStage = action.payload
    },
    setIsLoadingPdf: (state, action: PayloadAction<boolean>) => {
      state.isLoadingPdf = action.payload
    },
    setIsSaving: (state, action: PayloadAction<boolean>) => {
      state.isSaving = action.payload
    },
    setIsProcessingAvatar: (state, action: PayloadAction<boolean>) => {
      state.isProcessingAvatar = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    setSuccessMessage: (state, action: PayloadAction<string | null>) => {
      state.successMessage = action.payload
    },
    setUndoStack: (state, action: PayloadAction<any[]>) => {
      state.undoStack = action.payload
    },
    setRedoStack: (state, action: PayloadAction<any[]>) => {
      state.redoStack = action.payload
    },
  },
})

export const {
  setProjectName,
  setProjectId,
  setCurrentPage,
  setAnnotations,
  addAnnotation,
  updateAnnotation,
  updateAnnotationPosition,
  updateAnnotationExplanationText,
  updateAnnotationFields,
  setShowDeleteAnnotationModal,
  setAnnotationToDeleteId,
  deleteAnnotation,
  selectAnnotation,
  setEditorMode,
  setIsEditMode,
  setAnnotationsLocked,
  setAvatarCreationStage,
  setIsLoadingPdf,
  setIsSaving,
  setIsProcessingAvatar,
  setError,
  setSuccessMessage,
  setUndoStack,
  setRedoStack,

} = editorSlice.actions

export default editorSlice.reducer
