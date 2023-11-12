import { StyleSheet, View } from "react-native"
import React from "react"
import { Text } from "./Text"
import { Exercise } from "app/Interfaces/Interfaces"
import { layout } from "app/theme/global"
import { TextField } from "./TextField"
import { spacing } from "app/theme"

interface Props {
  exercise: Exercise
}

const ExerciseDisplay = ({ exercise }: Props) => {
  return (
    <View style={{ gap: spacing.xs }}>
      <View style={layout.rowBetween}>
        <Text text={`Ejercicio: ${exercise.exercise}`} preset="invertBold" />
        <Text text={exercise.muscle} preset="invertBold" />
      </View>
      <View style={layout.rowBetween}>
        <View style={[layout.centerAllWidth, layout.row, { gap: spacing.xs }]}>
          <View style={[layout.fill, { paddingLeft: spacing.xl }]}>
            <Text text="Peso" preset="invertDefault" />
          </View>
        </View>
        <View style={[layout.centerAllWidth, layout.row]}>
          <View style={layout.centerAllWidth}>
            <Text text={`Reps`} preset="invertDefault" />
          </View>
          <View style={layout.centerAllWidth}>
            <Text text={`Series`} preset="invertDefault" />
          </View>
        </View>
      </View>
      <View style={layout.rowBetween}>
        <View style={[layout.centerAllWidth, layout.row, { gap: spacing.xs }]}>
          <View style={styles.textField}>
            <TextField placeholder={`${exercise.weight}`} />
          </View>
          <View style={layout.fill}>
            <Text text="Kg" preset="invertDefault" />
          </View>
        </View>
        <View style={[layout.centerAllWidth, layout.row]}>
          <View style={layout.centerAllWidth}>
            <Text text={`${exercise.serie}`} preset="invertDefault" />
          </View>
          <View style={layout.centerAllWidth}>
            <Text text={`${exercise.repetitions}`} preset="invertDefault" />
          </View>
        </View>
      </View>
    </View>
  )
}

export default ExerciseDisplay

const styles = StyleSheet.create({
  textField: {
    width: 55,
  },
})
