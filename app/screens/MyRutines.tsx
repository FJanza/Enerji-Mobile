import { StyleSheet, View } from "react-native"
import React, { useEffect, useState } from "react"
import { Button, Screen, Text } from "app/components"
import { navigate } from "app/navigators"
import { colors, spacing } from "app/theme"
import DatePicker from "react-native-modern-datepicker"
import moment from "moment"
import { Divider } from "@rneui/themed"
import ExerciseDisplay from "app/components/ExerciseDisplay"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "app/store"
import { supabase } from "app/services/supabaseService"
import { showAlert } from "app/utils/alert"
import { Exercise } from "app/Interfaces/Interfaces"
import { setExersices } from "app/store/user"

const MyRutines = () => {
  const [selectedDate, setSelectedDate] = useState<Date>()

  const [exercisesOfDay, setExercisesOfDay] = useState<Exercise[]>([])

  const { exercises } = useSelector((state: RootState) => state.user)

  const [loadingSaveWeights, setLoadingSaveWeights] = useState(false)

  const dispatch = useDispatch()

  useEffect(() => {
    setExercisesOfDay(exercises.filter((ex) => moment(ex.date, "DD/MM/yyyy").isSame(selectedDate)))
  }, [selectedDate])

  const handleSaveWeights = async () => {
    setLoadingSaveWeights(true)
    for (let i = 0; i < exercisesOfDay.length; i++) {
      const { error } = await supabase
        .from("HistoricoPesos")
        .update({ peso: exercisesOfDay[i].weight })
        .eq("ejercicio", exercisesOfDay[i].exercise)
        .eq("fecha", moment(exercisesOfDay[i].date, "DD/MM/yyyy").format("yyyy-MM-DD"))
        .eq("id_plan", exercisesOfDay[i].idPlan)
        .select()

      error?.message && showAlert(error.message)
    }

    const exercisesUpdated = exercises.map((ex) => {
      const j = exercisesOfDay.findIndex(
        (exOfDay: Exercise) => exOfDay.date === ex.date && exOfDay.exercise === ex.exercise,
      )
      if (j > 0) {
        return { ...ex, weight: exercisesOfDay[j].weight }
      } else {
        return ex
      }
    }) as Exercise[]

    dispatch(setExersices(exercisesUpdated))
    setLoadingSaveWeights(false)
  }

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
        text="My plans"
      />

      <View>
        <View style={styles.cardHeader}>
          <Text text={`Training - ${moment(selectedDate).format("dddd")}`} weight="bold" />
        </View>
        <View style={styles.cardBody}>
          {exercisesOfDay.length > 0 ? (
            exercisesOfDay.map((exersice, i) => {
              return (
                <View key={i} style={{ gap: spacing.xs }}>
                  <ExerciseDisplay
                    exercise={exersice}
                    changeWeight={(e) => {
                      setExercisesOfDay((prev) =>
                        prev.map((ex) => {
                          return ex === exersice ? { ...exersice, weight: Number(e) } : ex
                        }),
                      )
                    }}
                  />
                  {i !== exercises.length - 1 && <Divider style={{ marginVertical: spacing.xs }} />}
                </View>
              )
            })
          ) : (
            <Text
              text={`You don't have exercises ${
                moment(selectedDate).isSame(moment())
                  ? "today"
                  : "on " + moment(selectedDate).format("DD/MM")
              }`}
              preset="invertDefault"
            />
          )}
        </View>
      </View>
      {exercisesOfDay.length > 0 && (
        <Button
          disabled={loadingSaveWeights}
          onPress={() => {
            handleSaveWeights()
          }}
          text={loadingSaveWeights ? "Saving weights.." : "Save weights"}
        />
      )}
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
