import { View, StyleSheet } from "react-native"
import React, { useEffect, useState } from "react"
import { colors, spacing } from "app/theme"
import { Button, Screen, Text, TextField } from "app/components"
import { useStores } from "app/models"
import Toast from "react-native-simple-toast"

import { supabase } from "app/services/supabaseService"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "app/store"
import { TRADUCTIONS, User } from "app/Interfaces/Interfaces"
import { capitalizeString } from "app/utils/text"
import { layout } from "app/theme/global"
import { Picker } from "@react-native-picker/picker"
import { setUser } from "app/store/user"

const showAlert = (texto: string) => {
  Toast.show(texto, Toast.SHORT)
}

const Profile = () => {
  const { personalInformation } = useSelector((state: RootState) => state.user)

  const [dietTypes, setDietTypes] = useState([])

  const [objetives, setObjetives] = useState([])

  const personalAttr = Object.entries(personalInformation)

  const [personalInformationEdit, setPersonalInformationEdit] = useState<Partial<User>>({
    weight: personalInformation.weight,
    objective: personalInformation.objective,
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
    dispatch(setUser(personalInformationEdit))
    // TODO agregar el subir cambios a db en supabase
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

    const { data: tipoObjetivo, error: errorTipoObjetivo } = await supabase
      .from("Objetivos")
      .select("tipoObjetivo")

    if (errorTipoObjetivo?.message) {
      showAlert(errorTipoObjetivo.message)
    } else {
      setObjetives(tipoObjetivo.map((td) => td.tipoObjetivo))
    }
  }

  useEffect(() => {
    dataForRegister()
    console.log(personalInformation)
    console.log(personalInformationEdit)
  }, [personalInformationEdit])

  return (
    <Screen preset="scroll" contentContainerStyle={styles.container} safeAreaEdges={["top"]}>
      <Text text="Tus Datos" preset="heading" />
      <View style={styles.attributes}>
        {personalAttr.map((attr, i) => {
          return (
            attr[0] !== "weight" &&
            attr[0] !== "objective" &&
            attr[0] !== "dietType" && (
              <View key={i}>
                <Text text={`${capitalizeString(TRADUCTIONS[attr[0]])}:`} preset="formLabel" />
                <View style={layout.row}>
                  <Text text={`${attr[1]}`} />
                  <Text text={`${attr[0] === "height" ? "cm" : ""}`} />
                </View>
              </View>
            )
          )
        })}
        <View>
          <Text text={"Peso (Kg):"} />
          <TextField value={String(personalInformationEdit.weight)} />
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

        <View style={{ gap: spacing.xxxs }}>
          <Text text="Objetivo:" />
          <Picker
            style={styles.picker}
            mode="dropdown"
            selectedValue={personalInformationEdit.objective}
            onValueChange={(itemValue) =>
              setPersonalInformationEdit((prev) => {
                return { ...prev, objective: itemValue }
              })
            }
          >
            {objetives.map((td) => {
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
