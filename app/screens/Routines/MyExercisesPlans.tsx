import { StyleSheet, View } from "react-native"
import React from "react"
import { Button, Card, Screen, Text } from "app/components"
import { navigate } from "app/navigators"
import { colors, spacing } from "app/theme"
import { layout } from "app/theme/global"
import moment from "moment"
import { ExercisePlan } from "app/Interfaces/Interfaces"
import PlanDisplay from "./PlanDisplay"

export const planDummys: ExercisePlan[] = [
  {
    duration: 2,
    id: "103",
    title: "titulo1",
    startDate: moment("30/04/2023", "DD/MM/yyyy").toDate(),
    endDate: moment("30/06/2023", "DD/MM/yyyy").toDate(),
    routine: [
      {
        id: 1,
        muscle: "Chest",
        day: "Monday",
        weight: "100",
        email: "user1@example.com",
        exercise: "Bench Press",
        idPlan: 103,
        serie: 3,
        repetitions: 10,
      },
      {
        id: 2,
        muscle: "Back",
        day: "Tuesday",
        weight: "80",
        email: "user2@example.com",
        exercise: "Deadlift",
        idPlan: 103,
        serie: 4,
        repetitions: 8,
      },
      {
        id: 3,
        muscle: "Legs",
        day: "Wednesday",
        weight: "120",
        email: "user3@example.com",
        exercise: "Squats",
        idPlan: 103,
        serie: 3,
        repetitions: 12,
      },
      {
        id: 4,
        muscle: "Legs",
        day: "Wednesday",
        weight: "120",
        email: "user3@example.com",
        exercise: "Squats",
        idPlan: 103,
        serie: 3,
        repetitions: 12,
      },
    ],
  },
  {
    duration: 3,
    id: "103",
    title: "titulo1",
    startDate: moment("30/01/2023", "DD/MM/yyyy").toDate(),
    endDate: moment("30/03/2023", "DD/MM/yyyy").toDate(),
    routine: [
      {
        id: 1,
        muscle: "Chest",
        day: "Monday",
        weight: "100",
        email: "user1@example.com",
        exercise: "Bench Press",
        idPlan: 103,
        serie: 3,
        repetitions: 10,
      },
      {
        id: 2,
        muscle: "Back",
        day: "Tuesday",
        weight: "80",
        email: "user2@example.com",
        exercise: "Deadlift",
        idPlan: 103,
        serie: 4,
        repetitions: 8,
      },
      {
        id: 3,
        muscle: "Legs",
        day: "Wednesday",
        weight: "120",
        email: "user3@example.com",
        exercise: "Squats",
        idPlan: 103,
        serie: 3,
        repetitions: 12,
      },
      {
        id: 4,
        muscle: "Legs",
        day: "Wednesday",
        weight: "120",
        email: "user3@example.com",
        exercise: "Squats",
        idPlan: 103,
        serie: 3,
        repetitions: 12,
      },
    ],
  },
  {
    duration: 2,
    id: "103",
    title: "titulo1",
    startDate: moment("30/10/2023", "DD/MM/yyyy").toDate(),
    endDate: moment("30/12/2023", "DD/MM/yyyy").toDate(),
    routine: [
      {
        id: 1,
        muscle: "Chest",
        day: "Monday",
        weight: "100",
        email: "user1@example.com",
        exercise: "Bench Press",
        idPlan: 103,
        serie: 3,
        repetitions: 10,
      },
      {
        id: 2,
        muscle: "Back",
        day: "Tuesday",
        weight: "80",
        email: "user2@example.com",
        exercise: "Deadlift",
        idPlan: 103,
        serie: 4,
        repetitions: 8,
      },
      {
        id: 3,
        muscle: "Legs",
        day: "Wednesday",
        weight: "120",
        email: "user3@example.com",
        exercise: "Squats",
        idPlan: 103,
        serie: 3,
        repetitions: 12,
      },
      {
        id: 4,
        muscle: "Legs",
        day: "Wednesday",
        weight: "120",
        email: "user3@example.com",
        exercise: "Squats",
        idPlan: 103,
        serie: 3,
        repetitions: 12,
      },
    ],
  },
]

const MyExercisesPlans = () => {
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
              navigate("MyRoutines")
            }}
            text="Mis rutinas"
          />
          <Button
            onPress={() => {
              navigate("GeneratorExercisePlan")
            }}
            text="Generador de planes"
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
              {planDummys.map((p, i) => {
                return <PlanDisplay plan={p} key={`${p.title}+${i}`} />
              })}
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
