/* eslint-disable react-native/no-color-literals */
import { Modal, StyleSheet, View } from "react-native"
import React, { useEffect, useState } from "react"
import { Text } from "./Text"
import { Icon, IconTypes } from "./Icon"
import { colors } from "app/theme"
import { layout } from "app/theme/global"

interface Props {
  type: "vegetales" | "ejercicios" | "guardando"
  on: boolean
}

const Loading = ({ type, on = false }: Props) => {
  const iconos = {
    vegetales: [
      "zanahoria",
      "berenjena",
      "jalapeño",
      "brocoli",
      "maiz",
      "lechuga",
      "ajo",
      "cebolla",
      "repollo",
    ],
    ejercicios: [
      "ejercicio1",
      "ejercicio2",
      "ejercicio3",
      "ejercicio4",
      "ejercicio5",
      "ejercicio6",
      "ejercicio7",
    ],
    guardando: ["avion1", "avion2", "avion3", "avion4", "avion5"],
  }

  const [icons] = useState(iconos[type] as IconTypes[]) // Array con nombres de iconos
  const [currentIconIndex, setCurrentIconIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIconIndex((prevIndex) => (prevIndex + 1) % icons.length)
    }, 2500) // Cambia de icono cada 2 segundos (2000 milisegundos)

    return () => clearInterval(interval) // Limpia el intervalo al desmontar el componente
  }, [icons.length])

  return (
    <View style={styles.centeredView}>
      <Modal animationType="slide" transparent={true} visible={on}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={layout.Center}>
              <Icon icon={icons[currentIconIndex]} size={200} color={colors.palette.primary300} />
              <Text
                text={type === "guardando" ? "Guardando datos..." : "Generando plan..."}
                style={{ color: colors.palette.primary300 }}
                weight="bold"
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default Loading

const styles = StyleSheet.create({
  centeredView: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  modalView: {
    backgroundColor: "rgba(80,90,90,0.7)",
    height: "100%",
    width: "100%",
  },
})
