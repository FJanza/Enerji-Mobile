import { StyleSheet, View } from "react-native"
import React from "react"
import { Button, Card, Screen, Text } from "app/components"
import { navigate } from "app/navigators"
import { colors, spacing } from "app/theme"
import { layout } from "app/theme/global"

import PlanExerciseDisplay from "../../components/PlanExerciseDisplay"
import { useSelector } from "react-redux"
import { RootState } from "app/store"
import { ROUTES } from "app/utils/routes"

const MyExercisesPlans = () => {
  const { exercisePlans } = useSelector((state: RootState) => state.user)

  return (
    <Screen
      preset="scroll"
      contentContainerStyle={styles.container}
      safeAreaEdges={["top"]}
      statusBarStyle="light"
    >
      <View style={{ gap: spacing.md }}>
        <View style={layout.rowBetween}>
          <Button
            onPress={() => {
              navigate(ROUTES.MY_ROUTINES)
            }}
            text="Mis rutinas"
            preset="reversed"
          />
          <Button
            onPress={() => {
              navigate(ROUTES.GENERATOR_EXERCISE_PLAN)
            }}
            text="Generador de planes"
            preset="reversed"
          />
        </View>
        <Card
          style={styles.headerCard}
          HeadingComponent={
            <Text
              text="Mis Planes"
              preset="bold"
              size="xl"
              style={{ backgroundColor: colors.palette.primary600, paddingHorizontal: spacing.xs }}
            />
          }
          ContentComponent={
            <View style={{ padding: spacing.xxs, gap: spacing.sm }}>
              {exercisePlans.length > 0 ? (
                exercisePlans.map((p, i) => {
                  return <PlanExerciseDisplay plan={p} key={`${p.id}+${i}`} />
                })
              ) : (
                <Text
                  text="No tienes planes todavia, prueba generando uno!"
                  preset="invertDefault"
                  style={{ padding: spacing.xs }}
                />
              )}
            </View>
          }
        />
      </View>
    </Screen>
  )
}

export default MyExercisesPlans

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  headerCard: { borderWidth: 0, overflow: "hidden", padding: 0 },
})
