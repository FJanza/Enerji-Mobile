import { StyleSheet, View } from "react-native"
import React, { useEffect, useState } from "react"
import { Button, Screen, Text, TextField } from "app/components"
import { colors, spacing } from "app/theme"
import { navigate } from "app/navigators"
import { ROUTES } from "app/utils/routes"
import { layout } from "app/theme/global"
import { Picker } from "@react-native-picker/picker"
import SelectDays from "app/components/SelectDays"
import { ExercisePlan } from "app/Interfaces/Interfaces"
import PlanDisplay from "../../components/PlanDisplay"
import { planDummys } from "./MyExercisesPlans"
import { generatePlan } from "app/services/enerjiApi"
import { useSelector } from "react-redux"
import { RootState } from "app/store"
import { yearsToToday } from "app/utils/day"
import moment from "moment"
import { supabase } from "app/services/supabaseService"
import { showAlert } from "app/utils/alert"

const GeneratorExercisePlan = () => {
  const [trainingType, setTrainingType] = useState()
  const [duration, setDuration] = useState<string>()
  const [planGenerated, setPlanGenerated] = useState<ExercisePlan>(undefined)
  const [daysOfWeek, setDaysOfWeek] = useState([])
  const { personalInformation } = useSelector((state: RootState) => state.user)
  const [trainingTypes, setTrainingTypes] = useState([])
  const [bodyTypes, setBodyTypes] = useState([])
  const [loadingGenerate, setLoadingGenerate] = useState(false)

  const handleGeneratePlan = async () => {
    // TODO manejo de planes generados
    setLoadingGenerate(true)
    const gp = await generatePlan({
      age: yearsToToday(moment(personalInformation.birthDate, "DD/MM/yyyy").toDate()),
      cantDay: daysOfWeek.length,
      excerciseType: trainingType,
      bodyType: bodyTypes[personalInformation.bodyType],
    })
    gp
      ? gp.map((gp, i) => {
          console.log(i)
          return gp.map((rd) => console.log(rd))
        })
      : console.log("error generating")
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

      {planGenerated && <PlanDisplay plan={planGenerated} showDeleteButton={false} />}

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
