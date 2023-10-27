import { StyleSheet } from "react-native"

const layout = StyleSheet.create({
  fill: { flex: 1 },
  fillCenter: { alignItems: "center", flex: 1, justifyContent: "center" },
  row: { flexDirection: "row" },
  rowSpacing: { flexDirection: "row", justifyContent: "space-between" },
})

export { layout }
