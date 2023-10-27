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
  authToken?: string
  dni: number
  personalInformation: PersonalInformation
  physicalInformation: PhysicalInformation
}

const stateInit: User = {
  authToken: undefined,
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
    setAuthToken(state, action: PayloadAction<string | undefined>) {
      state.authToken = action.payload
    },
    logOut(state) {
      state.authToken = undefined
      state.dni = 0
      state.personalInformation = {
        email: "",
        birthDate: 0,
        name: "",
        lastName: "",
      }
      state.physicalInformation = {
        heigth: 0,
        weigth: 0,
        objective: "",
      }
    },
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
