/**
 * @param  {Array} options Ex: ['student', 'teacher']
 * @param  {String} key Ex: 'role'
 * @param  {Array} items
 * Ex: [
 * {name: 'hung', role: 'student'},
 * {name: 'khanh', role: 'student'},
 * {name: 'dung', role: 'teacher'}
 * ]
 * @returns {Object} Ex: {teacher: 1, student: 2}
 */
export function countDistinctKey(options, key, items) {
  const result = {}

  options.forEach(item => {
    result[item] = 0
  })

  items.forEach(item => {
    result[item[key]] += item.result
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
