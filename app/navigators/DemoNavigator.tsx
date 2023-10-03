import { BottomTabScreenProps, createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { CompositeScreenProps } from "@react-navigation/native"
import React from "react"
import { Image, ImageStyle, TextStyle, View, ViewStyle } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Icon } from "../components"
import { translate } from "../i18n"
import { DemoCommunityScreen, DemoDebugScreen } from "../screens"
import { DemoPodcastListScreen } from "../screens/DemoPodcastListScreen"
import { colors, spacing, typography } from "../theme"
import { AppStackParamList, AppStackScreenProps } from "./AppNavigator"

export type DemoTabParamList = {
  Home: undefined
  Perfil: undefined
  DemoShowroom: { queryIndex?: string; itemIndex?: string }
  DemoDebug: undefined
  DemoPodcastList: undefined
}

const logo = require("../../assets/images/logoEnerji.png")

/**
 * Helper for automatically generating navigation prop types for each route.
 *
 * More info: https://reactnavigation.org/docs/typescript/#organizing-types
 */
export type DemoTabScreenProps<T extends keyof DemoTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<DemoTabParamList, T>,
  AppStackScreenProps<keyof AppStackParamList>
>

const Tab = createBottomTabNavigator<DemoTabParamList>()

export function DemoNavigator() {
  const { bottom } = useSafeAreaInsets()

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarHideOnKeyboard: true,
        tabBarStyle: [$tabBar, { height: bottom + 70 }],
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.text,
        tabBarLabelStyle: $tabBarLabel,
        tabBarItemStyle: $tabBarItem,
        header: () => (
          <View style={{ backgroundColor: colors.palette.primary700, paddingVertical: spacing.xs }}>
            <Image style={$logo} source={logo} resizeMode="contain" />
          </View>
        ),
      }}
    >
      <Tab.Screen
        name="Home"
        component={DemoCommunityScreen}
        options={{
          tabBarLabel: translate("demoNavigator.home"),
          tabBarIcon: ({ focused }) => (
            <Icon icon="home" color={focused && colors.tint} size={30} />
          ),
        }}
      />

      <Tab.Screen
        name="DemoPodcastList"
        component={DemoPodcastListScreen}
        options={{
          tabBarAccessibilityLabel: translate("demoNavigator.mancuernas"),
          tabBarLabel: translate("demoNavigator.mancuernas"),
          tabBarIcon: ({ focused }) => (
            <Icon icon="mancuernas" color={focused && colors.tint} size={40} />
          ),
        }}
      />

      <Tab.Screen
        name="DemoDebug"
        component={DemoDebugScreen}
        options={{
          tabBarLabel: translate("demoNavigator.comida"),
          tabBarIcon: ({ focused }) => (
            <Icon icon="comida" color={focused && colors.tint} size={40} />
          ),
        }}
      />

      <Tab.Screen
        name="Perfil"
        component={DemoDebugScreen}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ focused }) => (
            <Icon icon="usuario" color={focused && colors.tint} size={40} />
          ),
        }}
      />
    </Tab.Navigator>
  )
}

const $tabBar: ViewStyle = {
  backgroundColor: colors.palette.primary700,
  borderTopColor: colors.transparent,
}

const $tabBarItem: ViewStyle = {
  paddingTop: spacing.md,
}

const $tabBarLabel: TextStyle = {
  fontSize: 12,
  fontFamily: typography.primary.medium,
  lineHeight: 20,
  flex: 1,
}

const $logo: ImageStyle = {
  height: 50,
  width: "100%",
}
