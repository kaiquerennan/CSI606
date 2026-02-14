import { PrismaClient } from '../generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🔐 Criando administrador padrão...');

  const senhaHash = await bcrypt.hash('admin123', 10);

  const admin = await prisma.administrador.upsert({
    where: { email: 'admin@salespro.com' },
    update: {},
    create: {
      nome: 'Administrador',
      email: 'admin@salespro.com',
      senha: senhaHash,
      ativo: true,
    },
  });

  console.log('✅ Administrador criado:', admin.email);
  console.log('   Senha: admin123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
