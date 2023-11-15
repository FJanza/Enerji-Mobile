import { StyleSheet, View } from "react-native"
import React, { useState } from "react"
import { Text } from "./Text"
import { Recipe } from "app/Interfaces/Interfaces"
import { layout } from "app/theme/global"
import { colors, spacing } from "app/theme"
import { Button } from "./Button"
import Collapsible from "react-native-collapsible"
import { Chip } from "@rneui/base"

interface Props {
  recipe: Recipe
  actionButtons?: boolean
}

const RecipeDisplay = ({ recipe, actionButtons = true }: Props) => {
  const [showMore, setShowMore] = useState(false)

  return (
    <View style={{ gap: spacing.xs }}>
      <View>
        <Text text={`${recipe.dayMoment}: `} preset="invertBold" />
        <Text text={`${recipe.food}`} preset="invertDefault" numberOfLines={2} />
      </View>
      {actionButtons && (
        <View style={layout.rowBetween}>
          <View style={[layout.centerAllWidth, layout.row, { gap: spacing.xs }]}>
            <View style={layout.fill}>
              <Button
                text={showMore ? "ver menos" : "ver más"}
                preset="smallDefault"
                onPress={() => {
                  setShowMore((prev) => !prev)
                }}
              />
            </View>
          </View>

          <View style={[layout.centerAllWidth, layout.row]}>
            <View style={layout.centerAllWidth}>
              <Button text="ver más" preset="smallDefault" />
            </View>
            <View style={layout.centerAllWidth}>
              <Button text="ver más" preset="smallDefault" />
            </View>
          </View>
        </View>
      )}
      <Collapsible collapsed={!showMore} style={{ gap: spacing.sm }}>
        <View>
          <View style={{ gap: spacing.xs }}>
            <Text text="Ingredientes" preset="invertBold" />
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
                <Text text="Calorias" preset="invertBold" />
                <Text text={`${recipe.cal} Kcal`} preset="invertDefault" />
              </View>
              <View style={styles.macroCard}>
                <Text text="Proteinas" preset="invertBold" />
                <Text text={`${recipe.protein} g`} preset="invertDefault" />
              </View>
            </View>
          </View>
          <View>
            <Text text="Receta" preset="invertBold" />
            <Text text={recipe.recipe} preset="invertDefault" />
          </View>
        </View>
      </Collapsible>
    </View>
  )
}

export default RecipeDisplay

const styles = StyleSheet.create({
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
