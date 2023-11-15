import { StyleSheet, View } from "react-native"
import React from "react"
import { Button, Card, Screen, Text } from "app/components"
import { navigate } from "app/navigators"
import { colors, spacing } from "app/theme"
import { layout } from "app/theme/global"

import { useSelector } from "react-redux"
import { RootState } from "app/store"
import { ROUTES } from "app/utils/routes"
import moment from "moment"
import PlanRecipesDisplay from "app/components/PlanRecipesDisplay"

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
    date: moment().add(1, "day").format("DD/MM/yyyy"),
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
    date: moment().add(1, "day").format("DD/MM/yyyy"),
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
    date: moment().add(1, "day").format("DD/MM/yyyy"),
    idPlan: "1",
    dayMoment: "Dinner",
  },
]

const recipePlanDummy = {
  id: 1,
  email: "",
  recipes: recipesDummy,
  startDate: moment().format("DD/MM/yyyy"),
  endDate: moment().add(1, "months").format("DD/MM/yyyy"),
  duration: 1,
}

const recipePlansDummy = [recipePlanDummy, recipePlanDummy]

const MyRecipesPlans = () => {
  return (
    <Screen preset="scroll" contentContainerStyle={styles.container} statusBarStyle="light">
      <View style={{ gap: spacing.md }}>
        <View style={layout.rowBetween}>
          <Button
            onPress={() => {
              navigate(ROUTES.MY_ROUTINES)
            }}
            text="Mis recetas"
            preset="reversed"
          />
          <Button
            onPress={() => {
              navigate(ROUTES.GENERATOR_RECIPES_PLAN)
            }}
            text="Generador de planes"
            preset="reversed"
          />
        </View>
        <Card
          style={styles.headerCard}
          HeadingComponent={
            <Text
              text="Mis Planes"
              preset="bold"
              size="xl"
              style={{ backgroundColor: colors.palette.primary600, paddingHorizontal: spacing.xs }}
            />
          }
          ContentComponent={
            <View style={{ padding: spacing.xxs, gap: spacing.sm }}>
              {recipePlansDummy.length > 0 ? (
                recipePlansDummy.map((p, i) => {
                  return <PlanRecipesDisplay plan={p} key={`${p.id}+${i}`} />
                })
              ) : (
                <Text
                  text="No tienes planes todavia, prueba generando uno!"
                  preset="invertDefault"
                  style={{ padding: spacing.xs }}
                />
              )}
            </View>
          }
        />
      </View>
    </Screen>
  )
}

export default MyRecipesPlans

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  headerCard: { borderWidth: 0, overflow: "hidden", padding: 0 },
})
