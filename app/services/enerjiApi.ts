interface GenerateExercisePlanProps {
  age: number
  cantDay: number
  excerciseType: string
  bodyType: string
}
interface GenerateRecipePlanProps {
  age: number
  dietType: string
  excerciseType: string
  bodyType: string
}

export const generateExercisePlan = async ({
  age,
  cantDay,
  excerciseType,
  bodyType,
}: GenerateExercisePlanProps) => {
  try {
    const response = await fetch("http://10.0.2.2:8080/api/createRoutine", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        age,
        cantDay,
        excerciseType,
        bodyType,
      }),
    })

    const result = await response.json()

    if (!result.error) {
      const parseResult = Object.entries(result.results).map((pd) => JSON.parse(String(pd[1])))
      return parseResult
    } else {
      return undefined
    }
  } catch (e) {
    console.log(e)
    return undefined
  }
}

export const generateRecipePlan = async ({
  age,
  dietType,
  excerciseType,
  bodyType,
}: GenerateRecipePlanProps) => {
  try {
    const response = await fetch("http://10.0.2.2:8080/api/createDiet", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        age,
        bodyType,
        excerciseType,
        dietType,
      }),
    })

    const result = await response.json()

    if (!result.error) {
      const parseResult = Object.entries(result.results).map((pd) => JSON.parse(String(pd[1])))
      return parseResult
    } else {
      return undefined
    }
  } catch (e) {
    console.log(e)
    return undefined
  }
}
