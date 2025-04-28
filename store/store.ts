import { configureStore } from '@reduxjs/toolkit'
import editorReducer from './slices/editorSlice'
import annotationReducer from './slices/annotationsSlice'

export const store = configureStore({
  reducer: {
    editor: editorReducer,
    annotation: annotationReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
