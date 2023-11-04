import { StyleSheet } from "react-native"

const layout = StyleSheet.create({
  Center: { alignItems: "center", flex: 1, justifyContent: "center", marginTop: 22 },
  centerAllWidth: { alignItems: "center", flex: 1 },
  fill: { flex: 1 },
  fillCenter: { alignItems: "center", flex: 1, justifyContent: "center" },
  row: { flexDirection: "row" },
  rowBetween: { flexDirection: "row", justifyContent: "space-between" },
})

export { layout }
