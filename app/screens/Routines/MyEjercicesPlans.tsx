import { View, Text } from "react-native"
import React from "react"
import { Button } from "app/components"
import { navigate } from "app/navigators"

const MyEjercicesPlans = () => {
  return (
    <View>
      <Text>MyEjercicesPlans</Text>
      <Button
        onPress={() => {
          navigate("GeneratorEjercicePlan")
        }}
        text="Generador de planes"
      />
      <Button
        onPress={() => {
          navigate("MyRoutines")
        }}
        text="Mis rutinas"
      />
    </View>
  )
}

export default MyEjercicesPlans
