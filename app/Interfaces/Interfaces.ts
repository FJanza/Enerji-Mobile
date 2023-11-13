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

export interface Exercise {
  email: string
  muscle: string
  exercise: string
  date: string
  weight: number
  series: number
  repeat: number
  idPlan: number
}
export interface ExercisePlan {
  id: number
  routine: Exercise[]
  startDate: string
  endDate: string
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
