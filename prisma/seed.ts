import { PrismaClient } from '../generated/prisma'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import { fakerPT_BR as faker } from '@faker-js/faker'
import * as bcrypt from 'bcrypt'

const connectionString = process.env.DATABASE_URL
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Iniciando o seed...')

  // Limpa tudo na ordem correta (evita erro de FK)
  await prisma.itensVendas.deleteMany()
  await prisma.vendas.deleteMany()
  await prisma.usuario.deleteMany()
  await prisma.produto.deleteMany()

  // =============================
  // 1. Criar Usuários
  // =============================
  console.log('👤 Criando usuários...')
  const usuariosIds: number[] = []

  for (let i = 0; i < 300; i++) {
    const usuario = await prisma.usuario.create({
      data: {
        nome: faker.person.fullName(),
        email: `${faker.internet.username()}.${i}.${Date.now()}@example.com`.toLowerCase(),
        ativo: Math.random() < 0.7,
      },
    })

    usuariosIds.push(usuario.id)
  }

  // Usuário de teste com senha
  const hashed = await bcrypt.hash('123456', 10)
  const testUser = await prisma.usuario.create({
    data: {
      nome: 'Usuário Teste',
      email: 'teste@example.com',
      senha: hashed,
      ativo: true,
    },
  })

  usuariosIds.push(testUser.id)
  console.log(`Usuário de teste criado: teste@example.com / 123456 (ID: ${testUser.id})`)

  // =============================
  // 2. Criar Produtos
  // =============================
  console.log('📦 Criando produtos...')
  const produtosIds: number[] = []

  for (let i = 0; i < 200; i++) {
    const produto = await prisma.produto.create({
      data: {
        descricao: faker.commerce.productName(),
        preco: parseFloat(faker.commerce.price({ min: 5, max: 200 })),
        grupo: faker.commerce.department(),
        estoque: faker.number.float({ min: 0, max: 100, multipleOf: 0.01 }),
        ativo: Math.random() < 0.8,
        categoria: faker.commerce.department(),
      },
    })

    produtosIds.push(produto.id)
  }

  // =============================
  // 3. Criar Vendas + Itens
  // =============================
  console.log('💰 Criando vendas com itens...')

  for (let i = 0; i < 400; i++) {
    const randomUser =
      usuariosIds[Math.floor(Math.random() * usuariosIds.length)]

    const vendaCriada = await prisma.vendas.create({
      data: {
        valor: 0, // vamos atualizar depois do cálculo dos itens
        data: faker.date.recent({ days: 365 }),
        usuarioId: randomUser,
      },
    })

    let valorTotalDaVenda = 0

    // Criar entre 1 e 5 itens
    const qtdItens = faker.number.int({ min: 1, max: 5 })

    for (let j = 0; j < qtdItens; j++) {
      const produtoId =
        produtosIds[Math.floor(Math.random() * produtosIds.length)]

      const produto = await prisma.produto.findUnique({
        where: { id: produtoId },
      })

      if (!produto) continue

      const quantidade = faker.number.int({ min: 1, max: 10 })
      const valorUnitario = Number(produto.preco)
      const valorItem = quantidade * valorUnitario

      valorTotalDaVenda += valorItem

      await prisma.itensVendas.create({
        data: {
          vendaId: vendaCriada.id,
          produtoId,
          quantidade,
          valorUnitario,
          valorTotal: valorItem,
        },
      })
    }

    // Atualiza valor total da venda
    await prisma.vendas.update({
      where: { id: vendaCriada.id },
      data: {
        valor: valorTotalDaVenda,
      },
    })
  }

  console.log('✅ Seed finalizado com sucesso!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
