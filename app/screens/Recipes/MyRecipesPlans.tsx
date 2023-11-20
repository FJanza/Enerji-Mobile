import { StyleSheet, View } from "react-native"
import React from "react"
import { Button, Card, Screen, Text } from "app/components"
import { navigate } from "app/navigators"
import { colors, spacing } from "app/theme"
import { layout } from "app/theme/global"

import { useSelector } from "react-redux"
import { RootState } from "app/store"
import { ROUTES } from "app/utils/routes"

import PlanRecipesDisplay from "app/components/PlanRecipesDisplay"

const MyRecipesPlans = () => {
  const { recipePlans } = useSelector((state: RootState) => state.user)

  return (
    <Screen preset="scroll" contentContainerStyle={styles.container} statusBarStyle="light">
      <View style={{ gap: spacing.md }}>
        <View style={layout.rowBetween}>
          <Button
            onPress={() => {
              navigate(ROUTES.MY_RECIPES)
            }}
            text="My recipes"
            preset="reversed"
          />
          <Button
            onPress={() => {
              navigate(ROUTES.GENERATOR_RECIPES_PLAN)
            }}
            text="Plan generator"
            preset="reversed"
          />
        </View>
        <Card
          style={styles.headerCard}
          HeadingComponent={
            <Text
              text="My plans"
              preset="bold"
              size="xl"
              style={{ backgroundColor: colors.palette.primary600, paddingHorizontal: spacing.xs }}
            />
          }
          ContentComponent={
            <View style={{ padding: spacing.xxs, gap: spacing.sm }}>
              {recipePlans.length > 0 ? (
                recipePlans.map((p, i) => {
                  return <PlanRecipesDisplay plan={p} key={`${p.id}+${i}`} />
                })
              ) : (
                <Text
                  text="You don't have plans yet, try generating one!"
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
