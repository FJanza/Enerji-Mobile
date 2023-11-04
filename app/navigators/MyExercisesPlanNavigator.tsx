// React
import React from "react"

// Navigation
import { createStackNavigator } from "@react-navigation/stack"
import MyExercisesPlans from "app/screens/Routines/MyExercisesPlans"
import GeneratorExercisePlan from "app/screens/Routines/GeneratorExercisePlan"
import { ROUTES } from "app/utils/routes"

/**
 
Helper for automatically generating navigation prop types for each route.*
More info: https://reactnavigation.org/docs/typescript/#organizing-types
*/

export function MyExercisesPlanNavigator() {
  const Stack = createStackNavigator()

  return (
    <>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={ROUTES.MY_EXERCISES_PLANS}
      >
        <Stack.Screen name={ROUTES.MY_EXERCISES_PLANS} component={MyExercisesPlans} />
        <Stack.Screen name={ROUTES.GENERATOR_EXERCISE_PLAN} component={GeneratorExercisePlan} />
      </Stack.Navigator>
    </>
  )
}
