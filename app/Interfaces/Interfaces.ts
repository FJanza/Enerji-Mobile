export interface User {
  name: string
  surname?: string
  lastName: string
  email: string
  birthDate: string
  weight: number
  height: number
  bodyType: string
  dietType: string
  objective: string
}

export interface UserRegistration extends User {
  password: string
}

export interface Routine {}
export interface Exersice {
  id: number
  muscle: string
  day: string
  weight: string
  email: string
  exercise: string
  idPlan: number
  serie: number
  repetitions: number
}
export interface ExercisePlan {
  id: string
  title: string
  routine: Exersice[]
  startDate: Date
  endDate: Date
  duration: number
}

export const TRADUCTIONS = {
  email: "email",
  password: "contraseña",
  birthDate: "fecha de cumpleaños",
  bodyType: "tipo de cuerpo",
  height: "altura",
  lastName: "apellido",
  name: "nombre",
  weight: "peso",
  objective: "objetivo",
  dietType: "tipo de dieta",
}
