const intlDateObj = new Intl.DateTimeFormat('id-ID', {
  timeZone: 'Asia/Ho_Chi_Minh'
})

export function parseHCMDate(dateString) {
  const date = Date.parse(dateString)
  const hcmDate = intlDateObj.format(date)
  return hcmDate
}
