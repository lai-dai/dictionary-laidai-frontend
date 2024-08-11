export function isObjectEquals(
  obj1: Record<string, any>,
  obj2: Record<string, any>
) {
  if (!obj1 || !obj2) return false

  let result: boolean = true
  const keys = Object.keys(obj1)

  for (let i = 0; i < keys.length; i++) {
    if (obj1[keys[i]] !== obj2[keys[i]]) {
      result = false
      break
    }
  }

  return result
}
