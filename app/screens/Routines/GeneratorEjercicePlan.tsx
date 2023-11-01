import { Text, StyleSheet } from "react-native"
import React from "react"
import { Button, Screen } from "app/components"
import { spacing } from "app/theme"
import { navigate } from "app/navigators"

const GeneratorEjercicePlan = () => {
  return (
    <Screen preset="scroll" contentContainerStyle={styles.container} safeAreaEdges={["top"]}>
      <Text>GeneratorEjercicePlan</Text>
      <Button
        onPress={() => {
          navigate("myEjercicesPlans")
        }}
        text="Mis planes"
      />
    </Screen>
  )
}

export default GeneratorEjercicePlan

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
})
