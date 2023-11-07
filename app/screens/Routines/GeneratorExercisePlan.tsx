import { StyleSheet, View } from "react-native"
import React, { useState } from "react"
import { Button, Screen, Text, TextField } from "app/components"
import { colors, spacing } from "app/theme"
import { navigate } from "app/navigators"
import { ROUTES } from "app/utils/routes"
import { layout } from "app/theme/global"
import { Picker } from "@react-native-picker/picker"
import SelectDays from "app/components/SelectDays"
import { ExercisePlan } from "app/Interfaces/Interfaces"
import PlanDisplay from "./PlanDisplay"
import { planDummys } from "./MyExercisesPlans"

const trainingTypes = ["Hipertrofia", "cardio"]

const GeneratorExercisePlan = () => {
  const [tipoDeEntrenamiento, setTipoDeEntrenamiento] = useState()
  const [duracion, setDuracion] = useState<string>()
  const [planGenerado, setPlanGenerado] = useState<ExercisePlan>(undefined)

  const handleGeneratePlan = () => {
    setPlanGenerado(planDummys[0])
  }
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
              selectedValue={tipoDeEntrenamiento}
              style={{
                backgroundColor: colors.palette.primary100,
              }}
              onValueChange={(itemValue) => setTipoDeEntrenamiento(itemValue)}
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
              value={duracion}
              onChangeText={(e) => {
                setDuracion(e)
              }}
            />
          </View>
        </View>
        <View>
          <Text text="Seleccionar dias de la semana" preset="invertBold" />
          <SelectDays
            onDaysChanges={(days) => {
              console.log(days)
            }}
          />
        </View>
        <Button
          text="Generar"
          preset="smallReversed"
          onPress={() => {
            handleGeneratePlan()
          }}
        />
      </View>

      {planGenerado && <PlanDisplay plan={planGenerado} showDeleteButton={false} />}

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
  trainingTypesSelectContainer: { borderColor: "grey", borderWidth: 0.5 },
})
