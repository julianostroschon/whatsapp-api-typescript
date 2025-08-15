const path = require("node:path")

const port = process.env.PORT || 3005
const token = process.env.TELEGRAM_TOKEN || 'token'
module.exports = {
  apps: [
    {
      name: "producer",
      script: path.join(__dirname, "dist/producer"),
      env: {
        "PORT": port,
        "TELEGRAM_TOKEN": token,
      }
    },
  ]
}