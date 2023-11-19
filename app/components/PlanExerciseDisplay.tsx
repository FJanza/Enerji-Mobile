import { View, StyleSheet } from "react-native"
import React, { useState } from "react"
import { ExercisePlan } from "app/Interfaces/Interfaces"
import { colors, spacing } from "app/theme"
import Collapsible from "react-native-collapsible"
import { layout } from "app/theme/global"
import { Button, Text } from "app/components"
import moment from "moment"
import { Divider } from "@rneui/base"
import { getExercisePlansSP, getHistoricWeights, supabase } from "app/services/supabaseService"
import { useDispatch } from "react-redux"
import { setExersicePlans, setExersices } from "app/store/user"

interface PlanExerciseDisplayProps {
  plan: ExercisePlan
  showDeleteButton?: boolean
}

const PlanExerciseDisplay = ({ plan, showDeleteButton = true }: PlanExerciseDisplayProps) => {
  const [showMore, setShowMore] = useState(false)
  const [loading, setLoading] = useState(false)

  const rutinas = [...plan.routine]

  const routinesSorted = rutinas.sort(
    (a, b) =>
      moment(a.date, "DD/MM/yyyy").toDate().getTime() -
      moment(b.date, "DD/MM/yyyy").toDate().getTime(),
  )
  const dispatch = useDispatch()

  const handleDeletePlan = async () => {
    setLoading(true)
    const { error: errorHistoricos } = await supabase
      .from("HistoricoPesos")
      .delete()
      .eq("email", plan.email)
      .eq("id_plan", plan.id)

    const { error: errorPlan } = await supabase
      .from("PlanEjercicio")
      .delete()
      .eq("email", plan.email)
      .eq("id", plan.id)

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
              disabled={loading}
              text={loading ? "Borrando" : "Borrar"}
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
        {routinesSorted.map((r, i) => {
          return (
            <View key={i} style={{ gap: spacing.xxs }}>
              {/* REVISAR CUANDO USEMOS LA API */}
              {i === 0 || routinesSorted[i - 1].date !== r.date ? (
                <Text
                  text={`-${moment(r.date, "DD/MM/yyyy").format("dddd")}`}
                  preset="invertBold"
                  size="md"
                  style={{ marginTop: spacing.xs }}
                />
              ) : undefined}
              <View style={{ gap: spacing.xxs }}>
                {i === 0 || routinesSorted[i - 1].muscle !== r.muscle ? (
                  <View>
                    <Text
                      text={` ${r.muscle}`}
                      preset="invertBold"
                      style={styles.firtsColumnRoutine}
                    />
                    <Divider />
                  </View>
                ) : (
                  <View style={styles.firtsColumnRoutine} />
                )}
                <View style={layout.rowBetweenCenter}>
                  <Text
                    text={`*${r.exercise}`}
                    preset="invertDefault"
                    style={styles.secondColumnRoutine}
                  />
                  <Text text={`series: ${r.series}`} preset="invertDefault" style={layout.fill} />
                  <Text text={`resp: ${r.repeat}`} preset="invertDefault" style={layout.fill} />
                </View>
                <Divider />
              </View>
            </View>
          )
        })}
      </Collapsible>
    </View>
  )
}

export default PlanExerciseDisplay

const styles = StyleSheet.create({
  botones: { flex: 1.5, gap: spacing.sm },

  dateTitle: {
    alignItems: "center",
    flexDirection: "row",
  },
  firtsColumnRoutine: { flex: 0.8 },
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
  secondColumnRoutine: { flex: 2 },
})
