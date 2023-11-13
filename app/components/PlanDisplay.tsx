import { View, StyleSheet } from "react-native"
import React, { useState } from "react"
import { ExercisePlan } from "app/Interfaces/Interfaces"
import { colors, spacing } from "app/theme"
import Collapsible from "react-native-collapsible"
import { layout } from "app/theme/global"
import { Button, Text } from "app/components"
import moment from "moment"
import { Divider } from "@rneui/base"
import { capitalizeString } from "app/utils/text"

interface PlanDisplayProps {
  plan: ExercisePlan
  showDeleteButton?: boolean
}

const PlanDisplay = ({ plan, showDeleteButton = true }: PlanDisplayProps) => {
  const [showMore, setShowMore] = useState(false)

  const routinesSorted = plan.routine.sort(
    (a, b) =>
      moment(a.date, "DD/MM/yyyy").toDate().getTime() -
      moment(b.date, "DD/MM/yyyy").toDate().getTime(),
  )

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
            <Button text="Borrar" preset="smallDefault" />
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
              <View>
                {i === 0 || routinesSorted[i - 1].muscle !== r.muscle ? (
                  <View>
                    <Text
                      text={` ${capitalizeString(r.muscle)}`}
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

export default PlanDisplay

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
