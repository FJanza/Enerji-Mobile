import { Pressable, StyleSheet, View } from "react-native"
import React, { useState } from "react"
import { Button, Card, Screen, Text } from "app/components"
import { navigate } from "app/navigators"
import { colors, spacing } from "app/theme"
import { layout } from "app/theme/global"
import moment from "moment"
import { ExercisePlan } from "app/Interfaces/Interfaces"
import DatePicker from "react-native-date-picker"
import Collapsible from "react-native-collapsible"

const dayToNumber: Record<string, number> = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
}

const planDummys: ExercisePlan[] = [
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

interface PlanDisplayProps {
  plan: ExercisePlan
}

const PlanDisplay = ({ plan }: PlanDisplayProps) => {
  const [openStart, setOpenStart] = useState(false)
  const [showMore, setShowMore] = useState(false)
  const [openEnd, setOpenEnd] = useState(false)
  const [startDate, setStartDate] = useState<Date>(plan.startDate)
  const [endDate, setEndDate] = useState<Date>(plan.endDate)

  const routinesSorted = plan.routine.sort((a, b) => dayToNumber[a.day] - dayToNumber[b.day])

  return (
    <View
      style={[
        styles.planContainer,
        moment(new Date()).isBetween(startDate, endDate) ? styles.planContainerToDay : null,
      ]}
    >
      <View style={[layout.rowBetween, { padding: spacing.xs }]}>
        <View style={styles.infoPrincipal}>
          <Text text={`${plan.title}`} preset="invertDefault" />
          {/* StartDate */}
          <View style={styles.dateTitle}>
            <Text text={`Desde: `} preset="invertDefault" />
            <Pressable
              onPress={() => {
                setOpenStart(true)
              }}
            >
              <Text
                text={`${moment(startDate).format("DD/MM/yyyy")}`}
                preset="invertDefault"
                style={{
                  backgroundColor: colors.palette.primary300,
                  padding: spacing.xxs,
                  borderRadius: spacing.xs,
                }}
              />
            </Pressable>
            <DatePicker
              title="Select start date"
              modal
              open={openStart}
              date={startDate}
              onConfirm={(date) => {
                setStartDate(date)
                setEndDate(moment(date).add(plan.duration, "months").toDate())
                setOpenStart(false)
              }}
              onCancel={() => {
                setOpenStart(false)
              }}
              mode="date"
            />
          </View>
          {/* EndDate */}
          <View style={styles.dateTitle}>
            <Text text={`Hasta: `} preset="invertDefault" />
            <Pressable
              onPress={() => {
                setOpenEnd(true)
              }}
            >
              <Text
                text={`${moment(endDate).format("DD/MM/yyyy")}`}
                preset="invertDefault"
                style={{
                  backgroundColor: colors.palette.primary300,
                  padding: spacing.xxs,
                  borderRadius: spacing.xs,
                }}
              />
            </Pressable>
            <DatePicker
              title="Select end date"
              modal
              open={openEnd}
              date={endDate}
              onConfirm={(date) => {
                setEndDate(date)
                setStartDate(moment(date).subtract(plan.duration, "months").toDate())
                setOpenEnd(false)
              }}
              onCancel={() => {
                setOpenEnd(false)
              }}
              mode="date"
            />
          </View>
        </View>
        <View style={styles.botones}>
          <Button text="Borrar" preset="smallDefault" />
          <Button
            text={showMore ? "Ver menos" : "Ver mas"}
            onPress={() => {
              setShowMore((prev) => !prev)
            }}
            preset="smallDefault"
          />
        </View>
      </View>
      <Collapsible collapsed={!showMore}>
        {routinesSorted.map((r, i) => {
          return (
            <View key={i}>
              {/* REVISAR CUANDO USEMOS LA API */}
              {i === 0 || routinesSorted[i - 1].day !== r.day ? (
                <Text text={r.day} preset="invertBold" />
              ) : undefined}
              <View style={layout.rowBetweenCenter}>
                {i === 0 || routinesSorted[i - 1].muscle !== r.muscle ? (
                  <Text text={r.muscle} preset="invertDefault" style={styles.firtsColumnRoutine} />
                ) : (
                  <View style={styles.firtsColumnRoutine} />
                )}

                <Text
                  text={`*${r.exercise}`}
                  preset="invertDefault"
                  style={styles.secondColumnRoutine}
                />
                <Text text={`series: ${r.serie}`} preset="invertDefault" style={layout.fill} />
                <Text text={`resp: ${r.repetitions}`} preset="invertDefault" style={layout.fill} />
              </View>
            </View>
          )
        })}
      </Collapsible>
    </View>
  )
}

const MyExercisesPlans = () => {
  return (
    <Screen preset="scroll" contentContainerStyle={styles.container} safeAreaEdges={["top"]}>
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
              preset="invertBold"
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
  botones: { flex: 1.5, gap: spacing.sm },
  container: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  dateTitle: {
    alignItems: "center",
    flexDirection: "row",
  },
  firtsColumnRoutine: { flex: 0.8 },
  headerCard: { borderWidth: 0, overflow: "hidden", padding: 0 },
  infoPrincipal: { flex: 2, gap: spacing.xxs },
  planContainer: {
    borderColor: colors.palette.secondary300,
    borderRadius: 16,
    borderWidth: 3,
    padding: spacing.xxs,
  },
  planContainerToDay: {
    borderColor: colors.palette.quiet300,
  },
  secondColumnRoutine: { flex: 1.5 },
})
