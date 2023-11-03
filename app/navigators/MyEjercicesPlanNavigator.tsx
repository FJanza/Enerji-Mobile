// React
import React from "react"

// Navigation
import { createStackNavigator } from "@react-navigation/stack"
import MyExercisesPlans from "app/screens/Routines/MyExercisesPlans"
import GeneratorExercisePlan from "app/screens/Routines/GeneratorExercisePlan"

/**
 
Helper for automatically generating navigation prop types for each route.*
More info: https://reactnavigation.org/docs/typescript/#organizing-types
*/

export function MyExercisesPlanNavigator() {
  const Stack = createStackNavigator()

  return (
    <>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="ExercisePlan">
        <Stack.Screen name="myExercisesPlans" component={MyExercisesPlans} />
        <Stack.Screen name="GeneratorExercisePlan" component={GeneratorExercisePlan} />
      </Stack.Navigator>
    </>
  )
}
