// React
import React from "react"

// Navigation
import { createStackNavigator } from "@react-navigation/stack"
import MyRutines from "app/screens/MyRutines"
import { MyExercisesPlanNavigator } from "./MyExercisesPlanNavigator"
import { ROUTES } from "app/utils/routes"

/**
 
Helper for automatically generating navigation prop types for each route.*
More info: https://reactnavigation.org/docs/typescript/#organizing-types
*/

export function RoutinesNavigator() {
  const Stack = createStackNavigator()

  return (
    <>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={ROUTES.MY_ROUTINES}>
        <Stack.Screen name={ROUTES.MY_ROUTINES} component={MyRutines} />
        <Stack.Screen
          name={ROUTES.MY_EXERCISE_PLAN_NAVIGATOR}
          component={MyExercisesPlanNavigator}
        />
      </Stack.Navigator>
    </>
  )
}
