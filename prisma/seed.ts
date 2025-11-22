// prisma/seed.ts
import { PrismaClient } from '../generated/prisma';
import { fakerPT_BR as faker } from '@faker-js/faker'; // Usando português do Brasil

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando o seed...');

  // Opcional: Limpar tabelas antes de criar (Cuidado em produção!)
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
      },
    });
    usuariosIds.push(usuario.id);
  }

  // --- 2. Criar Vendas ---
  console.log('💰 Criando vendas...');

  for (let i = 0; i < 1000; i++) {
    // Escolhe um ID de usuário aleatório da lista que criamos acima
    const randomUserId =
      usuariosIds[Math.floor(Math.random() * usuariosIds.length)];

    await prisma.vendas.create({
      data: {
        valor: parseFloat(faker.commerce.price({ min: 10, max: 500 })),
        data: faker.date.recent({ days: 60 }), // Vendas dos últimos 60 dias
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
