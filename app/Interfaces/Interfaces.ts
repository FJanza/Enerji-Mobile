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

export interface Recipe {
  email: string
  food: string
  cal: string
  protein: string
  recipe: string
  ingredients: string[]
  done: boolean
  date: string
  idPlan: string
  dayMoment: string
}
export interface RecipePlan {
  id: number
  email?: string
  recipes: Recipe[]
  startDate: string
  endDate: string
  duration: number
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
  email?: string
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
