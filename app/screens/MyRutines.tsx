import { StyleSheet, View } from "react-native"
import React, { useState } from "react"
import { Button, Screen, Text, TextField } from "app/components"
import { navigate } from "app/navigators"
import { colors, spacing } from "app/theme"
import DatePicker from "react-native-modern-datepicker"
import moment from "moment"
import { numToDayString } from "app/utils/day"
import { layout } from "app/theme/global"
import { Exersice } from "app/Interfaces/Interfaces"
import { Divider } from "@rneui/themed"

const routineDummy: Exersice[] = [
  {
    id: 1,
    muscle: "Chest",
    day: "Monday",
    weight: "100",
    email: "user1@example.com",
    exercise: "Bench Press",
    idPlan: 101,
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
    idPlan: 102,
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
    muscle: "Shoulders",
    day: "Thursday",
    weight: "60",
    email: "user4@example.com",
    exercise: "Shoulder Press",
    idPlan: 104,
    serie: 5,
    repetitions: 6,
  },
]

const MyRutines = () => {
  const [selectedDate, setSelectedDate] = useState<Date>()

  return (
    <Screen
      preset="scroll"
      contentContainerStyle={styles.container}
      safeAreaEdges={["top"]}
      statusBarStyle="light"
    >
      <DatePicker
        onSelectedChange={(date: string) => {
          const dateDate = moment(date, "YYYY/MM/DD").toDate()
          !moment(selectedDate).isSame(dateDate) && setSelectedDate(dateDate)
        }}
        mode="calendar"
        style={styles.datePicker}
      />

      <Button
        onPress={() => {
          navigate("MyExercisesPlanNavigator", { screen: "MyExercisePlans" })
        }}
        text="Mis planes"
      />

      <View>
        <View style={styles.cardHeader}>
          <Text
            text={`Entrenamiento - ${numToDayString(moment(selectedDate).day())}`}
            weight="bold"
          />
        </View>
        <View style={styles.cardBody}>
          {routineDummy.map((r, i) => {
            return (
              <View key={i} style={{ gap: spacing.xs }}>
                <View style={{ gap: spacing.xs }}>
                  <View style={layout.rowBetween}>
                    <Text text={`Ejercicio: ${r.exercise}`} preset="invertBold" />
                    <Text text={r.muscle} preset="invertBold" />
                  </View>
                  <View style={layout.rowBetween}>
                    <View style={[layout.centerAllWidth, layout.row, { gap: spacing.xs }]}>
                      <View style={[layout.fill, { paddingLeft: spacing.xl }]}>
                        <Text text="Peso" preset="invertDefault" />
                      </View>
                    </View>
                    <View style={[layout.centerAllWidth, layout.row]}>
                      <View style={layout.centerAllWidth}>
                        <Text text={`Reps`} preset="invertDefault" />
                      </View>
                      <View style={layout.centerAllWidth}>
                        <Text text={`Series`} preset="invertDefault" />
                      </View>
                    </View>
                  </View>
                  <View style={layout.rowBetween}>
                    <View style={[layout.centerAllWidth, layout.row, { gap: spacing.xs }]}>
                      <View style={styles.textField}>
                        <TextField placeholder={`${r.weight}`} />
                      </View>
                      <View style={layout.fill}>
                        <Text text="Kg" preset="invertDefault" />
                      </View>
                    </View>
                    <View style={[layout.centerAllWidth, layout.row]}>
                      <View style={layout.centerAllWidth}>
                        <Text text={`${r.serie}`} preset="invertDefault" />
                      </View>
                      <View style={layout.centerAllWidth}>
                        <Text text={`${r.repetitions}`} preset="invertDefault" />
                      </View>
                    </View>
                  </View>
                </View>
                {i !== routineDummy.length - 1 && (
                  <Divider style={{ marginVertical: spacing.xs }} />
                )}
              </View>
            )
          })}
        </View>
      </View>
      <Button
        onPress={() => {
          navigate("MyExercisesPlanNavigator", { screen: "MyExercisePlans" })
        }}
        text="Guardar pesos"
      />
    </Screen>
  )
}

export default MyRutines

const styles = StyleSheet.create({
  cardBody: {
    backgroundColor: colors.palette.primary100,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingBottom: 15,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  cardHeader: {
    backgroundColor: colors.palette.primary600,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },

  container: {
    gap: spacing.md,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  datePicker: {
    backgroundColor: colors.palette.neutral100,
    borderRadius: 20,
  },
  textField: {
    width: 55,
  },
})
