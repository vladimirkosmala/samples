import { DateTime } from 'luxon'
import moment from 'moment'
import { hrtime } from 'process'

export function getCurrentTimestamp(): number {
  return timeToTimestampSeconds(new Date())
}
export function getCurrentUtcDate(): Date {
  return DateTime.local().toUTC().toJSDate()
}

/** @returns string '2022-01-01' */
export function formatUTCDate(time: Date): string {
  return time.toISOString().split('T')[0]
}

const NS_PER_MS = 1e6

/**
 * Calculate precise duration between 2 calls.
 * Unit is ms
 *
 * @example
 *  const timer = createHrTimer();
 *  // ...
 *  console.log(timer()); // prints miliseconds duration
 */
export function createHrTimer(start = hrtime.bigint()) {
  return () => {
    const end = hrtime.bigint()
    const difference = end - start
    return Number(difference) / NS_PER_MS
  }
}

export function isDST(d: any) {
  const jan = new Date(d.getFullYear(), 0, 1).getTimezoneOffset()
  const jul = new Date(d.getFullYear(), 6, 1).getTimezoneOffset()
  return Math.max(jan, jul) !== d.getTimezoneOffset()
}

export function convertTimestampToDateFR2(timestampToConvert: any) {
  const timestamp = new Date(timestampToConvert * 1000)
  let date: any = timestamp.toDateString()
  date = date.split(' ').slice(1, 4)
  if (date[0] === 'Jan') {
    date.splice(0, 1, 'Janvier')
  } else if (date[0] === 'Feb') {
    date.splice(0, 1, 'Fevrier')
  } else if (date[0] === 'Mar') {
    date.splice(0, 1, 'Mars')
  } else if (date[0] === 'Apr') {
    date.splice(0, 1, 'Avril')
  } else if (date[0] === 'May') {
    date.splice(0, 1, 'Mai')
  } else if (date[0] === 'Jun') {
    date.splice(0, 1, 'Juin')
  } else if (date[0] === 'Jul') {
    date.splice(0, 1, 'Juillet')
  } else if (date[0] === 'Aug') {
    date.splice(0, 1, 'Aout')
  } else if (date[0] === 'Sep') {
    date.splice(0, 1, 'Septembre')
  } else if (date[0] === 'Oct') {
    date.splice(0, 1, 'Octobre')
  } else if (date[0] === 'Nov') {
    date.splice(0, 1, 'Novembre')
  } else if (date[0] === 'Dec') {
    date.splice(0, 1, 'Decembre')
  }
  date = `${date[1]}${date[0]}${date[2]}`
  return date
}

export function convertDateISOStringToUnix(isoDate: string): number {
  const dateToConvert = new Date(isoDate)
  return timeToTimestampSeconds(dateToConvert)
}

export function isBetweenBlackFridayAndChristmas() {
  const year = moment().year()
  const christmas = getChristmas(year)
  const blackFriday = getBlackFriday(year)

  return moment().isBetween(blackFriday, christmas)
}

function getChristmas(year: number) {
  return moment([year, 11, 25]).startOf('day')
}

function getBlackFriday(year: number) {
  const lastDay = moment([year, 10]).endOf('month')
  const sub = lastDay.day() >= 5 ? lastDay.day() - 5 : lastDay.day() + 2
  return lastDay.subtract(sub, 'days').startOf('day')
}

export function daysInSeconds(days: number): number {
  return days * 24 * 60 * 60
}

export function hoursInSeconds(hours: number): number {
  return hours * 60 * 60
}

export function minutesInSeconds(minutes: number): number {
  return minutes * 60
}

export function millisecondsToSeconds(milliseconds: number): number {
  return Math.floor(milliseconds / 1_000)
}

export function timeToTimestampSeconds(time: Date): number {
  return millisecondsToSeconds(time.getTime())
}

export function getYearFromDate(date: string | Date): string {
  return new Date(date).getUTCFullYear().toString()
}

export function formatDateFrench(date: string | Date): string {
  return moment(date).format('DD-MM-YYYY')
}

export function getFormattedDate(format: string): string {
  return moment().format(format)
}

export function computeThresholdTimestamp(daysFromToday: number) {
  return moment().subtract(daysFromToday, 'days').unix()
}

export const THREE_DAYS_MS = 259_200_000

export function parseIsoDateTime(date?: string): DateTime | undefined {
  if (!date) return undefined
  const parsed = DateTime.fromISO(date)
  return parsed.isValid ? parsed : undefined
}
