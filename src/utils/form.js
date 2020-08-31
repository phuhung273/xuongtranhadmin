export function fillFormObject(formObject) {
  for (const field in formObject) {
    if (formObject.hasOwnProperty(field)) {
      const element = formObject[field]
      if (element === undefined) {
        formObject[field] = ''
      }
    }
  }
}
