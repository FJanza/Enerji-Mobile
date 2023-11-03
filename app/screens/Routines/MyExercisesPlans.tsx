import { StyleSheet } from "react-native"
import React from "react"
import { Button, Screen, Text } from "app/components"
import { navigate } from "app/navigators"
import { spacing } from "app/theme"

const MyExercisesPlans = () => {
  return (
    <Screen preset="scroll" contentContainerStyle={styles.container} safeAreaEdges={["top"]}>
      <Text>MyEjercicesPlans</Text>
      <Button
        onPress={() => {
          navigate("GeneratorExercisePlan")
        }}
        text="Generador de planes"
      />
      <Button
        onPress={() => {
          navigate("MyRoutines")
        }}
        text="Mis rutinas"
      />
    </Screen>
  )
}

export default MyExercisesPlans

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
})
