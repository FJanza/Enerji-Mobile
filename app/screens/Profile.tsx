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

const showAlert = (texto: string) => {
  Toast.show(texto, Toast.SHORT)
}

const Profile = () => {
  const { personalInformation } = useSelector((state: RootState) => state.user)

  const [dietTypes, setDietTypes] = useState([])
  const [bodyTypes, setBodyTypes] = useState([])

  const personalAttr = Object.entries(personalInformation)

  const [personalInformationEdit, setPersonalInformationEdit] = useState({
    weight: String(personalInformation.weight),
    dietType: personalInformation.dietType,
  })

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
    dispatch(
      updateUser({
        weigth: Number(personalInformationEdit.weight),
        dietType: personalInformationEdit.dietType,
      }),
    )
    // TODO agregar el subir cambios a db en supabase
    const { error } = await supabase
      .from("UserPersonalInformation")
      .update({
        peso: Number(personalInformationEdit.weight),
        id_tipoDeDieta: dietTypes.indexOf(personalInformationEdit.dietType),
      })
      .eq("email", personalAttr[0][1])

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
  }

  useEffect(() => {
    dataForRegister()
    console.log(personalAttr)
    console.log(personalInformationEdit)
  }, [personalInformationEdit])

  return (
    <Screen
      preset="scroll"
      contentContainerStyle={styles.container}
      safeAreaEdges={["top"]}
      statusBarStyle="light"
    >
      <Text text="Tus Datos" preset="heading" />
      <View style={styles.attributes}>
        {personalAttr.map((attr, i) => {
          if (i > 0) {
            return (
              attr[0] !== "weight" &&
              attr[0] !== "dietType" && (
                <View key={i}>
                  <Text text={`${capitalizeString(TRADUCTIONS[attr[0]])}:`} preset="formLabel" />
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
        <View>
          <Text text={"Peso (Kg):"} />
          <TextField
            keyboardType="number-pad"
            value={String(personalInformationEdit.weight)}
            onChangeText={(e) => {
              !e.includes(",") &&
                setPersonalInformationEdit((prev) => {
                  return { ...prev, weight: e }
                })
            }}
          />
        </View>

        <View style={{ gap: spacing.xxxs }}>
          <Text text="Tipo de dieta:" />
          <Picker
            style={styles.picker}
            mode="dropdown"
            selectedValue={personalInformationEdit.dietType}
            onValueChange={(itemValue) =>
              setPersonalInformationEdit((prev) => {
                return { ...prev, dietType: itemValue }
              })
            }
          >
            {dietTypes.map((td) => {
              return <Picker.Item label={td} value={td} key={td} />
            })}
          </Picker>
        </View>
      </View>
      <Button text="Guardar cambios" onPress={() => handleSaveData()} preset="reversed" />
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
})
