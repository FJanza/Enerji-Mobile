export const numToDayString = (num: number) => {
  const dias = ["domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"]
  return num > 6 || num < 0 ? "error" : dias[num]
}
