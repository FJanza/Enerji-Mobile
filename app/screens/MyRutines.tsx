import { View, Text } from "react-native"
import React from "react"
import { Button } from "app/components"
import { navigate } from "app/navigators"

const MyRutines = () => {
  return (
    <View>
      <Text>MyRutines</Text>
      <Button
        onPress={() => {
          navigate("MyEjercicesPlanNavigator", { screen: "MyEjercicesPlans" })
        }}
        text="Mis planes"
      />
    </View>
  )
}

export default MyRutines
