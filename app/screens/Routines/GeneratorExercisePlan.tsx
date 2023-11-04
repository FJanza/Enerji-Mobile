import { StyleSheet } from "react-native"
import React from "react"
import { Button, Screen, Text } from "app/components"
import { spacing } from "app/theme"
import { navigate } from "app/navigators"
import { ROUTES } from "app/utils/routes"

const GeneratorExercisePlan = () => {
  return (
    <Screen preset="scroll" contentContainerStyle={styles.container} safeAreaEdges={["top"]}>
      <Text>GeneratorEjercicePlan</Text>
      <Button
        onPress={() => {
          navigate(ROUTES.MY_EXERCISES_PLANS)
        }}
        text="Guardar Plan"
      />
    </Screen>
  )
}

export default GeneratorExercisePlan

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
})
