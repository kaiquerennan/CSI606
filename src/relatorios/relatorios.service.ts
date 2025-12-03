import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'


@Injectable()

  export class RelatoriosService {
    constructor(private prisma: PrismaService){}

    async vendasPorCategoria() {
      const vendasPorCategoria = await this.prisma.$queryRaw<any[]>`
        SELECT p.CATEGORIA as categoria, 
               SUM(iv.quantidade)::text as quantidade_vendidas
        FROM "itens_vendas" iv INNER JOIN "Produto" p
        ON iv."produtoId" = p.id GROUP BY p.CATEGORIA LIMIT 5
      `;

      return vendasPorCategoria
    }
  }
