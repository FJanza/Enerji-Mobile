import { View, StyleSheet, Pressable } from "react-native"
import React, { useEffect, useState } from "react"
import { layout } from "app/theme/global"
import { Text } from "./Text"
import { colors, spacing } from "app/theme"

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

interface ButtonLetterProps {
  text: string
  isPreesed: VoidFunction
}

interface Props {
  onDaysChanges: (days: string[]) => void
}

const SelectDays = ({ onDaysChanges }: Props) => {
  const [selectedDays, setSelectedDays] = useState<string[]>([])

  const ButtonLetter = ({ text, isPreesed }: ButtonLetterProps) => {
    return (
      <Pressable onPress={() => isPreesed()}>
        <View
          style={[
            styles.buttonDay,
            selectedDays.some((selectDay) => selectDay === text)
              ? styles.buttonDaySelected
              : undefined,
          ]}
        >
          <Text
            text={text[0]}
            preset={selectedDays.some((selectDay) => selectDay === text) ? "bold" : "invertBold"}
          />
        </View>
      </Pressable>
    )
  }

  useEffect(() => {
    onDaysChanges(selectedDays)
  }, [selectedDays])
  return (
    <View style={[layout.rowBetweenCenter, { gap: spacing.xxs }]}>
      {days.map((d) => {
        return (
          <ButtonLetter
            text={d}
            key={d}
            isPreesed={() =>
              selectedDays.some((selectDay) => selectDay === d)
                ? setSelectedDays((prev) => {
                    return prev.filter((day) => day !== d)
                  })
                : setSelectedDays((prev) => {
                    return [...prev, d]
                  })
            }
          />
        )
      })}
    </View>
  )
}

export default SelectDays

const styles = StyleSheet.create({
  buttonDay: {
    alignItems: "center",
    borderColor: colors.palette.primary600,
    borderRadius: 30,
    borderWidth: 3,
    height: spacing.xl,
    justifyContent: "center",
    width: spacing.xl,
  },
  buttonDaySelected: {
    backgroundColor: colors.palette.secondary400,
    borderColor: colors.palette.primary700,
  },
})
