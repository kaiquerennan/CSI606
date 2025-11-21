# Dockerfile para desenvolvimento
FROM node:20
WORKDIR /usr/src/app

# Copiar package.json e instalar dependências
COPY package*.json ./
RUN npm install

# Copiar arquivos da aplicação
COPY . .

# Gerar Prisma Client
RUN npx prisma generate

# Expor porta
EXPOSE 3000

# Comando para desenvolvimento
CMD ["npm", "run", "start:dev"]
