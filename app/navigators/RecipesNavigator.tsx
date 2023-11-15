// React
import React from "react"

// Navigation
import { createStackNavigator } from "@react-navigation/stack"
import { ROUTES } from "app/utils/routes"
import MyRecipes from "app/screens/MyRecipes"
import { MyRecipesPlanNavigator } from "./MyRecipesPlanNavigator"

/**
 
Helper for automatically generating navigation prop types for each route.*
More info: https://reactnavigation.org/docs/typescript/#organizing-types
*/

export function RecipesNavigator() {
  const Stack = createStackNavigator()

  return (
    <>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={ROUTES.MY_ROUTINES}>
        <Stack.Screen name={ROUTES.MY_RECIPES} component={MyRecipes} />
        <Stack.Screen name={ROUTES.MY_RECIPES_PLANS_NAVIGATOR} component={MyRecipesPlanNavigator} />
      </Stack.Navigator>
    </>
  )
}
