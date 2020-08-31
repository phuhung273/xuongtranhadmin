/**
 * @param  {Array} options Ex: ['student', 'teacher']
 * @param  {String} key Ex: 'role'
 * @param  {Array} items
 *  * Ex: [
 * {class: 'a', role: 'student'},
 * {class: 'b', role: 'student'},
 * {class: 'c', role: 'teacher'}
 * ]
 * @returns {Object} Ex: {teacher: 1, student: 2}
 */
export function countDistinctKey(options, key, items) {
  const result = {}

  options.forEach(item => {
    result[item] = 0
  })

  items.forEach(item => {
    result[item[key]] += 1
  })

  return result
}

/**
 * @param  {Array} options Ex: ['student', 'teacher']
 * @param  {String} key Ex: 'role'
 * @param  {String} value Ex: 'quantity'
 * @param  {Array} items
 *  * Ex: [
 * {class: 'a', role: 'student', quantity: 10},
 * {class: 'b', role: 'student', quantity: 10},
 * {class: 'c', role: 'teacher', quantity: 10}
 * ]
 * @returns {Object} Ex: {teacher: 10, student: 20}
 */
export function countDistinctKeyByAnotherKey(options, key, value, items) {
  const result = {}

  options.forEach(item => {
    result[item] = 0
  })

  items.forEach(item => {
    result[item[key]] += item[value]
  })

  return result
}

/**
 * @param  {Array} options Ex: ['a', 'b']
 * @param  {Object} obj Ex: {a: 1, b: 2, c:3}
 * @returns {Object} Ex: {c: 3}
 */
export function deleteKeys(options, obj) {
  const newObj = { ...obj }

  Object.keys(newObj).forEach(key => {
    if (options.includes(key)) {
      delete newObj[key]
    }
  })

  return newObj
}

/**
 * @param  {Array} options Ex: ['a', 'b']
 * @param  {Object} obj Ex: {a: 1, b: 2, c:3}
 * @returns {Object} Ex: {a: 1, b: 2}
 */
export function keepKeys(options, obj) {
  const newObj = { ...obj }

  Object.keys(newObj).forEach(key => {
    if (!options.includes(key)) {
      delete newObj[key]
    }
  })

  return newObj
}
