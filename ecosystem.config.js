const port = process.env.PORT || 3005
const token = process.env.TELEGRAM_TOKEN || 'token'
module.exports = {
  apps: [
    {
      name: "producer",
      script: "dist/producer",
      env: {
        "PORT": port,
        "TELEGRAM_TOKEN": token,
      }
    },
  ]
}