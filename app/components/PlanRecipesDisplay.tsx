import { View, StyleSheet } from "react-native"
import React, { useState } from "react"
import { RecipePlan } from "app/Interfaces/Interfaces"
import { colors, spacing } from "app/theme"
import Collapsible from "react-native-collapsible"
import { layout } from "app/theme/global"
import { Button, Text } from "app/components"
import moment from "moment"
import { getExercisePlansSP, getHistoricWeights, supabase } from "app/services/supabaseService"
import { useDispatch } from "react-redux"
import { setExersicePlans, setExersices } from "app/store/user"
import RecipeDisplay from "./RecipeDisplay"

interface PlanRecipesDisplayProps {
  plan: RecipePlan
  showDeleteButton?: boolean
}

const PlanRecipesDisplay = ({ plan, showDeleteButton = true }: PlanRecipesDisplayProps) => {
  const [showMore, setShowMore] = useState(false)

  const recipes = [...plan.recipes]

  const recipesSorted = recipes.sort(
    (a, b) =>
      moment(a.date, "DD/MM/yyyy").toDate().getTime() -
      moment(b.date, "DD/MM/yyyy").toDate().getTime(),
  )

  const dispatch = useDispatch()

  const handleDeletePlan = async () => {
    const { error: errorHistoricos } = await supabase
      .from("HistoricoPesos")
      .delete()
      .eq("email", plan.email)

    const { error: errorPlan } = await supabase
      .from("PlanEjercicio")
      .delete()
      .eq("email", plan.email)

    if (errorHistoricos?.message || errorPlan?.message) {
      console.log({
        plan: errorPlan?.message,
        pesos: errorHistoricos?.message,
      })
    }

    const HistoricoPesos = await getHistoricWeights(plan.email)

    const PlanesEjercico = await getExercisePlansSP(plan.email)

    dispatch(
      setExersices(
        HistoricoPesos.map((p) => {
          return { ...p, date: moment(p.date).format("DD/MM/yyyy") }
        }),
      ),
    )
    dispatch(setExersicePlans(PlanesEjercico))
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
            <Text text={`Desde: `} preset="invertDefault" />

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
            <Text text={`Hasta: `} preset="invertDefault" />

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
              text="Borrar"
              preset="smallDefault"
              onPress={() => {
                handleDeletePlan()
              }}
            />
          ) : (
            <View style={layout.fill} />
          )}
          <Button
            text={showMore ? "Ver menos" : "Ver mas"}
            onPress={() => {
              setShowMore((prev) => !prev)
            }}
            preset="smallDefault"
          />
        </View>
      </View>
      <Collapsible collapsed={!showMore} style={{ gap: spacing.xxs }}>
        <View style={layout.row}>
          <Text text="Duración: " preset="invertBold" />
          <Text text={`${plan.duration} meses`} preset="invertDefault" />
        </View>
        {recipesSorted.map((r, i) => {
          return (
            <View
              key={`${r.dayMoment}${r.date}`}
              style={{ gap: spacing.xxs, paddingHorizontal: spacing.xs }}
            >
              {/* REVISAR CUANDO USEMOS LA API */}
              {i === 0 || recipesSorted[i - 1].date !== r.date ? (
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
