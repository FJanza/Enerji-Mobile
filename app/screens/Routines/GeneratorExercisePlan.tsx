import { Pressable, StyleSheet, View } from "react-native"
import React, { useEffect, useState } from "react"
import { Button, Screen, Text, TextField } from "app/components"
import { colors, spacing } from "app/theme"
import { navigate } from "app/navigators"
import { ROUTES } from "app/utils/routes"
import { layout } from "app/theme/global"
import { Picker } from "@react-native-picker/picker"
import SelectDays from "app/components/SelectDays"
import { Exercise, ExercisePlan } from "app/Interfaces/Interfaces"
import PlanDisplay from "../../components/PlanDisplay"
import { generatePlan } from "app/services/enerjiApi"
import { useSelector } from "react-redux"
import { RootState } from "app/store"
import { getDatesBetween, yearsToToday } from "app/utils/day"
import moment from "moment"
import { supabase } from "app/services/supabaseService"
import DatePicker from "react-native-date-picker"
import { showAlert } from "app/utils/alert"

const GeneratorExercisePlan = () => {
  const [trainingType, setTrainingType] = useState()
  const [duration, setDuration] = useState<string>()
  const [planGenerated, setPlanGenerated] = useState<ExercisePlan>(undefined)
  const [routines, setRoutines] = useState<Exercise[]>([])
  const [daysOfWeek, setDaysOfWeek] = useState([])
  const { personalInformation } = useSelector((state: RootState) => state.user)
  const [trainingTypes, setTrainingTypes] = useState([])
  const [bodyTypes, setBodyTypes] = useState([])
  const [loadingGenerate, setLoadingGenerate] = useState(false)
  const [openStart, setOpenStart] = useState(false)
  const [startDate, setStartDate] = useState(new Date())
  const [newPlan, setNewPlan] = useState(null)

  const handleGeneratePlan = async () => {
    setLoadingGenerate(true)
    const endDate = moment(startDate).add(duration, "months").toDate()

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

      setNewPlan({
        email: personalInformation.email,
        startDate: moment(startDate).format("DD/MM/yyyy"),
        endDate: moment(endDate).format("DD/MM/yyyy"),
        id: data[0].id,
      })
    }

    const generatedPlan = await generatePlan({
      age: yearsToToday(moment(personalInformation.birthDate, "DD/MM/yyyy").toDate()),
      cantDay: daysOfWeek.length,
      excerciseType: trainingType,
      bodyType: bodyTypes[personalInformation.bodyType],
    })
    if (generatedPlan) {
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
            idPlan: 1,
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
      const routines2 = [].concat.apply([], routines)

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
        ...newPlan,
        routine: routineOfWeekToDisplay,
        id: 1,
        duration: Number(duration),
      })
      setRoutines(routines2)
      console.log(routines2)
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
    <Screen
      preset="scroll"
      contentContainerStyle={styles.container}
      safeAreaEdges={["top"]}
      statusBarStyle="light"
    >
      <Text text="Generator de Planes" preset="heading" />

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
        </View>
        <View style={{ gap: spacing.xxs }}>
          <Text text="Seleccionar dias de la semana" preset="invertBold" />
          <SelectDays
            onDaysChanges={(days) => {
              setDaysOfWeek(days)
            }}
          />
        </View>
        <Button
          disabled={
            loadingGenerate || !(trainingType !== "" && duration !== "" && daysOfWeek.length !== 0)
          }
          text={loadingGenerate ? "Generando.." : "Generar Plan"}
          preset="reversed"
          onPress={() => {
            handleGeneratePlan()
          }}
        />
      </View>

      {planGenerated ? <PlanDisplay plan={planGenerated} showDeleteButton={false} /> : undefined}

      <Button
        // falta handler que sume el plan a la db y al redux
        onPress={() => {
          navigate(ROUTES.MY_EXERCISES_PLANS)
        }}
        text="Guardar Plan"
      />
    </Screen>
  )
}

export default GeneratorExercisePlan

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
    padding: spacing.sm,
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
