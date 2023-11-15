import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { Exercise, ExercisePlan } from "app/Interfaces/Interfaces"

type PersonalInformation = {
  email: string
  birthDate: string
  name: string
  surName?: string
  lastName: string
  height: number
  weight: number
  bodyType: string
  dietType: string
}

type User = {
  authToken?: string
  personalInformation: PersonalInformation
  exercisePlans: ExercisePlan[]
  exercises: Exercise[]
}

const stateInit: User = {
  authToken: undefined,
  personalInformation: {
    email: "",
    birthDate: "",
    name: "",
    lastName: "",
    height: 0,
    weight: 0,
    bodyType: "",
    dietType: "",
  },
  exercisePlans: [],
  exercises: [],
}

const slice = createSlice({
  name: "user",
  initialState: stateInit,
  reducers: {
    setAuthToken(state, action: PayloadAction<string | undefined>) {
      state.authToken = action.payload
    },
    logOut(state) {
      state.authToken = undefined
      state.personalInformation = {
        email: "",
        birthDate: "",
        name: "",
        lastName: "",
        height: 0,
        weight: 0,
        bodyType: "",
        dietType: "",
      }
      state.exercisePlans = []
      state.exercises = []
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      const newState = {
        ...state,
        personalInformation: {
          ...state.personalInformation,
          ...action.payload.personalInformation,
        },
      }
      return newState
    },
    setUser: (state, action: PayloadAction<Partial<User>>) => {
      const newState = {
        ...state,
        personalInformation: {
          ...action.payload.personalInformation,
        },
      }
      return newState
    },
    setExersices: (state, action: PayloadAction<Exercise[]>) => {
      state.exercises = action.payload
    },
    appendExersices: (state, action: PayloadAction<Exercise[]>) => {
      const newState = {
        ...state,
        exercises: [...state.exercises, ...action.payload],
      }

      return newState
    },
    setExersicePlans: (state, action: PayloadAction<ExercisePlan[]>) => {
      state.exercisePlans = action.payload
    },
    appendExersicePlan: (state, action: PayloadAction<ExercisePlan>) => {
      const newState = {
        ...state,
        exercisePlans: [...state.exercisePlans, action.payload],
      }

      return newState
    },
  },
})

export const {
  updateUser,
  setUser,
  setAuthToken,
  logOut,
  setExersices,
  appendExersices,
  setExersicePlans,
  appendExersicePlan,
} = slice.actions

export default slice.reducer
