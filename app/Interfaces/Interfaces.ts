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
  sex: "Masculino" | "Femenino"
}

export interface UserRegistration extends User {
  password: string
}

export interface Routine {}
export interface Exercise {
  id: number
  muscle: string
  day: string
  weight: number
  email: string
  exercise: string
  idPlan: number
  serie: number
  repetitions: number
}
export interface ExercisePlan {
  id: string
  title?: string
  routine: Exercise[]
  startDate: Date
  endDate: Date
  duration: number
}

export const TRADUCTIONS = {
  email: "email",
  password: "contraseña",
  birthDate: "fecha de nacimiento",
  bodyType: "tipo de cuerpo",
  height: "altura",
  lastName: "apellido",
  name: "nombre",
  weight: "peso",
  objective: "objetivo",
  dietType: "tipo de dieta",
  sex: "sexo",
}
