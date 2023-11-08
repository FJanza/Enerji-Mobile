import { PayloadAction, createSlice } from "@reduxjs/toolkit"

type PersonalInformation = {
  email: string
  birthDate: string
  name: string
  surName?: string
  lastName: string
  heigth: number
  weigth: number
  objective: string
  bodyType: string
  dietType: string
}

type User = {
  authToken?: string
  personalInformation: PersonalInformation
}

const stateInit: User = {
  authToken: undefined,
  personalInformation: {
    email: "",
    birthDate: "",
    name: "",
    lastName: "",
    heigth: 0,
    weigth: 0,
    objective: "",
    bodyType: "",
    dietType: "",
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
      state.personalInformation = {
        email: "",
        birthDate: "",
        name: "",
        lastName: "",
        heigth: 0,
        weigth: 0,
        objective: "",
        bodyType: "",
        dietType: "",
      }
    },
    setUser: (state, action: PayloadAction<Partial<User>>) => {
      const newState = {
        ...state,
        personalInformation: {
          ...state.personalInformation,
          ...action.payload.personalInformation,
        },
      }
      return newState
    },
  },
})

export const { setUser, setAuthToken, logOut } = slice.actions

export default slice.reducer
