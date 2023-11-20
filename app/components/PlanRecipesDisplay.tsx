import { View, StyleSheet } from "react-native"
import React, { useState } from "react"
import { RecipePlan } from "app/Interfaces/Interfaces"
import { colors, spacing } from "app/theme"
import Collapsible from "react-native-collapsible"
import { layout } from "app/theme/global"
import { Button, Text } from "app/components"
import moment from "moment"
import { getHistoricRecipes, getRecipePlansSP, supabase } from "app/services/supabaseService"
import { useDispatch } from "react-redux"
import { setRecipes, setRecipesPlans } from "app/store/user"
import RecipeDisplay from "./RecipeDisplay"

interface PlanRecipesDisplayProps {
  plan: RecipePlan
  showDeleteButton?: boolean
}

const PlanRecipesDisplay = ({ plan, showDeleteButton = true }: PlanRecipesDisplayProps) => {
  const [showMore, setShowMore] = useState(false)
  const [loading, setLoading] = useState(false)

  const recipes = [...plan.recipes].sort(
    (a, b) =>
      moment(a.date, "DD/MM/yyyy").toDate().getTime() -
      moment(b.date, "DD/MM/yyyy").toDate().getTime(),
  )

  const dispatch = useDispatch()

  const handleDeletePlan = async () => {
    setLoading(true)
    const { error: errorHistoricos } = await supabase
      .from("HistoricoRecetas")
      .delete()
      .eq("mail", plan.email)
      .eq("id_plan", plan.id)

    const { error: errorPlan } = await supabase
      .from("PlanReceta")
      .delete()
      .eq("email", plan.email)
      .eq("id", plan.id)

    if (errorHistoricos?.message || errorPlan?.message) {
      console.log({
        plan: errorPlan?.message,
        recetas: errorHistoricos?.message,
      })
    }

    const HistoricoRecetas = await getHistoricRecipes(plan.email)

    const PlanesReceta = await getRecipePlansSP(plan.email)

    dispatch(
      setRecipes(
        HistoricoRecetas.map((p) => {
          return { ...p, date: moment(p.date).format("DD/MM/yyyy") }
        }),
      ),
    )
    dispatch(setRecipesPlans(PlanesReceta))
    setLoading(false)
  }

  return (
    <View
      style={[
        styles.planContainer,
        moment(new Date()).isBetween(
          moment(plan.startDate, "DD/MM/yyyy"),
          moment(plan.endDate, "DD/MM/yyyy"),
        )
          ? styles.planContainerToDay
          : null,
      ]}
    >
      <View style={[layout.rowBetween, { padding: spacing.xs }]}>
        <View style={styles.infoPrincipal}>
          {/* StartDate */}
          <View style={styles.dateTitle}>
            <Text text={`From: `} preset="invertDefault" />

            <Text
              text={plan.startDate}
              preset="invertDefault"
              style={{
                backgroundColor: colors.palette.primary300,
                padding: spacing.xxs,
                borderRadius: spacing.xs,
              }}
            />
          </View>
          {/* EndDate */}
          <View style={styles.dateTitle}>
            <Text text={`Until: `} preset="invertDefault" />

            <Text
              text={plan.endDate}
              preset="invertDefault"
              style={{
                backgroundColor: colors.palette.primary300,
                padding: spacing.xxs,
                borderRadius: spacing.xs,
              }}
            />
          </View>
        </View>
        <View style={styles.botones}>
          {showDeleteButton ? (
            <Button
              text={loading ? "Deleting.." : "Delete"}
              preset="smallDefault"
              disabled={loading}
              onPress={() => {
                handleDeletePlan()
              }}
            />
          ) : (
            <View style={layout.fill} />
          )}
          <Button
            text={showMore ? "Show less" : "Show more"}
            onPress={() => {
              setShowMore((prev) => !prev)
            }}
            preset="smallDefault"
          />
        </View>
      </View>
      <Collapsible collapsed={!showMore} style={{ gap: spacing.xxs }}>
        <View style={layout.row}>
          <Text text="Duration: " preset="invertBold" />
          <Text text={`${plan.duration} months`} preset="invertDefault" />
        </View>
        {recipes.map((r, i) => {
          return (
            <View
              key={`${r.dayMoment}${r.date}${i}`}
              style={{ gap: spacing.xxs, paddingHorizontal: spacing.xs }}
            >
              {/* REVISAR CUANDO USEMOS LA API */}
              {i === 0 || recipes[i - 1].date !== r.date ? (
                <>
                  <Text
                    text={`-${moment(r.date, "DD/MM/yyyy").format("dddd")}`}
                    preset="invertBold"
                    size="md"
                    style={{ marginTop: spacing.xs }}
                  />
                  <RecipeDisplay recipe={r} actionButtons={false} />
                </>
              ) : (
                <RecipeDisplay recipe={r} actionButtons={false} />
              )}
            </View>
          )
        })}
      </Collapsible>
    </View>
  )
}

export default PlanRecipesDisplay

const styles = StyleSheet.create({
  botones: { flex: 1.5, gap: spacing.sm },

  dateTitle: {
    alignItems: "center",
    flexDirection: "row",
  },
  infoPrincipal: { flex: 2, gap: spacing.xxs },
  planContainer: {
    backgroundColor: colors.palette.primary200,
    borderColor: colors.palette.secondary300,
    borderRadius: 16,
    borderWidth: 3,
    padding: spacing.xxs,
  },
  planContainerToDay: {
    borderColor: colors.palette.quiet300,
  },
})
