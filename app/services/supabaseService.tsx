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

    HistoricosPesosPlan.sort(
      (a, b) =>
        moment(a.date, "yyyy-MM-DD").toDate().getTime() -
        moment(b.date, "yyyy-MM-DD").toDate().getTime(),
    ).forEach((obj) => {
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

export const getRecipePlansSP = async (email: string) => {
  const { data: PlanRecetaSB } = await supabase
    .from("PlanReceta")
    .select("id,email,startDate:desde,endDate:hasta,duration:duracion")
    // Filters
    .eq("email", email)

  const momentOrder = { Breakfast: 1, Lunch: 2, Dinner: 3 }

  const PlanesReceta = []

  for (let i = 0; i < PlanRecetaSB.length; i++) {
    const { data: HistoricosRecetasPlan } = await supabase
      .from("HistoricoRecetas")
      .select(
        'email:mail,food:comida,cal:"calorías",protein:"proteína",recipe:"preparación",done:cumplio,idPlan:id_plan,date:fecha,dayMoment:momentoDelDia,ingredients:ingredientes',
      )
      .eq("mail", email)
      .eq("id_plan", PlanRecetaSB[i].id)

    const unicos = []

    console.log(HistoricosRecetasPlan)

    HistoricosRecetasPlan.sort((a, b) => {
      const momentComparison = momentOrder[a.dayMoment] - momentOrder[b.dayMoment]
      if (momentComparison !== 0) {
        return momentComparison
      } else {
        if (moment(a.date, "yyyy-MM-DD").isSame(moment(b.date, "yyyy-MM-DD"))) {
          return 0
        } else {
          return moment(a.date, "yyyy-MM-DD").isBefore(moment(b.date, "yyyy-MM-DD")) ? -1 : 1
        }
      }
    }).forEach((obj) => {
      // Buscar si ya existe un objeto con el mismo atributo
      const index = unicos.findIndex(
        (el) =>
          el.food === obj.food &&
          el.dayMoment === obj.dayMoment &&
          moment(el.date).format("dddd") === moment(obj.date).format("dddd"),
      )

      index === -1 && unicos.push(obj)
    })

    PlanesReceta.push({
      ...PlanRecetaSB[i],
      recipes: unicos.map((hp) => {
        return { ...hp, date: moment(hp.date).format("DD/MM/yyyy") }
      }),
      startDate: moment(PlanRecetaSB[i].startDate).format("DD/MM/yyyy"),
      endDate: moment(PlanRecetaSB[i].endDate).format("DD/MM/yyyy"),
    })
  }

  return PlanesReceta
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
export const getHistoricRecipes = async (email: string) => {
  const { data: HistoricoRecetas } = await supabase
    .from("HistoricoRecetas")
    .select(
      'email:mail,food:comida,cal:"calorías",protein:"proteína",recipe:"preparación",done:cumplio,idPlan:id_plan,date:fecha,dayMoment:momentoDelDia,ingredients:ingredientes',
    )
    .eq("mail", email)
  return HistoricoRecetas
}
