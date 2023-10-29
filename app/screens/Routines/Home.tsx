import { View, Text, StyleSheet } from "react-native"
import React from "react"
import { Screen } from "app/components"
import { spacing } from "app/theme"

const Home = () => {
  return (
    <Screen preset="scroll" contentContainerStyle={styles.container} safeAreaEdges={["top"]}>
      <Text>Home</Text>
    </Screen>
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
})
