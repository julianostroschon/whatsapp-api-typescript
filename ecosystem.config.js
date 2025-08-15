module.exports = {
  apps: [
    {
      name: 'producer',
      script: __dirname + './dist/producer', // Caminho para o seu arquivo compilado
      interpreter: 'node',
      // Você pode usar o env_file ou referenciar as variáveis diretamente.
      // Opção 1: Usar um arquivo .env
      env_file: '.env', // PM2 vai procurar por este arquivo na raiz do projeto
      // Opção 2: Definir as variáveis diretamente
      // env: {
      //   NODE_ENV: 'development',
      //   VARIAVEL_A: 'valor_a',
      //   VARIAVEL_B: 'valor_b',
      // },
      // Opção 3: Usar arquivos de ambiente diferentes para cada ambiente
      // env_production: {
      //   NODE_ENV: 'production',
      //   PORT: 80,
      // },
    },
  ],
}