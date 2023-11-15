import { StyleSheet, View } from "react-native"
import React, { useEffect, useState } from "react"
import { Button, Screen, Text } from "app/components"
import { navigate } from "app/navigators"
import { colors, spacing } from "app/theme"
import DatePicker from "react-native-modern-datepicker"
import moment from "moment"
import { numToDayString } from "app/utils/day"
import { Divider } from "@rneui/themed"
import ExerciseDisplay from "app/components/ExerciseDisplay"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "app/store"
import { supabase } from "app/services/supabaseService"
import { showAlert } from "app/utils/alert"
import { Exercise, Recipe } from "app/Interfaces/Interfaces"
import { setExersices } from "app/store/user"
import { ROUTES } from "app/utils/routes"
import RecipeDisplay from "app/components/RecipeDisplay"

const recipesDummy = [
  {
    email: "thebonitagamer777rexomg@gmail.com",
    food: "Pancakes with banana and peanut butter",
    cal: "350",
    protein: "15",
    recipe:
      "Mix the flour, the milk, the eggs and the baking powder. Cook the pancakes in a frying pan for 2 minutes per side. Add the banana and peanut butter and fold.",
    ingredients: [
      "1 cup of flour",
      "1 cup of milk",
      "2 eggs",
      "1 teaspoon of baking powder",
      "1 banana",
      "2 tablespoon of Peanut butter",
    ],
    done: false,
    date: moment().format("DD/MM/yyyy"),
    idPlan: "1",
    dayMoment: "Breakfast",
  },
  {
    email: "thebonitagamer777rexomg@gmail.com",
    food: "Pancakes with banana and peanut butter",
    cal: "350",
    protein: "15",
    recipe:
      "Mix the flour, the milk, the eggs and the baking powder. Cook the pancakes in a frying pan for 2 minutes per side. Add the banana and peanut butter and fold.",
    ingredients: [
      "1 cup of flour",
      "1 cup of milk",
      "2 eggs",
      "1 teaspoon of baking powder",
      "1 banana",
      "2 tablespoon of Peanut butter",
    ],
    done: false,
    date: moment().format("DD/MM/yyyy"),
    idPlan: "1",
    dayMoment: "Lunch",
  },
  {
    email: "thebonitagamer777rexomg@gmail.com",
    food: "Pancakes with banana and peanut butter",
    cal: "350",
    protein: "15",
    recipe:
      "Mix the flour, the milk, the eggs and the baking powder. Cook the pancakes in a frying pan for 2 minutes per side. Add the banana and peanut butter and fold.",
    ingredients: [
      "1 cup of flour",
      "1 cup of milk",
      "2 eggs",
      "1 teaspoon of baking powder",
      "1 banana",
      "2 tablespoon of Peanut butter",
    ],
    done: false,
    date: moment().format("DD/MM/yyyy"),
    idPlan: "1",
    dayMoment: "Dinner",
  },
]

const MyRecipes = () => {
  const [selectedDate, setSelectedDate] = useState<Date>()

  const [recipesOfDay, setRecipesOfDay] = useState([])

  //   const { exercises } = useSelector((state: RootState) => state.user)

  const [loadingSaveWeights, setLoadingSaveWeights] = useState(false)

  const dispatch = useDispatch()

  useEffect(() => {
    setRecipesOfDay(recipesDummy.filter((re) => moment(re.date, "DD/MM/yyyy").isSame(selectedDate)))
  }, [selectedDate])

  const handleSaveWeights = async () => {
    setLoadingSaveWeights(true)
    for (let i = 0; i < recipesOfDay.length; i++) {
      const { error } = await supabase
        .from("HistoricoPesos")
        .update({ peso: recipesOfDay[i].weight })
        .eq("ejercicio", recipesOfDay[i].exercise)
        .eq("fecha", moment(recipesOfDay[i].date, "DD/MM/yyyy").format("yyyy-MM-DD"))
        .eq("id_plan", recipesOfDay[i].idPlan)
        .select()

      error?.message && showAlert(error.message)
    }

    const exercisesUpdated = exercises.map((ex) => {
      const j = recipesOfDay.findIndex(
        (exOfDay: Exercise) => exOfDay.date === ex.date && exOfDay.exercise === ex.exercise,
      )
      if (j > 0) {
        return { ...ex, weight: recipesOfDay[j].weight }
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
          navigate(ROUTES.MY_RECIPES_PLANS_NAVIGATOR, { screen: ROUTES.MY_RECIPES_PLANS })
        }}
        text="Mis planes"
      />

      <View>
        <View style={styles.cardHeader}>
          <Text text={`Comidas - ${numToDayString(moment(selectedDate).day())}`} weight="bold" />
        </View>
        <View style={styles.cardBody}>
          {recipesOfDay.length > 0 ? (
            recipesOfDay.map((recipe, i) => {
              return (
                <View key={i} style={{ gap: spacing.xs }}>
                  <RecipeDisplay recipe={recipe} />
                  {i !== recipesDummy.length - 1 && (
                    <Divider style={{ marginVertical: spacing.xs }} />
                  )}
                </View>
              )
            })
          ) : (
            <Text
              text={`No tienes ejercicios para ${
                moment(selectedDate).isSame(moment())
                  ? "hoy"
                  : "el " + moment(selectedDate).format("DD/MM")
              }`}
              preset="invertDefault"
            />
          )}
        </View>
      </View>
      <Button
        disabled={loadingSaveWeights}
        onPress={() => {
          handleSaveWeights()
        }}
        text={loadingSaveWeights ? "Guardando pesos" : "Guardar pesos"}
      />
    </Screen>
  )
}

export default MyRecipes

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
