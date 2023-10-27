export interface User {
  name: string
  lastName: string
  email: string
  password: string
  birthDate: string
  weight: string
  height: string
  bodyType: BodyType
  dietType: string
}

interface BodyType {
  type: "Ectomorfo" | "Endomorfo" | "Mesomorfo"
}

// name: undefined
// lastName: undefined
// email: undefined
// password: undefined
// birthDate: undefined
// weight: undefined
// height: undefined
// bodyType: undefined
// dietType: undefined
