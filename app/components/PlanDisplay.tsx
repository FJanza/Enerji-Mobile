import { View, StyleSheet, Pressable } from "react-native"
import React, { useState } from "react"
import { ExercisePlan } from "app/Interfaces/Interfaces"
import { colors, spacing } from "app/theme"
import Collapsible from "react-native-collapsible"
import { layout } from "app/theme/global"
import { Button, Text } from "app/components"
import moment from "moment"
import DatePicker from "react-native-date-picker"

interface PlanDisplayProps {
  plan: ExercisePlan
  showDeleteButton?: boolean
}

const PlanDisplay = ({ plan, showDeleteButton = true }: PlanDisplayProps) => {
  const [openStart, setOpenStart] = useState(false)
  const [showMore, setShowMore] = useState(false)
  const [openEnd, setOpenEnd] = useState(false)
  const [startDate, setStartDate] = useState<Date>(moment(plan.startDate, "DD/MM/yyyy").toDate())
  const [endDate, setEndDate] = useState<Date>(moment(plan.endDate, "DD/MM/yyyy").toDate())

  const routinesSorted = plan.routine.sort(
    (a, b) =>
      moment(a.date, "DD/MM/yyyy").toDate().getTime() -
      moment(b.date, "DD/MM/yyyy").toDate().getTime(),
  )

  return (
    <View
      style={[
        styles.planContainer,
        moment(new Date()).isBetween(startDate, endDate) ? styles.planContainerToDay : null,
      ]}
    >
      <View style={[layout.rowBetween, { padding: spacing.xs }]}>
        <View style={styles.infoPrincipal}>
          {/* StartDate */}
          <View style={styles.dateTitle}>
            <Text text={`Desde: `} preset="invertDefault" />
            <Pressable
              onPress={() => {
                setOpenStart(true)
              }}
            >
              <Text
                text={`${moment(startDate).format("DD/MM/yyyy")}`}
                preset="invertDefault"
                style={{
                  backgroundColor: colors.palette.primary300,
                  padding: spacing.xxs,
                  borderRadius: spacing.xs,
                }}
              />
            </Pressable>
            <DatePicker
              title="Select start date"
              modal
              open={openStart}
              date={startDate}
              onConfirm={(date) => {
                setStartDate(date)
                setEndDate(moment(date).add(plan.duration, "months").toDate())
                setOpenStart(false)
              }}
              onCancel={() => {
                setOpenStart(false)
              }}
              mode="date"
            />
          </View>
          {/* EndDate */}
          <View style={styles.dateTitle}>
            <Text text={`Hasta: `} preset="invertDefault" />
            <Pressable
              onPress={() => {
                setOpenEnd(true)
              }}
            >
              <Text
                text={`${moment(endDate).format("DD/MM/yyyy")}`}
                preset="invertDefault"
                style={{
                  backgroundColor: colors.palette.primary300,
                  padding: spacing.xxs,
                  borderRadius: spacing.xs,
                }}
              />
            </Pressable>
            <DatePicker
              title="Select end date"
              modal
              open={openEnd}
              date={endDate}
              onConfirm={(date) => {
                setEndDate(date)
                setStartDate(moment(date).subtract(plan.duration, "months").toDate())
                setOpenEnd(false)
              }}
              onCancel={() => {
                setOpenEnd(false)
              }}
              mode="date"
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
                <Text text={moment(r.date, "DD/MM/yyyy").format("dddd")} preset="invertBold" />
              ) : undefined}
              <View style={layout.rowBetweenCenter}>
                {i === 0 || routinesSorted[i - 1].muscle !== r.muscle ? (
                  <Text text={r.muscle} preset="invertDefault" style={styles.firtsColumnRoutine} />
                ) : (
                  <View style={styles.firtsColumnRoutine} />
                )}

                <Text
                  text={`*${r.exercise}`}
                  preset="invertDefault"
                  style={styles.secondColumnRoutine}
                />
                <Text text={`series: ${r.series}`} preset="invertDefault" style={layout.fill} />
                <Text text={`resp: ${r.repeat}`} preset="invertDefault" style={layout.fill} />
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
  secondColumnRoutine: { flex: 1.5 },
})
