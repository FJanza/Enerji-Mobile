import Toast from "react-native-simple-toast"

export const showAlert = (texto: string) => {
  Toast.show(texto, Toast.SHORT)
}
