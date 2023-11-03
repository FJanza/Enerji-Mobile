import { StyleSheet, View } from "react-native"
import React, { useState } from "react"
import { Button, Screen, Text } from "app/components"
import { navigate } from "app/navigators"
import { colors, spacing } from "app/theme"
import DatePicker from "react-native-modern-datepicker"
import moment from "moment"
import { numToDayString } from "app/utils/day"
import { layout } from "app/theme/global"

interface PlanDisplayI {
  plan?: string
  day: Date
}

const PlanDisplay = ({ day, plan }: PlanDisplayI) => {
  return (
    <View>
      <Text text={plan} />
      <Text text={`${numToDayString(moment(day).day())}`} />
    </View>
  )
}

const MyRutines = () => {
  const [selectedDate, setSelectedDate] = useState<Date>()

  return (
    <Screen preset="scroll" contentContainerStyle={styles.container} safeAreaEdges={["top"]}>
      <Text>MyRutines</Text>
      <DatePicker
        onSelectedChange={(date: string) => {
          const dateDate = moment(date, "YYYY/MM/DD").toDate()
          !moment(selectedDate).isSame(dateDate) && setSelectedDate(dateDate)
        }}
        mode="calendar"
        style={styles.datePicker}
      />

      <View style={layout.rowSpacing}>
        <Button
          onPress={() => {
            navigate("MyExercisesPlanNavigator", { screen: "MyExercisePlans" })
          }}
          text="Mis planes"
          style={styles.myPlansButton}
        />

        <Button
          onPress={() => {
            navigate("MyExercisesPlanNavigator", { screen: "MyExercisePlans" })
          }}
          text="Mis planes"
          style={styles.myPlansButton}
        />
      </View>
      <PlanDisplay day={selectedDate} plan="" />
    </Screen>
  )
}

export default MyRutines

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
  },
  datePicker: {
    backgroundColor: colors.palette.neutral100,
    borderRadius: 20,
  },
  myPlansButton: {
    width: "40%",
  },
})
