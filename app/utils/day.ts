import moment from "moment"

export const numToDayString = (num: number) => {
  const dias = ["domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"]
  return num > 6 || num < 0 ? "error" : dias[num]
}

export const dayToNumber: Record<string, number> = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
}

export const yearsToToday = (date: Date) => {
  return moment().diff(moment(date), "years")
}

export const getDatesBetween = (startDate: Date, endDate: Date, dayOfWeek: string) => {
  const dates = []
  const currentDate = moment(startDate)

  while (currentDate.isSameOrBefore(endDate)) {
    if (currentDate.day() === moment().day(dayOfWeek).day()) {
      dates.push(currentDate.format("YYYY-MM-DD"))
    }
    currentDate.add(1, "days")
  }

  return dates
}
