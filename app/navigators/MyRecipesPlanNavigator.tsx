// React
import React from "react"

// Navigation
import { createStackNavigator } from "@react-navigation/stack"
import { ROUTES } from "app/utils/routes"
import MyRecipesPlans from "app/screens/Recipes/MyRecipesPlans"
import GeneratorRecipesPlan from "app/screens/Recipes/GeneratorRecipesPlan"

/**
 
Helper for automatically generating navigation prop types for each route.*
More info: https://reactnavigation.org/docs/typescript/#organizing-types
*/

export function MyRecipesPlanNavigator() {
  const Stack = createStackNavigator()

  return (
    <>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={ROUTES.MY_RECIPES_PLANS}
      >
        <Stack.Screen name={ROUTES.MY_RECIPES_PLANS} component={MyRecipesPlans} />
        <Stack.Screen name={ROUTES.GENERATOR_RECIPES_PLAN} component={GeneratorRecipesPlan} />
      </Stack.Navigator>
    </>
  )
}
