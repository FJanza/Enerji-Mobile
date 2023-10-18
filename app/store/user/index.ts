import { PayloadAction, createSlice } from "@reduxjs/toolkit"

type PersonalInformation = {
  email: string
  birthDate: number
  name: string
  surName?: string
  lastName: string
}

type PhysicalInformation = {
  heigth: number
  weigth: number
  objective: string
}

type User = {
  dni: number
  personalInformation: PersonalInformation
  physicalInformation: PhysicalInformation
}

const stateInit: User = {
  dni: 0,
  personalInformation: {
    email: "",
    birthDate: 0,
    name: "",
    lastName: "",
  },
  physicalInformation: {
    heigth: 0,
    weigth: 0,
    objective: "",
  },
}

const slice = createSlice({
  name: "user",
  initialState: stateInit,
  reducers: {
    setUser: (state, action: PayloadAction<Partial<User>>) => {
      const newState = {
        ...state,
        dni: action.payload.dni,
        personalInformation: {
          ...state.personalInformation,
          ...action.payload.personalInformation,
        },
        physicalInformation: {
          ...state.physicalInformation,
          ...action.payload.physicalInformation,
        },
      }
      return newState
    },
  },
})

export const { setUser } = slice.actions

export default slice.reducer
