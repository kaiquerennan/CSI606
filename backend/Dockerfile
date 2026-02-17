# ---- Build Stage ----
FROM node:20-alpine AS builder

WORKDIR /app

# Copia os arquivos de dependências
COPY package.json package-lock.json ./

# Instala dependências
RUN npm ci

# Copia todo o código fonte
COPY . .

# Gera o Prisma Client (DATABASE_URL fictícia só para gerar o client, não conecta ao banco)
RUN DATABASE_URL="postgresql://user:pass@localhost:5432/db" npx prisma generate

# Build do NestJS
RUN npm run build

# ---- Production Stage ----
FROM node:20-alpine AS runner

WORKDIR /app

# Copia dependências e build do stage anterior
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/generated ./generated
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder /app/tsconfig.json ./tsconfig.json

EXPOSE 3334

CMD ["node", "dist/main"]
