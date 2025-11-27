// prisma/seed.ts
import { PrismaClient } from '../generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { fakerPT_BR as faker } from '@faker-js/faker'; // Usando português do Brasil
import * as bcrypt from 'bcrypt';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Iniciando o seed...');

  // Opcional: Limpar tabelas antes de criar
  await prisma.vendas.deleteMany();
  await prisma.usuario.deleteMany();
  await prisma.produto.deleteMany();

  // --- 1. Criar Usuários ---
  console.log('👤 Criando usuários...');
  const usuariosIds: number[] = [];

  for (let i = 0; i < 3000; i++) {
    const usuario = await prisma.usuario.create({
      data: {
        nome: faker.person.fullName(),
        // Gera e-mail único usando timestamp e número sequencial
        email:
          `${faker.internet.username()}.${i}.${Date.now()}@example.com`.toLowerCase(),
        ativo: Math.random() < 0.7,
      },
    });
    usuariosIds.push(usuario.id);
  }

  // Criar usuário de teste com senha
  const hashedPassword = await bcrypt.hash('123456', 10);
  const testUser = await prisma.usuario.create({
    data: {
      nome: 'Usuário Teste',
      email: 'teste@example.com',
      senha: hashedPassword,
      ativo: true,
    },
  });
  usuariosIds.push(testUser.id);
  console.log('Usuário de teste criado: teste@example.com / 123456');
  console.log(`ID do usuário teste: ${testUser.id}`);

  // --- 2. Criar Vendas ---
  console.log('💰 Criando vendas...');

  for (let i = 0; i < 1000; i++) {
    // Escolhe um ID de usuário aleatório da lista que criamos acima
    const randomUserId =
      usuariosIds[Math.floor(Math.random() * usuariosIds.length)];

    await prisma.vendas.create({
      data: {
        valor: parseFloat(faker.commerce.price({ min: 10, max: 500 })),
        data: faker.date.recent({ days: 365 }), // Vendas dos últimos 60 dias
        usuarioId: randomUserId,
      },
    });
  }

  // --- 3. Criar Produtos ---
  console.log('📦 Criando produtos...');

  for (let i = 0; i < 100; i++) {
    await prisma.produto.create({
      data: {
        descricao: faker.commerce.productName(),
        preco: parseFloat(faker.commerce.price({ min: 5, max: 200 })),
        grupo: faker.commerce.department(),
        estoque: parseFloat(
          faker.number.float({ min: 0, max: 100, multipleOf: 0.01 }).toFixed(2),
        ),
        ativo: Math.random() < 0.7,
      },
    });
  }

  console.log('✅ Seed finalizado com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
