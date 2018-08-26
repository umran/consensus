var randomBytes = require('crypto').randomBytes

function cleanup(arr) {
  for (var i = 0; i < arr.length; i++) arr[i] = 0
}

module.exports = function(x, n) {
  var i, v = randomBytes(n)
  for (i = 0; i < n; i++) x[i] = v[i]
  cleanup(v)
}
