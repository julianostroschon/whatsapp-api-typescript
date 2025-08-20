module.exports = {
  apps: [
    {
      name: 'producer',
      script: '/dist/producer',
      cwd: __dirname,
      interpreter: 'node',
      env_file: __dirname + '/.env',
    },
  ],
}