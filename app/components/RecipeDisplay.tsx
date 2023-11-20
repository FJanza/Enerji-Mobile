import { StyleSheet, View } from "react-native"
import React, { useState } from "react"
import { Text } from "./Text"
import { Recipe } from "app/Interfaces/Interfaces"
import { layout } from "app/theme/global"
import { colors, spacing } from "app/theme"
import { Button } from "./Button"
import Collapsible from "react-native-collapsible"
import { Chip } from "@rneui/base"
import { CircularButton } from "./CircularButton"
import { useDispatch, useSelector } from "react-redux"
import { supabase } from "app/services/supabaseService"
import moment from "moment"
import { showAlert } from "app/utils/alert"
import { setRecipes } from "app/store/user"
import { RootState } from "app/store"

interface Props {
  recipe: Recipe
  actionButtons?: boolean
}

const RecipeDisplay = ({ recipe, actionButtons = true }: Props) => {
  const [showMore, setShowMore] = useState(false)

  const { recipes } = useSelector((state: RootState) => state.user)

  const dispatch = useDispatch()

  const handleButton = async () => {
    showAlert("Guardando opción")

    const { error } = await supabase
      .from("HistoricoRecetas")
      .update({ cumplio: recipe.done })
      .eq("comida", recipe.food)
      .eq("fecha", moment(recipe.date, "DD/MM/yyyy").format("yyyy-MM-DD"))
      .eq("id_plan", recipe.idPlan)
      .select()

    error?.message && showAlert(error.message)

    const updateRecipes = recipes.map((r) => {
      if (r.food === recipe.food && r.date === recipe.date && r.idPlan === recipe.idPlan) {
        return recipe
      } else {
        return r
      }
    })

    dispatch(setRecipes(updateRecipes))
  }

  return (
    <View style={{ gap: spacing.xs }}>
      <View>
        <Text text={`${recipe.dayMoment}: `} preset="invertBold" />
        <Text text={`${recipe.food}`} preset="invertDefault" numberOfLines={2} />
      </View>
      {actionButtons && (
        <View style={layout.rowBetween}>
          <View style={[layout.centerAllWidth, layout.row]}>
            <Button
              text={showMore ? "show less" : "show more"}
              preset="smallDefault"
              onPress={() => {
                setShowMore((prev) => !prev)
              }}
              style={layout.fill}
            />
          </View>
        </View>
      )}
      <Collapsible collapsed={!showMore} style={{ gap: spacing.sm }}>
        <View style={{ gap: spacing.xs }}>
          <View style={{ gap: spacing.xs }}>
            <Text text="Ingredients" preset="invertBold" />
            <View style={styles.listOfIngriendts}>
              {recipe.ingredients.map((ing) => {
                return <Chip title={ing} key={ing} color={colors.palette.primary600} />
              })}
            </View>
          </View>
          <View>
            <Text text="Macros" preset="invertBold" />
            <View style={[layout.row, { gap: spacing.xs }]}>
              <View style={styles.macroCard}>
                <Text text="Calories" preset="invertBold" />
                <Text text={`${recipe.cal} Kcal`} preset="invertDefault" />
              </View>
              <View style={styles.macroCard}>
                <Text text="Proteins" preset="invertBold" />
                <Text text={`${recipe.protein} g`} preset="invertDefault" />
              </View>
            </View>
          </View>
          <View>
            <Text text="Preparation" preset="invertBold" />
            <Text text={recipe.recipe} preset="invertDefault" />
          </View>
          <View>
            <View style={layout.row}>
              <Text text="State" preset="invertBold" />
              <Text text=" (select option)" preset="invertDefault" />
            </View>
            <Text
              text={recipe.done ? "Accomplished " : "not accomplished "}
              preset="invertDefault"
            />

            <View style={[layout.row, styles.buttons]}>
              <CircularButton
                icon="x"
                iconSize={40}
                preset="outlined"
                disabled={!recipe.done}
                iconColor={!recipe.done ? colors.palette.angry500 : colors.palette.neutral600}
                onPress={() => {
                  recipe.done = false
                  handleButton()
                }}
              />
              <CircularButton
                icon="check"
                iconSize={40}
                disabled={recipe.done}
                preset="outlined"
                iconColor={recipe.done ? colors.palette.quiet300 : colors.palette.neutral600}
                onPress={() => {
                  recipe.done = true
                  handleButton()
                }}
              />
            </View>
          </View>
        </View>
      </Collapsible>
    </View>
  )
}

export default RecipeDisplay

const styles = StyleSheet.create({
  buttons: { gap: spacing.md, marginTop: spacing.xs },
  listOfIngriendts: { flexDirection: "row", flexWrap: "wrap", gap: spacing.xs },
  macroCard: {
    alignItems: "center",
    borderColor: colors.palette.primary600,
    borderRadius: 16,
    borderWidth: 2,
    flex: 1,
    padding: spacing.xs,
  },
})
