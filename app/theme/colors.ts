const palette = {
  neutral100: "#FFFFFF",
  neutral200: "#e9efff",
  neutral300: "#dee5f2",
  neutral400: "#bbc1cc",
  neutral500: "#989da6",
  neutral600: "#696c73",
  neutral700: "#3a3c40",
  neutral800: "#191015",
  neutral900: "#000000",

  primary100: "#fafafa",
  primary200: "#E7E7E7",
  primary300: "#C8E5FF",
  primary400: "#92D8FF",
  primary500: "#23D9F2",
  primary600: "#1986A9",
  primary700: "#0c4b58",

  darker: "#061F24",

  secondary100: "#DCDDE9",
  secondary200: "#BCC0D6",
  secondary300: "#9196B9",
  secondary400: "#626894",
  secondary500: "#41476E",

  accent100: "#FFEED4",
  accent200: "#FFE1B2",
  accent300: "#FDD495",
  accent400: "#FBC878",
  accent500: "#FFBB50",

  angry100: "#F2D6CD",
  angry500: "#C03403",

  quiet100: "#D2F6CD",
  quiet300: "#00cc11",
  quiet500: "#34C003",

  overlay20: "rgba(25, 16, 21, 0.2)",
  overlay50: "rgba(25, 16, 21, 0.5)",
} as const

export const colors = {
  /**
   * The palette is available to use, but prefer using the name.
   * This is only included for rare, one-off cases. Try to use
   * semantic names as much as possible.
   */
  palette,
  /**
   * A helper for making something see-thru.
   */
  transparent: "rgba(0, 0, 0, 0)",
  /**
   * The default text color in many components.
   */
  text: palette.neutral200,
  /**
   * Secondary text information.
   */
  textDim: palette.neutral600,
  /**
   * The default color of the screen background.
   */
  background: palette.darker,
  /**
   * The default border color.
   */
  border: palette.neutral400,
  /**
   * The main tinting color.
   */
  tint: palette.primary500,
  /**
   * A subtle color used for lines.
   */
  separator: palette.neutral300,
  /**
   * Error messages.
   */
  error: palette.angry500,
  /**
   * Error Background.
   *
   */
  errorBackground: palette.angry100,
}
