import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useMemo, useRef, useState } from "react"
import {
  Dimensions,
  Image,
  ImageStyle,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  TextInput,
  View,
  ViewStyle,
} from "react-native"
import { Button, Icon, Screen, TextField, TextFieldAccessoryProps, Text } from "../components"
import { useStores } from "../models"
import { AppStackScreenProps } from "../navigators"
import { colors, spacing } from "../theme"
// import { useDispatch } from "react-redux"
import { layout } from "app/theme/global"
import { User } from "app/Interfaces/Interfaces"
import { supabase } from "app/services/supabaseService"
import Toast from "react-native-simple-toast"

interface LoginScreenProps extends AppStackScreenProps<"Login"> {}

const logo = require("../../assets/images/logoEnerji.png")

const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height

// TODO pasar a env
const LOGIN_WITH_AUTH = true
// TODO pasar a env

export const LoginScreen: FC<LoginScreenProps> = observer(function LoginScreen(_props) {
  // const definitions = {
  //   Ectomorfo: "Delgado, con poca grasa y poco músculo. Tienen problemas para ganar peso.",
  //   Endomorfo:
  //     "Mucha grasa y músculo, con una forma corporal más redonda que la de los ectomorfos. Ganan peso fácilmente.",
  //   Mesomorfo: "Atlético y musculoso, estos individuos ganan y pierden peso fácilmente.",
  // }

  // const distpach = useDispatch()

  const authPasswordInput = useRef<TextInput>()
  const [openRegisterModal, setOpenRegisterModal] = useState(false)
  const [authPassword, setAuthPassword] = useState("")
  const [isAuthPasswordHidden, setIsAuthPasswordHidden] = useState(true)
  const [isAuthCreatePasswordHidden, setIsAuthCreatePasswordHidden] = useState(true)

  const [userRegister, setUserRegister] = useState<Partial<User>>({})
  const {
    authenticationStore: { authEmail, setAuthEmail, setAuthToken },
  } = useStores()

  useEffect(() => {
    // Here is where you could fetch credentials from keychain or storage
    // and pre-fill the form fields.
    setAuthEmail("")
    setAuthPassword("")

    // Return a "cleanup" function that React will run when the component unmounts
    return () => {
      setAuthPassword("")
      setAuthEmail("")
    }
  }, [])

  const showAlert = (texto: string) => {
    Toast.show(texto, Toast.SHORT)
  }

  const login = async () => {
    if (LOGIN_WITH_AUTH) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: authEmail,
        password: authPassword,
      })

      console.log({ data, error })

      if (error?.message) {
        showAlert(error.message)
      } else {
        setAuthPassword("")
        setAuthEmail("")
        setAuthToken(data.session.access_token)
      }
    } else {
      setAuthToken("aaaaaaaaaaaaaaaaaaaa")
    }
  }

  const PasswordRightAccessory = useMemo(
    () =>
      function PasswordRightAccessory(props: TextFieldAccessoryProps) {
        return (
          <Icon
            icon={isAuthPasswordHidden ? "view" : "hidden"}
            color={colors.palette.neutral800}
            containerStyle={props.style}
            size={20}
            onPress={() => setIsAuthPasswordHidden(!isAuthPasswordHidden)}
          />
        )
      },
    [isAuthPasswordHidden],
  )
  const CreatePasswordRightAccessory = useMemo(
    () =>
      function PasswordRightAccessory(props: TextFieldAccessoryProps) {
        return (
          <Icon
            icon={isAuthCreatePasswordHidden ? "view" : "hidden"}
            color={colors.palette.neutral800}
            containerStyle={props.style}
            size={20}
            onPress={() => setIsAuthCreatePasswordHidden(!isAuthCreatePasswordHidden)}
          />
        )
      },
    [isAuthCreatePasswordHidden],
  )

  const handleRegister = async () => {
    const { data, error } = await supabase.auth.signUp({
      email: userRegister.email,
      password: userRegister.password,
    })
    console.log({ data, error })
    setOpenRegisterModal(false)
  }

  return (
    <Screen
      preset="auto"
      contentContainerStyle={$screenContentContainer}
      safeAreaEdges={["top", "bottom"]}
    >
      <Image style={$logo} source={logo} resizeMode="contain" />
      <View>
        <TextField
          value={authEmail}
          onChangeText={setAuthEmail}
          containerStyle={$textField}
          autoCapitalize="none"
          autoComplete="email"
          autoCorrect={false}
          keyboardType="email-address"
          labelTx="loginScreen.emailFieldLabel"
          placeholderTx="loginScreen.emailFieldPlaceholder"
          onSubmitEditing={() => authPasswordInput.current?.focus()}
        />
        <TextField
          ref={authPasswordInput}
          value={authPassword}
          onChangeText={setAuthPassword}
          containerStyle={$textField}
          autoCapitalize="none"
          autoComplete="password"
          autoCorrect={false}
          secureTextEntry={isAuthPasswordHidden}
          labelTx="loginScreen.passwordFieldLabel"
          placeholderTx="loginScreen.passwordFieldPlaceholder"
          helper="La contraseña debe tener 6 caracteres"
          HelperTextProps={{ size: "xs" }}
          RightAccessory={PasswordRightAccessory}
        />
        <Button
          testID="login-button"
          text="Log in"
          style={$tapButton}
          preset="reversed"
          onPress={login}
        />
        <View style={$registerButton}>
          <View style={layout.row}>
            <Text text="Si no tienes cuenta puedes " />
            <Pressable onPress={() => setOpenRegisterModal(true)}>
              <Text text="registrarte" style={$registerUnderLine} />
            </Pressable>
          </View>
        </View>
      </View>
      {/* REGISTER MODAL */}
      <Modal animationType="slide" transparent={true} visible={openRegisterModal}>
        <View style={layout.Center}>
          <View style={$cardModal}>
            <View style={$bodyModal}>
              <View style={[layout.rowSpacing, $headingModal]}>
                <Text text="Registrate" preset="subheading" />
                <Pressable onPress={() => setOpenRegisterModal(false)}>
                  <Icon icon="x" color="white" />
                </Pressable>
              </View>
              <SafeAreaView>
                <ScrollView showsVerticalScrollIndicator={false}>
                  <View style={$internalBodyModal}>
                    <TextField
                      label="Nombre"
                      onChangeText={(e) =>
                        setUserRegister((prev) => {
                          return { ...prev, name: e !== "" ? e : undefined }
                        })
                      }
                    />
                    <TextField
                      label="Apellido"
                      onChangeText={(e) =>
                        setUserRegister((prev) => {
                          return { ...prev, lastName: e !== "" ? e : undefined }
                        })
                      }
                    />
                    <TextField
                      label="Email"
                      onChangeText={(e) =>
                        setUserRegister((prev) => {
                          return { ...prev, email: e !== "" ? e : undefined }
                        })
                      }
                    />
                    <TextField
                      label="Contraseña"
                      helper="La contraseña debe tener 6 caracteres"
                      RightAccessory={CreatePasswordRightAccessory}
                      secureTextEntry={isAuthCreatePasswordHidden}
                      onChangeText={(e) =>
                        setUserRegister((prev) => {
                          return { ...prev, password: e !== "" ? e : undefined }
                        })
                      }
                    />
                    <TextField
                      label="Fecha de nacimiento"
                      placeholder="dd/mm/yyyy"
                      placeholderTextColor={"#a3a3a3"}
                    />
                    <TextField
                      label="Peso"
                      placeholder="Ej: 76 en Kg"
                      placeholderTextColor={"#a3a3a3"}
                      onChangeText={(e) =>
                        setUserRegister((prev) => {
                          return { ...prev, weight: e !== "" ? e : undefined }
                        })
                      }
                    />
                    <TextField
                      label="Altura"
                      keyboardType="decimal-pad"
                      placeholder="175 en cm"
                      placeholderTextColor={"#a3a3a3"}
                      onChangeText={(e) =>
                        setUserRegister((prev) => {
                          return { ...prev, height: e !== "" ? e : undefined }
                        })
                      }
                    />
                    <TextField
                      label="Tipo de cuerpo"
                      placeholder="Ej: hectomorfo"
                      placeholderTextColor={"#a3a3a3"}
                    />
                    <TextField
                      label="Tipo de dieta"
                      placeholder="Ej: 175 en cm"
                      placeholderTextColor={"#a3a3a3"}
                    />
                  </View>
                </ScrollView>
              </SafeAreaView>
              <View style={{ paddingHorizontal: spacing.md }}>
                <Button
                  text="Register"
                  style={$tapButton}
                  preset="reversed"
                  onPress={() => handleRegister()}
                  disabled={userRegister.email === "" && userRegister.password === ""}
                />
                <Text
                  text="Recuerda que luego de registrarte debe confirmar el proceso con el email que te enviamos"
                  size="xs"
                  weight="bold"
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </Screen>
  )
})

const $cardModal: ViewStyle = {
  backgroundColor: colors.palette.primary700,
  borderRadius: 20,
  alignItems: "center",
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.25,
  shadowRadius: 4,
  elevation: 5,
  width: windowWidth * 0.9,
  paddingBottom: spacing.sm,
  height: windowHeight * 0.85,
}

const $headingModal: ViewStyle = {
  width: "100%",
  paddingHorizontal: spacing.md,
  paddingVertical: spacing.sm,
  alignItems: "center",
  backgroundColor: colors.palette.primary600,
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
}

const $bodyModal: ViewStyle = {
  width: "100%",
  gap: spacing.sm,
  height: "65%",
}

const $internalBodyModal: ViewStyle = {
  width: "100%",
  paddingHorizontal: spacing.md,
  paddingVertical: spacing.sm,
  gap: spacing.sm,
}

const $screenContentContainer: ViewStyle = {
  paddingVertical: spacing.xxl,
  paddingHorizontal: spacing.lg,
  justifyContent: "space-around",
  flex: 1,
}

const $registerUnderLine: ViewStyle = {
  borderBottomWidth: 1,
  borderColor: "white",
}

const $registerButton: ViewStyle = {
  display: "flex",
  alignItems: "flex-end",
}

const $logo: ImageStyle = {
  height: 130,
  width: "100%",
}

const $textField: ViewStyle = {
  marginBottom: spacing.lg,
}

const $tapButton: ViewStyle = {
  marginTop: spacing.xs,
}

// @demo remove-file
