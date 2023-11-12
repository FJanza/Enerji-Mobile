import { StyleSheet, View } from "react-native"
import React, { useState } from "react"
import { Button, Screen, Text } from "app/components"
import { navigate } from "app/navigators"
import { colors, spacing } from "app/theme"
import DatePicker from "react-native-modern-datepicker"
import moment from "moment"
import { numToDayString } from "app/utils/day"
import { Divider } from "@rneui/themed"
import ExerciseDisplay from "app/components/ExerciseDisplay"
import { useSelector } from "react-redux"
import { RootState } from "app/store"

const MyRutines = () => {
  const [selectedDate, setSelectedDate] = useState<Date>()

  const { exercises } = useSelector((state: RootState) => state.user)

  console.log(exercises)

  return (
    <Screen
      preset="scroll"
      contentContainerStyle={styles.container}
      safeAreaEdges={["top"]}
      statusBarStyle="light"
    >
      <DatePicker
        options={{
          textHeaderColor: colors.palette.primary600,
          selectedTextColor: "#fff",
          mainColor: colors.palette.primary600,
        }}
        selected={moment(selectedDate).format("YYYY-MM-DD")}
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
          {exercises &&
            exercises
              .filter((ex) => moment(ex.date, "DD/MM/yyyy").isSame(selectedDate))
              .map((exersice, i) => {
                return (
                  <View key={i} style={{ gap: spacing.xs }}>
                    <ExerciseDisplay exercise={exersice} />
                    {i !== exercises.length - 1 && (
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
})
