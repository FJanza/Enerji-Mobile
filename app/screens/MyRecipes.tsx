import { StyleSheet, View } from "react-native"
import React, { useEffect, useState } from "react"
import { Button, Screen, Text } from "app/components"
import { navigate } from "app/navigators"
import { colors, spacing } from "app/theme"
import DatePicker from "react-native-modern-datepicker"
import moment from "moment"
import { numToDayString } from "app/utils/day"
import { Divider } from "@rneui/themed"

import { useSelector } from "react-redux"
import { RootState } from "app/store"

import { ROUTES } from "app/utils/routes"
import RecipeDisplay from "app/components/RecipeDisplay"

const MyRecipes = () => {
  const [selectedDate, setSelectedDate] = useState<Date>()

  const [recipesOfDay, setRecipesOfDay] = useState([])

  const { recipes } = useSelector((state: RootState) => state.user)

  useEffect(() => {
    setRecipesOfDay(recipes.filter((re) => moment(re.date, "DD/MM/yyyy").isSame(selectedDate)))
  }, [selectedDate])

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
                  {i !== recipesOfDay.length - 1 && (
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
