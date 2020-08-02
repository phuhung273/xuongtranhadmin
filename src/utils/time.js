const intlDateObj = new Intl.DateTimeFormat('id-ID', {
  timeZone: 'Asia/Ho_Chi_Minh'
})

export function parseHCMDate(dateString) {
  if (dateString !== undefined && dateString !== '') {
    const date = Date.parse(dateString)
    const hcmDate = intlDateObj.format(date)
    return hcmDate
  }

  return ''
}

const unitMap = {
  month: 30,
  week: 7,
  day: 1
}

export function last(number, unit) {
  // const numberNow = Date.now()
  // const dateNow = new Date(numberNow)
  const dateNow = new Date()

  const lastDate = new Date()
  const distance = number * unitMap[unit]
  lastDate.setDate(dateNow.getDate() - distance)

  return lastDate
}
