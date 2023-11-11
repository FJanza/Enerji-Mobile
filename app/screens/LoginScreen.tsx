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
import { UserRegistration } from "app/Interfaces/Interfaces"
import { supabase } from "app/services/supabaseService"
import { Picker } from "@react-native-picker/picker"
import Toast from "react-native-simple-toast"
import { useDispatch } from "react-redux"

import { setUser } from "app/store/user"
import DatePicker from "react-native-date-picker"
import moment from "moment"
import { capitalizeString } from "app/utils/text"

interface LoginScreenProps extends AppStackScreenProps<"Login"> {}

const logo = require("../../assets/images/logoEnerji.png")

const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height

// TODO pasar a env
const LOGIN_WITH_AUTH = true
// TODO pasar a env

// const dummyPersonalInformation: User = {
//   email: "thebonitagamer777rexomg@gmail.com",
//   birthDate: "13/11/2014",
//   name: "Bonita",
//   lastName: "Janza",
//   height: 120,
//   weight: 63,
//   objective: "volumen",
//   bodyType: "ectomorfo",
//   dietType: "Equilibrada",
//   sex: "female",
// }

const initialUserRegistration: Partial<UserRegistration> = {
  email: "",
  password: "",
  birthDate: "",
  bodyType: "",
  height: 0,
  lastName: "",
  name: "",
  weight: 0,
  dietType: "",
  sex: "Femenino",
}

export const LoginScreen: FC<LoginScreenProps> = observer(function LoginScreen(_props) {
  const dispatch = useDispatch()

  const authPasswordInput = useRef<TextInput>()
  const [openRegisterModal, setOpenRegisterModal] = useState(false)
  const [authPassword, setAuthPassword] = useState("")
  const [isAuthPasswordHidden, setIsAuthPasswordHidden] = useState(true)
  const [isAuthCreatePasswordHidden, setIsAuthCreatePasswordHidden] = useState(true)
  const [dietTypes, setDietTypes] = useState([])
  const [bodyTypes, setBodyTypes] = useState([])
  const [openDatePicker, setOpenDatePicker] = useState(false)
  const [birthDate, setBirthDate] = useState<Date>(new Date())

  const [userRegister, setUserRegister] =
    useState<Partial<UserRegistration>>(initialUserRegistration)

  const {
    authenticationStore: { authEmail, setAuthEmail, setAuthToken },
  } = useStores()

  const showAlert = (texto: string) => {
    Toast.show(texto, Toast.SHORT)
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
    console.log({
      userRegister,
    })

    // Here is where you could fetch credentials from keychain or storage
    // and pre-fill the form fields.
    setAuthEmail("")
    setAuthPassword("")
    dataForRegister()

    // Return a "cleanup" function that React will run when the component unmounts
    return () => {
      setAuthPassword("")
      setAuthEmail("")
    }
  }, [])

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
        // TODO traer informacion de tabla UserPersonalInformation
        const { data: UserPersonalInformation, error: errorDataBase } = await supabase
          .from("UserPersonalInformation")
          .select(
            "email, birthDate:fechaNacimiento, name:nombre, lastName:apellido, height:altura, weight:peso, sex:sexo, bodyType:id_tipoDeCuerpo, dietType:id_tipoDeDieta",
          )
          .eq("email", authEmail)

        if (errorDataBase?.message) {
          console.log(errorDataBase.message)
        } else {
          console.log("***********************************************")
          console.log(UserPersonalInformation)
          console.log("***********************************************")
          dispatch(setUser({ personalInformation: { ...UserPersonalInformation[0] } }))
          setAuthToken(data.session.access_token)
        }
      }
    } else {
      setAuthToken("a")
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

    const { error: errorData } = await supabase.from("UserPersonalInformation").insert([
      {
        email: userRegister.email,
        fechaNacimiento: moment(userRegister.birthDate, "DD/MM/yyyy").toDate(),
        nombre: capitalizeString(userRegister.name),
        apellido: capitalizeString(userRegister.lastName),
        altura: userRegister.height,
        peso: userRegister.weight,
        sexo: userRegister.sex,
        id_tipoDeCuerpo: bodyTypes.indexOf(userRegister.bodyType),
        id_tipoDeDieta: dietTypes.indexOf(userRegister.dietType),
      },
    ])
    if (errorData?.message) {
      console.log(errorData.message)
    }

    setOpenRegisterModal(false)
    setUserRegister(initialUserRegistration)
  }

  return (
    <Screen
      preset="auto"
      contentContainerStyle={$screenContentContainer}
      safeAreaEdges={["top", "bottom"]}
      statusBarStyle="light"
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
              <View style={[layout.rowBetween, $headingModal]}>
                <Text text="Registrate" preset="subheading" />
                <Pressable
                  onPress={() => {
                    setOpenRegisterModal(false)
                    setUserRegister(initialUserRegistration)
                  }}
                >
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
                    <View style={{ gap: spacing.xxs }}>
                      <Text text="Tipo de cuerpo" />
                      <Picker
                        style={$picker}
                        mode="dropdown"
                        selectedValue={userRegister.bodyType}
                        onValueChange={(itemValue) =>
                          setUserRegister((prev) => {
                            return { ...prev, bodyType: itemValue }
                          })
                        }
                      >
                        {bodyTypes.map((td) => {
                          return <Picker.Item label={capitalizeString(td)} value={td} key={td} />
                        })}
                      </Picker>
                    </View>
                    <View style={{ gap: spacing.xxs }}>
                      <Text text="Sexo" />
                      <Picker
                        style={$picker}
                        mode="dropdown"
                        selectedValue={userRegister.sex}
                        onValueChange={(itemValue) =>
                          itemValue === "Masculino" || itemValue === "Femenino"
                            ? setUserRegister((prev) => {
                                return { ...prev, sex: itemValue }
                              })
                            : null
                        }
                      >
                        <Picker.Item label={"Masculino"} value={"Masculino"} />
                        <Picker.Item label={"Femenino"} value={"Femenino"} />
                      </Picker>
                    </View>
                    <TextField
                      label="Altura"
                      keyboardType="decimal-pad"
                      placeholder="175 en cm"
                      placeholderTextColor={"#a3a3a3"}
                      onChangeText={(e) =>
                        setUserRegister((prev) => {
                          return { ...prev, height: Number(e) }
                        })
                      }
                    />
                    <View style={{ gap: spacing.xxs }}>
                      <Text text="Tipo de dieta" />
                      <Picker
                        style={$picker}
                        placeholder="Tipo de dieta"
                        mode="dropdown"
                        selectedValue={userRegister.dietType}
                        onValueChange={(itemValue) =>
                          setUserRegister((prev) => {
                            return { ...prev, dietType: itemValue }
                          })
                        }
                      >
                        {dietTypes.map((td) => {
                          return <Picker.Item label={capitalizeString(td)} value={td} key={td} />
                        })}
                      </Picker>
                    </View>
                    <View>
                      <Text text="Fecha de nacimiento" />
                      <Pressable
                        onPress={() => {
                          setOpenDatePicker(true)
                        }}
                      >
                        <Text
                          text={`${moment(birthDate).format("DD/MM/yyyy")}`}
                          preset="invertDefault"
                          style={{
                            backgroundColor: colors.palette.primary200,
                            padding: spacing.xs,
                            borderRadius: spacing.xxs,
                          }}
                        />
                      </Pressable>
                      <DatePicker
                        title="Select date"
                        modal
                        open={openDatePicker}
                        date={birthDate}
                        onConfirm={(date) => {
                          setBirthDate(date)
                          setUserRegister((prev) => {
                            return { ...prev, birthDate: moment(date).format("DD/MM/yyyy") }
                          })
                          setOpenDatePicker(false)
                        }}
                        onCancel={() => {
                          setOpenDatePicker(false)
                        }}
                        mode="date"
                      />
                    </View>
                    <TextField
                      label="Peso"
                      keyboardType="decimal-pad"
                      placeholder="Ej: 76 en Kg"
                      placeholderTextColor={"#a3a3a3"}
                      onChangeText={(e) =>
                        setUserRegister((prev) => {
                          return { ...prev, weight: Number(e) }
                        })
                      }
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
                  disabled={
                    userRegister.email === "" ||
                    userRegister.password === "" ||
                    userRegister.birthDate === "" ||
                    userRegister.bodyType === "" ||
                    userRegister.height === 0 ||
                    userRegister.lastName === "" ||
                    userRegister.name === "" ||
                    userRegister.weight === 0
                  }
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

const $picker: ViewStyle = {
  backgroundColor: colors.palette.primary200,
  borderRadius: 60,
}

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
