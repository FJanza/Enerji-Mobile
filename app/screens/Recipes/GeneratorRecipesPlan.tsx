import { Pressable, StyleSheet, View } from "react-native"
import React, { useEffect, useState } from "react"
import { Button, Icon, Screen, Text, TextField } from "app/components"
import { colors, spacing } from "app/theme"
import { goBack } from "app/navigators"
import { layout } from "app/theme/global"
import { Picker } from "@react-native-picker/picker"
import SelectDays from "app/components/SelectDays"
import { Exercise, ExercisePlan } from "app/Interfaces/Interfaces"
import PlanExerciseDisplay from "../../components/PlanExerciseDisplay"
import { generateExercisePlan } from "app/services/enerjiApi"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "app/store"
import { getDatesBetween, yearsToToday } from "app/utils/day"
import moment from "moment"
import { supabase } from "app/services/supabaseService"
import DatePicker from "react-native-date-picker"
import { showAlert } from "app/utils/alert"
import { appendExersicePlan, appendExersices } from "app/store/user"

const GeneratorRecipesPlan = () => {
  const [trainingType, setTrainingType] = useState()
  const [duration, setDuration] = useState<string>()
  const [planGenerated, setPlanGenerated] = useState<ExercisePlan>(undefined)
  const [routines, setRoutines] = useState<Exercise[]>([])
  const [daysOfWeek] = useState([])
  const [trainingTypes, setTrainingTypes] = useState([])
  const [bodyTypes, setBodyTypes] = useState([])
  const [loadingGenerate, setLoadingGenerate] = useState(false)
  const [openStart, setOpenStart] = useState(false)
  const [startDate, setStartDate] = useState(new Date())
  const [newPlan, setNewPlan] = useState(null)
  const [loadingSave, setLoadingSave] = useState(false)

  const { personalInformation } = useSelector((state: RootState) => state.user)

  const dispatch = useDispatch()

  const handleSavePlan = async () => {
    setLoadingSave(true)

    dispatch(appendExersicePlan(planGenerated))
    dispatch(appendExersices(routines))

    for (const exercise of routines) {
      const { error } = await supabase
        .from("HistoricoPesos")
        .insert([
          {
            email: exercise.email,
            musculo: exercise.muscle,
            ejercicio: exercise.exercise,
            fecha: moment(exercise.date, "DD/MM/yyyy").toDate(),
            peso: exercise.weight,
            series: exercise.series,
            repeticiones: exercise.repeat,
            id_plan: exercise.idPlan,
          },
        ])
        .select()
      if (error?.message) {
        showAlert(error.message)
      }
    }

    setLoadingSave(false)

    goBack()
  }

  const handleGeneratePlan = async () => {
    setLoadingGenerate(true)
    const endDate = moment(startDate).add(duration, "months").toDate()

    let localPlan = newPlan

    if (!newPlan) {
      const { data, error } = await supabase
        .from("PlanEjercicio")
        .insert([
          {
            email: personalInformation.email,
            desde: moment(startDate, "DD/MM/yyyy").toDate(),
            hasta: moment(endDate, "DD/MM/yyyy").toDate(),
            duracion: Number(duration),
          },
        ])
        .select()
      if (error?.message) {
        console.log(`Error al generar plan ne supabase: ${error.message}`)
        setLoadingGenerate(false)
        return undefined
      }

      localPlan = {
        email: personalInformation.email,
        startDate: moment(startDate).format("DD/MM/yyyy"),
        endDate: moment(endDate).format("DD/MM/yyyy"),
        id: data[0].id,
      }
      setNewPlan(localPlan)
    }

    const generatedPlan = await generateExercisePlan({
      age: yearsToToday(moment(personalInformation.birthDate, "DD/MM/yyyy").toDate()),
      cantDay: daysOfWeek.length,
      excerciseType: trainingType,
      bodyType: bodyTypes[personalInformation.bodyType],
    })

    if (generatedPlan && localPlan) {
      const dates = daysOfWeek.map((day) => {
        return { day, dates: getDatesBetween(startDate, endDate, day) }
      })

      const routinesOneWeek = generatedPlan.map((routineDay, i) => {
        return routineDay.map((exe) => {
          const { excercise_id: _, excercise: __, ...newExercise } = exe
          return {
            ...newExercise,
            exercise: exe.excercise,
            day: daysOfWeek[i],
            idPlan: localPlan.id,
            email: personalInformation.email,
          }
        })
      })

      const routines = []

      for (let i = 0; i < routinesOneWeek.length; i++) {
        for (let j = 0; j < dates.length; j++) {
          if (routinesOneWeek[i][0].day === dates[j].day) {
            for (let k = 0; k < dates[j].dates.length; k++) {
              routines.push(
                routinesOneWeek[i].map((exercise) => {
                  const { day: _, ...newExercise } = exercise
                  return {
                    ...newExercise,
                    date: moment(dates[j].dates[k]).format("DD/MM/yyyy"),
                    repeat: Number(exercise.repeat),
                    series: Number(exercise.series),
                    weight: Number(exercise.weight),
                  }
                }),
              )
            }
          }
        }
      }

      // eslint-disable-next-line prefer-spread
      const concatenatedRoutines = [].concat.apply([], routines)

      // Usar un Set para almacenar etiquetas únicas
      const uniqueDay = new Set()

      // Filtrar el array y agregar las etiquetas únicas al Set
      const filteredArray = routines.map((r) =>
        r.filter((item) => {
          const isUnique = !uniqueDay.has(
            `${item.exercise}${moment(item.date, "DD/MM/yyyy").format("dddd")}`,
          )
          uniqueDay.add(`${item.exercise}${moment(item.date, "DD/MM/yyyy").format("dddd")}`)
          return isUnique
        }),
      )

      // eslint-disable-next-line prefer-spread
      const routineOfWeekToDisplay = [].concat.apply([], filteredArray)

      setPlanGenerated({
        ...localPlan,
        routine: routineOfWeekToDisplay,
        id: 1,
        duration: Number(duration),
      })
      setRoutines(concatenatedRoutines)
      showAlert("generado correctamente")
    } else {
      showAlert("Error al generar, intentelo de nuevo")
    }
    setLoadingGenerate(false)
  }

  const dataFromSupa = async () => {
    const { data, error } = await supabase.from("Objetivos").select("tipoObjetivo")

    if (error?.message) {
      showAlert(error.message)
    } else {
      setTrainingTypes(data.map((tc) => tc.tipoObjetivo))
    }

    const { data: TipoCuerpo, error: errorTipoCuerpo } = await supabase
      .from("TipoCuerpo")
      .select("tipoCuerpo")

    if (errorTipoCuerpo?.message) {
      showAlert(errorTipoCuerpo.message)
    } else {
      setBodyTypes(TipoCuerpo.map((tc) => tc.tipoCuerpo))
    }
  }

  useEffect(() => {
    dataFromSupa()
  }, [])

  return (
    <Screen preset="scroll" contentContainerStyle={styles.container} statusBarStyle="light">
      <View style={layout.rowBetweenCenter}>
        <Button
          LeftAccessory={() => <Icon icon="back" color={colors.palette.primary100} />}
          text="Atras"
          onPress={() => {
            goBack()
          }}
          preset="smallReversed"
        />
      </View>
      <Text text="Generador de Planes" preset="heading" numberOfLines={1} adjustsFontSizeToFit />

      <View style={styles.filterContainer}>
        <View style={styles.trainingTypesContainer}>
          <Text text="Tipo de entrenamiento" preset="invertBold" />
          <View style={styles.trainingTypesSelectContainer}>
            <Picker
              mode="dropdown"
              selectedValue={trainingType}
              style={{
                backgroundColor: colors.palette.primary100,
              }}
              onValueChange={(itemValue) => setTrainingType(itemValue)}
            >
              {trainingTypes.map((td) => {
                return <Picker.Item label={td} value={td} key={td} />
              })}
            </Picker>
          </View>
        </View>
        <View style={{ gap: spacing.xs }}>
          {/* Duration */}

          <View>
            <View style={layout.row}>
              <Text text="Duración " preset="invertBold" />
              <Text text="(en meses)" preset="invertDefault" />
            </View>
            <View>
              <TextField
                keyboardType="decimal-pad"
                value={duration}
                onChangeText={(e) => {
                  setDuration(e)
                }}
              />
            </View>
          </View>
          <View style={layout.rowBetweenCenter}>
            {/* StartDate */}
            <View style={styles.dateTitle}>
              <Text text={`Fecha de incio: `} preset="invertBold" />
              <Pressable
                onPress={() => {
                  setOpenStart(true)
                }}
              >
                <Text
                  text={`${moment(startDate).format("DD/MM/yyyy")}`}
                  preset="invertDefault"
                  style={styles.dateText}
                />
              </Pressable>
              <DatePicker
                title="Select start date"
                modal
                open={openStart}
                date={startDate}
                onConfirm={(date) => {
                  setStartDate(date)
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
              <Text text={`Fecha de fin: `} preset="invertBold" />

              <Text
                text={`${moment(startDate).add(Number(duration), "months").format("DD/MM/yyyy")}`}
                preset="invertDefault"
                style={[styles.dateText, { backgroundColor: colors.palette.neutral300 }]}
              />
            </View>
          </View>
        </View>

        <Button
          disabled={
            loadingGenerate || !(trainingType !== "" && duration !== "" && daysOfWeek.length !== 0)
          }
          text={
            loadingGenerate
              ? "Generando.."
              : planGenerated
              ? "Generar otra versión"
              : "Generar Plan"
          }
          preset="reversed"
          onPress={() => {
            handleGeneratePlan()
          }}
        />
      </View>

      {planGenerated ? (
        <PlanExerciseDisplay plan={planGenerated} showDeleteButton={false} />
      ) : undefined}

      {planGenerated && (
        <Button
          onPress={async () => {
            // navigate(ROUTES.MY_EXERCISES_PLANS)
            await handleSavePlan()
          }}
          text={loadingSave ? "Guardando.." : "Guardar Plan"}
          disabled={loadingSave}
        />
      )}
    </Screen>
  )
}

export default GeneratorRecipesPlan

const styles = StyleSheet.create({
  container: {
    gap: spacing.xl,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  dateText: {
    backgroundColor: colors.palette.primary100,
    borderColor: colors.palette.neutral400,
    borderRadius: spacing.xs,
    borderWidth: 1,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
  },
  dateTitle: {
    alignItems: "flex-start",
  },
  filterContainer: {
    backgroundColor: colors.palette.primary200,
    borderColor: colors.palette.secondary300,
    borderRadius: 20,
    borderWidth: 4,
    gap: spacing.sm,
    padding: spacing.sm,
  },
  trainingTypesContainer: { gap: spacing.xxs },
  trainingTypesSelectContainer: { borderColor: colors.palette.neutral500, borderWidth: 0.5 },
})
