// React
import React from "react"

// Navigation
import { createStackNavigator } from "@react-navigation/stack"
import MyEjercicesPlans from "app/screens/Routines/MyEjercicesPlans"
import GeneratorEjercicePlan from "app/screens/Routines/GeneratorEjercicePlan"

/**
 
Helper for automatically generating navigation prop types for each route.*
More info: https://reactnavigation.org/docs/typescript/#organizing-types
*/

export function MyEjercicesPlanNavigator() {
  const Stack = createStackNavigator()

  return (
    <>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="EjercicePlan">
        <Stack.Screen name="myEjercicesPlans" component={MyEjercicesPlans} />
        <Stack.Screen name="GeneratorEjercicePlan" component={GeneratorEjercicePlan} />
      </Stack.Navigator>
    </>
  )
}
