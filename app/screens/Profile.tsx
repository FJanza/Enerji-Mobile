import { View, StyleSheet } from "react-native"
import React, { useEffect, useState } from "react"
import { colors, spacing } from "app/theme"
import { Button, Screen, Text, TextField } from "app/components"
import { useStores } from "app/models"
import Toast from "react-native-simple-toast"

import { supabase } from "app/services/supabaseService"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "app/store"
import { TRADUCTIONS } from "app/Interfaces/Interfaces"
import { capitalizeString } from "app/utils/text"
import { layout } from "app/theme/global"
import { Picker } from "@react-native-picker/picker"
import { updateUser } from "app/store/user"
import { Skeleton } from "@rneui/themed"

const showAlert = (texto: string) => {
  Toast.show(texto, Toast.SHORT)
}

const Profile = () => {
  const { personalInformation } = useSelector((state: RootState) => state.user)

  const [dietTypes, setDietTypes] = useState([])
  const [bodyTypes, setBodyTypes] = useState([])

  const personalAttr = Object.entries(personalInformation)

  const [weight, setWeight] = useState(String(personalInformation.weight))

  const [dietType, setDietType] = useState()

  const [guardandoCambios, setGuardandoCambios] = useState(false)

  const [loadingInfo, setLoadingInfo] = useState(true)

  const dispatch = useDispatch()

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

  const handleSaveData = async () => {
    setGuardandoCambios(true)
    dispatch(
      updateUser({
        weigth: Number(weight),
        dietType: dietTypes.indexOf(dietType),
      }),
    )
    const { error } = await supabase
      .from("UserPersonalInformation")
      .update({
        peso: Number(weight),
        id_tipoDeDieta: dietTypes.indexOf(dietType),
      })
      .eq("email", personalAttr[0][1])

    setGuardandoCambios(false)

    if (error?.message) {
      showAlert(error.message)
    }
  }

  const dataForRegister = async () => {
    const { data: TipoDieta, error: errorTipoDieta } = await supabase
      .from("TipoDieta")
      .select("type")

    if (errorTipoDieta?.message) {
      showAlert(errorTipoDieta.message)
    } else {
      setDietTypes(TipoDieta.map((td) => td.type))
    }

    const { data: TipoCuerpo, error: errorTipoCuerpo } = await supabase
      .from("TipoCuerpo")
      .select("tipoCuerpo")

    if (errorTipoCuerpo?.message) {
      showAlert(errorTipoCuerpo.message)
    } else {
      setBodyTypes(TipoCuerpo.map((tc) => tc.tipoCuerpo))
    }

    setDietType(TipoDieta[personalInformation.dietType].type)
    setLoadingInfo(false)
  }

  useEffect(() => {
    dataForRegister()
  }, [])

  return (
    <Screen
      preset="scroll"
      contentContainerStyle={styles.container}
      safeAreaEdges={["top"]}
      statusBarStyle="light"
    >
      <Text text="Tus Datos" preset="heading" />
      {loadingInfo ? (
        <View style={{ gap: spacing.md, paddingTop: spacing.sm }}>
          <Skeleton animation="pulse" width={260} height={44} style={styles.skeleton} />
          <Skeleton animation="pulse" width={260} height={44} style={styles.skeleton} />
          <Skeleton animation="pulse" width={260} height={44} style={styles.skeleton} />
          <Skeleton animation="pulse" width={260} height={44} style={styles.skeleton} />
          <Skeleton animation="pulse" width={260} height={44} style={styles.skeleton} />
          <Skeleton animation="pulse" width={260} height={44} style={styles.skeleton} />
          <Skeleton animation="pulse" width={340} height={55} style={styles.skeleton} />
          <Skeleton animation="pulse" width={340} height={55} style={styles.skeleton} />
        </View>
      ) : (
        <>
          <View style={styles.attributes}>
            {personalAttr.map((attr, i) => {
              if (i > 0) {
                return (
                  attr[0] !== "weight" &&
                  attr[0] !== "dietType" && (
                    <View key={i}>
                      <Text
                        text={`${capitalizeString(TRADUCTIONS[attr[0]])}:`}
                        preset="formLabel"
                      />
                      <View style={layout.row}>
                        <Text text={`${attr[0] === "bodyType" ? bodyTypes[attr[1]] : attr[1]}`} />
                        <Text text={`${attr[0] === "height" ? "cm" : ""}`} />
                      </View>
                    </View>
                  )
                )
              } else {
                return undefined
              }
            })}
            {weight && (
              <View>
                <Text text={"Peso (Kg):"} />
                <TextField
                  keyboardType="number-pad"
                  value={String(weight)}
                  onChangeText={(e) => {
                    !e.includes(",") && setWeight(e)
                  }}
                />
              </View>
            )}

            {dietType && (
              <View style={{ gap: spacing.xxxs }}>
                <Text text="Tipo de dieta:" />
                <Picker
                  style={styles.picker}
                  mode="dropdown"
                  selectedValue={dietType}
                  onValueChange={(itemValue) => setDietType(itemValue)}
                >
                  {dietTypes.map((td) => {
                    return <Picker.Item label={td} value={td} key={td} />
                  })}
                </Picker>
              </View>
            )}
          </View>
          <Button
            text={guardandoCambios ? "Guardando..." : "Guardar cambios"}
            onPress={() => handleSaveData()}
            preset="reversed"
            disabled={guardandoCambios}
          />
        </>
      )}

      <Button tx="common.logOut" onPress={() => handleLogOut()} preset="reversed" />
    </Screen>
  )
}

export default Profile

const styles = StyleSheet.create({
  attributes: { gap: spacing.xs, paddingBottom: spacing.xs, paddingHorizontal: spacing.sm },
  container: {
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  picker: { backgroundColor: colors.palette.primary200, borderRadius: 60 },
  skeleton: { backgroundColor: colors.palette.primary200, borderRadius: 8 },
})
