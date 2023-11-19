import {
  Pressable,
  PressableProps,
  PressableStateCallbackType,
  StyleProp,
  TextStyle,
  View,
  ViewStyle,
} from "react-native"
import React, { ComponentType } from "react"
import { Text, TextProps } from "./Text"
import { colors, spacing } from "../theme"
import { Icon, IconTypes } from "./Icon"

type Presets = keyof typeof $viewPresets

export interface ButtonAccessoryProps {
  style: StyleProp<any>
  pressableState: PressableStateCallbackType
}

export interface CircularButtonProps extends PressableProps {
  /**
   * Size of the the button.
   */
  size?: number
  /**
   * Size of the icon inside the button.
   */
  iconSize?: number
  /**
   * Color of the icon inside the button.
   */
  iconColor?: string
  /**
   * Name of the custom icon to display.
   */
  icon?: IconTypes
  /**
   * Text which is displayed underneath the button.
   */
  labelTx?: TextProps["tx"]
  /**
   * Text which is looked up via i18n.
   */
  tx?: TextProps["tx"]
  /**
   * The text to display if not using `tx` or nested components.
   */
  text?: TextProps["text"]
  /**
   * Optional options to pass to i18n. Useful for interpolation
   * as well as explicitly setting locale or translation fallbacks.
   */
  txOptions?: TextProps["txOptions"]
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
  /**
   * An optional style for the button container.
   */
  containerStyle?: StyleProp<ViewStyle>
  /**
   * An optional style override for the "pressed" state.
   */
  pressedStyle?: StyleProp<ViewStyle>
  /**
   * An optional style override for the button text.
   */
  textStyle?: StyleProp<TextStyle>
  /**
   * An optional style override for the button text when in the "pressed" state.
   */
  pressedTextStyle?: StyleProp<TextStyle>
  /**
   * One of the different types of button presets.
   */
  preset?: Presets
  /**
   * An optional parameter to show the button as full width.
   */
  fullWidth?: boolean
  /**
   * An optional boolean parameter to deactive the pressed style
   */
  disablePressed?: boolean
  /**
   * An optional component to render on the right side of the text.
   * Example: `RightAccessory={(props) => <View {...props} />}`
   */
  RightAccessory?: ComponentType<ButtonAccessoryProps>
  /**
   * An optional component to render on the left side of the text.
   * Example: `LeftAccessory={(props) => <View {...props} />}`
   */
  LeftAccessory?: ComponentType<ButtonAccessoryProps>
  /**
   * Children components.
   */
  children?: React.ReactNode
}

/**
 * A component that allows users to take actions and make choices.
 * Wraps the Text component with a Pressable component.
 *
 * - [Documentation and Examples](https://github.com/infinitered/ignite/blob/master/docs/Components-Button.xxxs)
 */

export function CircularButton(props: CircularButtonProps) {
  const {
    iconSize,
    iconColor,
    size,
    icon,
    labelTx: label,
    style: $viewStyleOverride,
    containerStyle: $containerStyleOverride,
    pressedStyle: $pressedViewStyleOverride,
    fullWidth,
    children,
    disabled,
    disablePressed,
    ...rest
  } = props

  const preset: Presets = props.preset && $viewPresets[props.preset] ? props.preset : "default"
  function $viewStyle(): StyleProp<ViewStyle> {
    return { width: fullWidth ? "100%" : size, height: size }
  }

  return (
    <Pressable
      disabled={disabled}
      accessibilityRole="button"
      style={[$viewStyle(), $containerStyle, $containerStyleOverride]}
      {...rest}
    >
      {({ pressed }) => (
        <>
          <View
            style={[
              disabled ? $viewPresetsDisabled[preset] : $viewPresets[preset],
              $viewStyleOverride,
              pressed &&
                !disablePressed && [$pressedViewPresets[preset], $pressedViewStyleOverride],
            ]}
          >
            {icon ? <Icon icon={icon} size={iconSize} color={iconColor} /> : children}
          </View>
          {(label || rest.text) && (
            <Text
              numberOfLines={2}
              tx={label}
              text={rest.text}
              style={[$textStyle, rest.textStyle]}
              size="xxs"
            />
          )}
        </>
      )}
    </Pressable>
  )
}

const $baseViewStyle: ViewStyle = {
  borderRadius: 40,
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "row",
  padding: spacing.xxs,
  aspectRatio: 1,
  overflow: "hidden",
}
const $containerStyle: ViewStyle = {
  alignItems: "center",
}
const $textStyle: TextStyle = {
  maxWidth: 99,
  textAlign: "center",
  marginTop: spacing.xxs,
  fontWeight: "500",
}

const $viewPresets = {
  default: [
    $baseViewStyle,
    {
      backgroundColor: colors.palette.neutral100,
    },
  ] as StyleProp<ViewStyle>,

  filled: [$baseViewStyle, { backgroundColor: colors.palette.neutral300 }] as StyleProp<ViewStyle>,

  reversed: [
    $baseViewStyle,
    { backgroundColor: colors.palette.primary600 },
  ] as StyleProp<ViewStyle>,

  outlined: [
    $baseViewStyle,
    { backgroundColor: colors.transparent, borderColor: colors.palette.neutral400, borderWidth: 1 },
  ] as StyleProp<ViewStyle>,
}
const $viewPresetsDisabled = {
  default: [
    $baseViewStyle,
    {
      backgroundColor: colors.palette.neutral300,
    },
  ] as StyleProp<ViewStyle>,

  filled: [$baseViewStyle, { backgroundColor: colors.palette.neutral300 }] as StyleProp<ViewStyle>,

  reversed: [$baseViewStyle, { backgroundColor: colors.background }] as StyleProp<ViewStyle>,

  outlined: [
    $baseViewStyle,
    {
      backgroundColor: colors.transparent,
      borderColor: colors.palette.neutral500,
      borderWidth: 1.5,
    },
  ] as StyleProp<ViewStyle>,
}

const $pressedViewPresets: Record<Presets, StyleProp<ViewStyle>> = {
  default: { backgroundColor: colors.palette.neutral300 },
  filled: { backgroundColor: colors.palette.neutral300 },
  reversed: { backgroundColor: colors.palette.primary700 },
  outlined: { backgroundColor: colors.palette.neutral300 },
}
