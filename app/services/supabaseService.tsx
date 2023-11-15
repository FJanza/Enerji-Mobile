import "react-native-url-polyfill/auto"

import { createClient } from "@supabase/supabase-js"
import moment from "moment"

const SUPABASE_URL = "https://gdasvdepqifkqsfgypvc.supabase.co"
const SUPABASE_PUBLICK_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkYXN2ZGVwcWlma3FzZmd5cHZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTU1ODQzNTYsImV4cCI6MjAxMTE2MDM1Nn0.OHJWyXhB9hEb7S4i4mkYFtuyozroPmOxt2UBl_0KE84"

// Create a single supabase client for interacting with your database
const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLICK_KEY)

export { supabase }

export const getExercisePlansSP = async (email: string) => {
  const { data: PlanEjercicioSB } = await supabase
    .from("PlanEjercicio")
    .select("id,email,startDate:desde,endDate:hasta,duration:duracion")
    // Filters
    .eq("email", email)

  const PlanesEjercico = []

  for (let i = 0; i < PlanEjercicioSB.length; i++) {
    const { data: HistoricosPesosPlan } = await supabase
      .from("HistoricoPesos")
      .select(
        "email,muscle:musculo,exercise:ejercicio,date:fecha,weight:peso,series,repeat:repeticiones",
      )
      .eq("email", email)
      .eq("id_plan", PlanEjercicioSB[i].id)

    const unicos = []

    HistoricosPesosPlan.forEach((obj) => {
      // Buscar si ya existe un objeto con el mismo atributo
      const index = unicos.findIndex(
        (el) =>
          el.exercise === obj.exercise &&
          moment(el.date).format("dddd") === moment(obj.date).format("dddd"),
      )

      index === -1 && unicos.push(obj)
    })

    PlanesEjercico.push({
      ...PlanEjercicioSB[i],
      routine: unicos.map((hp) => {
        return { ...hp, date: moment(hp.date).format("DD/MM/yyyy") }
      }),
      startDate: moment(PlanEjercicioSB[i].startDate).format("DD/MM/yyyy"),
      endDate: moment(PlanEjercicioSB[i].endDate).format("DD/MM/yyyy"),
    })
  }

  return PlanesEjercico
}

export const getHistoricWeights = async (email: string) => {
  const { data: HistoricoPesos } = await supabase
    .from("HistoricoPesos")
    .select(
      "email,muscle:musculo,exercise:ejercicio,date:fecha,weight:peso,series,repeat:repeticiones,idPlan:id_plan",
    )
    .eq("email", email)
  return HistoricoPesos
}
