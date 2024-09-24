const path = require('path');

module.exports = {
  entry: {
    telepath: {
      import: ["./client/index.js"],
      filename: "telepath_forms/static/telepath_forms/js/telepath-forms.js",
    }
  },
  output: {
    path: path.resolve('.'),
  }
}
