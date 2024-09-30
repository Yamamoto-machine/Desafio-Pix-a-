# Desafio-Pix-aí
# Clone o repositório
git clone https://github.com/Yamamoto-machine/Desafio-Pix-a-

# Acesse a pasta do projeto
cd Pedro Pix AI

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Preencha o arquivo .env com as informações corretas (e.g., tokens de API, variáveis de banco de dados)

# Execute as migrações do banco de dados
npx sequelize db:migrate

# Inicie a aplicação
npm start
