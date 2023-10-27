import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useMemo, useRef, useState } from "react"
import {
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

interface LoginScreenProps extends AppStackScreenProps<"Login"> {}

const logo = require("../../assets/images/logoEnerji.png")

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
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [attemptsCount, setAttemptsCount] = useState(0)
  const [userRegister, setUserRegister] = useState<Partial<User>>({})
  const {
    authenticationStore: { authEmail, setAuthEmail, setAuthToken, validationError },
  } = useStores()

  useEffect(() => {
    // Here is where you could fetch credentials from keychain or storage
    // and pre-fill the form fields.
    setAuthEmail("ignite@infinite.red")
    setAuthPassword("ign1teIsAwes0m3")

    // Return a "cleanup" function that React will run when the component unmounts
    return () => {
      setAuthPassword("")
      setAuthEmail("")
    }
  }, [])

  const error = isSubmitted ? validationError : ""

  async function login() {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: "someone@email.com",
      password: "xLhlywurAJBiUzhLKgPI",
    })

    console.log(data, error)

    setIsSubmitted(true)
    setAttemptsCount(attemptsCount + 1)

    if (validationError) return

    // Make a request to your server to get an authentication token.
    // If successful, reset the fields and set the token.
    setIsSubmitted(false)
    setAuthPassword("")
    setAuthEmail("")

    // We'll mock this with a fake token.
    setAuthToken(String(Date.now()))
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
          helper={error}
          status={error ? "error" : undefined}
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
          onSubmitEditing={login}
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
      <Modal animationType="slide" transparent={true} visible={openRegisterModal}>
        <View style={$cardModal}>
          <SafeAreaView>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={[layout.rowSpacing, $headingModal]}>
                <Text text="Registrate" preset="subheading" />
                <Pressable onPress={() => setOpenRegisterModal(false)}>
                  <Icon icon="x" color="white" />
                </Pressable>
              </View>
              <View style={$bodyModal}>
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

                <Button
                  text="Register"
                  style={$tapButton}
                  preset="reversed"
                  onPress={() => console.log(userRegister)}
                />
              </View>
            </ScrollView>
          </SafeAreaView>
        </View>
      </Modal>
    </Screen>
  )
})

const $cardModal: ViewStyle = {
  margin: 20,
  backgroundColor: "gray",
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
  width: "90%",
  paddingBottom: 10,
}

const $headingModal: ViewStyle = {
  width: "100%",
  paddingHorizontal: 25,
  paddingVertical: 10,
  alignItems: "center",
}

const $bodyModal: ViewStyle = {
  width: "100%",
  paddingHorizontal: 25,
  paddingVertical: 10,
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
  backgroundColor: colors.palette.primary600,
}

// @demo remove-file
