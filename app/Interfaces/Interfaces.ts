export interface User {
  name: string
  lastName: string
  email: string
  password: string
  birthDate: string
  weight: string
  height: string
  bodyType: string
  dietType: string
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
