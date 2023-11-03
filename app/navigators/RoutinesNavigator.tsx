// React
import React from "react"

// Navigation
import { createStackNavigator } from "@react-navigation/stack"
import MyRutines from "app/screens/MyRutines"
import { MyExercisesPlanNavigator } from "./MyEjercicesPlanNavigator"

/**
 
Helper for automatically generating navigation prop types for each route.*
More info: https://reactnavigation.org/docs/typescript/#organizing-types
*/

export function RoutinesNavigator() {
  const Stack = createStackNavigator()

  return (
    <>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Routines">
        <Stack.Screen name="MyRoutines" component={MyRutines} />
        <Stack.Screen name="MyEjercicesPlanNavigator" component={MyExercisesPlanNavigator} />
      </Stack.Navigator>
    </>
  )
}
