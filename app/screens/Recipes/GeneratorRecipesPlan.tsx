import { Pressable, StyleSheet, View } from "react-native"
import React, { useEffect, useState } from "react"
import { Button, Icon, Screen, Text, TextField } from "app/components"
import { colors, spacing } from "app/theme"
import { goBack } from "app/navigators"
import { layout } from "app/theme/global"
import { Picker } from "@react-native-picker/picker"
import { Recipe, RecipePlan } from "app/Interfaces/Interfaces"
import { generateRecipePlan } from "app/services/enerjiApi"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "app/store"
import { getDatesBetween, yearsToToday } from "app/utils/day"
import moment from "moment"
import { supabase } from "app/services/supabaseService"
import DatePicker from "react-native-date-picker"
import { showAlert } from "app/utils/alert"
import { appendRecipes, appendRecipesPlan } from "app/store/user"
import PlanRecipesDisplay from "app/components/PlanRecipesDisplay"
import Loading from "app/components/Loading"

const hasRepeatedDayMoreThanThree = (array) => {
  // Obtener todos los valores de 'day' en un nuevo array
  const days = array.map((subArray) => subArray.map((item) => item.day)).flat()

  // Crear un objeto para contar las repeticiones de cada día
  const dayCounts = days.reduce((counts, day) => {
    counts[day] = (counts[day] || 0) + 1
    return counts
  }, {})

  // Verificar si alguna repetición es mayor que tres
  const hasDayRepeatedMoreThanThree = Object.values(dayCounts).some((count) => Number(count) > 3)

  return hasDayRepeatedMoreThanThree
}

const hasUndefiendMomentOfDay = (array) => {
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array[i].length; j++) {
      if (array[i][j].moment_of_the_day === undefined) {
        return true // Si se encuentra algún momento undefined, retorna true
      }
    }
  }
  return false // Si no se encontró ningún momento undefined, retorna false
}

const GeneratorRecipesPlan = () => {
  const [trainingType, setTrainingType] = useState()
  const [duration, setDuration] = useState<string>()
  const [planGenerated, setPlanGenerated] = useState<RecipePlan>(undefined)
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
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

    dispatch(appendRecipesPlan(planGenerated))
    dispatch(appendRecipes(recipes))

    for (const recipe of recipes) {
      const { error } = await supabase
        .from("HistoricoRecetas")
        .insert([
          {
            mail: recipe.email,
            comida: recipe.food,
            id_plan: recipe.idPlan,
            calorías: recipe.cal,
            proteína: recipe.protein,
            preparación: recipe.recipe,
            ingredientes: recipe.ingredients,
            cumplio: recipe.done,
            fecha: moment(recipe.date, "DD/MM/yyyy").toDate(),
            momentoDelDia: recipe.dayMoment,
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
      // se genera el plan para conseguir el id
      const { data, error } = await supabase
        .from("PlanReceta")
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

    // TODO catch error and reset

    let generatedPlan
    let i = 0

    do {
      console.log(i)
      i > 0 && showAlert("Red de Palm inestable, disculpe la demora")

      generatedPlan = await generateRecipePlan({
        age: yearsToToday(moment(personalInformation.birthDate, "DD/MM/yyyy").toDate()),
        dietType: personalInformation.dietType,
        excerciseType: trainingType,
        bodyType: bodyTypes[personalInformation.bodyType],
      })

      i++
    } while (
      i < 3 &&
      (!generatedPlan ||
        hasRepeatedDayMoreThanThree(generatedPlan) ||
        hasUndefiendMomentOfDay(generatedPlan))
    )

    if (generatedPlan && i < 3) {
      const dates = daysOfWeek.map((day) => {
        return { day, dates: getDatesBetween(startDate, endDate, day) }
      })

      const recipes = []

      for (let i = 0; i < generatedPlan.length; i++) {
        for (let j = 0; j < dates.length; j++) {
          if (generatedPlan[i][0].day === dates[j].day) {
            for (let k = 0; k < dates[j].dates.length; k++) {
              recipes.push(
                generatedPlan[i].map((recipe) => {
                  return {
                    date: moment(dates[j].dates[k]).format("DD/MM/yyyy"),
                    dayMoment: recipe.moment_of_the_day,
                    email: personalInformation.email,
                    food: recipe.food,
                    cal: recipe.calories,
                    protein: recipe.protein,
                    recipe: recipe.preparation,
                    ingredients: recipe.ingredients,
                    done: false,
                    idPlan: localPlan.id,
                  }
                }),
              )
            }
          }
        }
      }

      let concatenatedRoutines = recipes.flat()

      concatenatedRoutines = concatenatedRoutines.sort(
        (a, b) =>
          moment(a.date, "DD/MM/yyyy").toDate().getTime() -
          moment(b.date, "DD/MM/yyyy").toDate().getTime(),
      )

      const concatenatedWeekRoutines = concatenatedRoutines.slice(0, 21)

      setPlanGenerated({
        ...localPlan,
        recipes: concatenatedWeekRoutines,
        id: 1,
        duration: Number(duration),
      })
      setRecipes(concatenatedRoutines)
      showAlert("Plan generado")
    } else {
      showAlert("Error al generar planes")
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
          disabled={loadingGenerate || trainingType === "" || !duration || Number(duration) < 1}
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
        <PlanRecipesDisplay plan={planGenerated} showDeleteButton={false} />
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
      <Loading type="vegetales" on={loadingGenerate} />
      <Loading type="guardando" on={loadingSave} />
    </Screen>
  )
}

export default GeneratorRecipesPlan

const styles = StyleSheet.create({
  container: {
    gap: spacing.xl,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
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
