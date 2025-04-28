// import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// interface Coordinates {
//   x: number
//   y: number
//   scale?: number
//   rotation?: number
// }

// interface AvatarDetails {
//   model: string
//   speech: string
//   audioBlob?: Blob
// }

// interface AnnotationDetail {
//   avatar?: AvatarDetails
//   text?: string
//   audioUrl?: string
// }



// export interface AnnotationState {
//   id: string
//   x: number
//   y: number
//   avatarId: string
//   avatarImgId: string
// }

// const initialState: AnnotationState = {
//   id: '',

//   coordinates: { x: 0, y: 0 },
//   detail: {},
//   createdAt: '',
// }

// const annotationSlice = createSlice({
//   name: 'annotation',
//   initialState,
//   reducers: {
//     loadAnnotation: (state, action: PayloadAction<AnnotationState>) => {
//       return action.payload
//     },
//     updateCoordinates: (state, action: PayloadAction<Coordinates>) => {
//       state.coordinates = { ...state.coordinates, ...action.payload }
//     },
//     updateAvatarDetails: (state, action: PayloadAction<AvatarDetails>) => {
//       state.detail.avatar = action.payload
//     },
//     updateText: (state, action: PayloadAction<string>) => {
//       state.detail.text = action.payload
//     },
//   },
// })

// export const {
//   loadAnnotation,
//   updateCoordinates,
//   updateAvatarDetails,
//   updateText,
// } = annotationSlice.actions

// export default annotationSlice.reducer
