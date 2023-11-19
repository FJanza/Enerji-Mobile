import * as React from "react"
import { ComponentType } from "react"
import {
  Image,
  ImageStyle,
  StyleProp,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from "react-native"

export type IconTypes = keyof typeof CustomIcons

interface IconProps extends TouchableOpacityProps {
  /**
   * The name of the icon
   */
  icon: IconTypes

  /**
   * An optional tint color for the icon
   */
  color?: string

  /**
   * An optional size for the icon. If not provided, the icon will be sized to the icon's resolution.
   */
  size?: number

  /**
   * Style overrides for the icon image
   */
  style?: StyleProp<ImageStyle>

  /**
   * Style overrides for the icon container
   */
  containerStyle?: StyleProp<ViewStyle>

  /**
   * An optional function to be called when the icon is pressed
   */
  onPress?: TouchableOpacityProps["onPress"]
}

/**
 * A component to render a registered icon.
 * It is wrapped in a <TouchableOpacity /> if `onPress` is provided, otherwise a <View />.
 *
 * - [Documentation and Examples](https://github.com/infinitered/ignite/blob/master/docs/Components-Icon.md)
 */
export function Icon(props: IconProps) {
  const {
    icon,
    color,
    size,
    style: $imageStyleOverride,
    containerStyle: $containerStyleOverride,
    ...WrapperProps
  } = props

  const isPressable = !!WrapperProps.onPress
  const Wrapper: ComponentType<TouchableOpacityProps> = WrapperProps?.onPress
    ? TouchableOpacity
    : View

  return (
    <Wrapper
      accessibilityRole={isPressable ? "imagebutton" : undefined}
      {...WrapperProps}
      style={$containerStyleOverride}
    >
      <Image
        style={[
          $imageStyle,
          color && { tintColor: color },
          size && { width: size, height: size },
          $imageStyleOverride,
        ]}
        source={CustomIcons[icon]}
      />
    </Wrapper>
  )
}

export const CustomIcons = {
  back: require("../../assets/icons/back.png"),
  bell: require("../../assets/icons/bell.png"),
  caretLeft: require("../../assets/icons/caretLeft.png"),
  caretRight: require("../../assets/icons/caretRight.png"),
  check: require("../../assets/icons/check.png"),
  clap: require("../../assets/icons/clap.png"),
  community: require("../../assets/icons/community.png"),
  components: require("../../assets/icons/components.png"),
  debug: require("../../assets/icons/debug.png"),
  github: require("../../assets/icons/github.png"),
  heart: require("../../assets/icons/heart.png"),
  hidden: require("../../assets/icons/hidden.png"),
  ladybug: require("../../assets/icons/ladybug.png"),
  lock: require("../../assets/icons/lock.png"),
  menu: require("../../assets/icons/menu.png"),
  more: require("../../assets/icons/more.png"),
  pin: require("../../assets/icons/pin.png"),
  podcast: require("../../assets/icons/podcast.png"),
  settings: require("../../assets/icons/settings.png"),
  slack: require("../../assets/icons/slack.png"),
  view: require("../../assets/icons/view.png"),
  x: require("../../assets/icons/x.png"),
  home: require("../../assets/icons/home.png"),
  comida: require("../../assets/icons/comida.png"),
  mancuernas: require("../../assets/icons/mancuernas.png"),
  usuario: require("../../assets/icons/user.png"),
  zanahoria: require("../../assets/icons/vegetal_1.png"),
  berenjena: require("../../assets/icons/vegetal_2.png"),
  jalapeño: require("../../assets/icons/vegetal_3.png"),
  brocoli: require("../../assets/icons/vegetal_4.png"),
  maiz: require("../../assets/icons/vegetal_5.png"),
  lechuga: require("../../assets/icons/vegetal_6.png"),
  ajo: require("../../assets/icons/vegetal_7.png"),
  cebolla: require("../../assets/icons/vegetal_8.png"),
  repollo: require("../../assets/icons/vegetal_9.png"),
  ejercicio1: require("../../assets/icons/ejercicio_1.png"),
  ejercicio2: require("../../assets/icons/ejercicio_2.png"),
  ejercicio3: require("../../assets/icons/ejercicio_3.png"),
  ejercicio4: require("../../assets/icons/ejercicio_4.png"),
  ejercicio5: require("../../assets/icons/ejercicio_5.png"),
  ejercicio6: require("../../assets/icons/ejercicio_6.png"),
  ejercicio7: require("../../assets/icons/ejercicio_7.png"),
}

const $imageStyle: ImageStyle = {
  resizeMode: "contain",
}
