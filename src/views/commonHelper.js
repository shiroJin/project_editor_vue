function makeUpdateInfo (orig, dest) {
  let result = {}
  Object.keys(orig).forEach(key => {
    if (dest.hasOwnProperty(key)) {
      if (orig[key] != dest[key]) {
        result[key] = dest[key]
      }
    }
  })
  return result
}

export {
  makeUpdateInfo
}
