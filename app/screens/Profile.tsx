import { View, StyleSheet } from "react-native"
import React, { useEffect } from "react"
import { spacing } from "app/theme"
import { Button, Screen, Text } from "app/components"
import { useStores } from "app/models"
import Toast from "react-native-simple-toast"

import { supabase } from "app/services/supabaseService"
import { useSelector } from "react-redux"
import { RootState } from "app/store"

const showAlert = (texto: string) => {
  Toast.show(texto, Toast.SHORT)
}

const Profile = () => {
  const {
    authenticationStore: { logout },
  } = useStores()

  const handleLogOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      showAlert(error.message)
    }
    logout()
  }

  const { personalInformation } = useSelector((state: RootState) => state.user)

  useEffect(() => {
    console.log(personalInformation)
  }, [])

  return (
    <Screen preset="scroll" contentContainerStyle={styles.container} safeAreaEdges={["top"]}>
      <View>
        <Text text="Perfil" preset="heading" />
      </View>
      <View>
        <Button tx="common.logOut" onPress={() => handleLogOut()} preset="reversed" />
      </View>
    </Screen>
  )
}

export default Profile

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
})
