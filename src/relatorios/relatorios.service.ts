import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RelatoriosService {
  constructor(private prisma: PrismaService) {}

  async vendasPorCategoria(dias?: number) {
    let dataInicio: Date | undefined = undefined;
    let vendasPorCategoria: any[];

    if (dias) {
      dataInicio = new Date();
      dataInicio.setDate(dataInicio.getDate() - dias);

      vendasPorCategoria = await this.prisma.$queryRaw<any[]>`
        SELECT p.CATEGORIA as categoria, 
               SUM(iv.quantidade)::text as quantidade_vendidas
        FROM "itens_vendas" iv INNER JOIN "Produto" p
        ON iv."produtoId" = p.id 
        WHERE iv.data >=${dataInicio}
        GROUP BY p.CATEGORIA LIMIT 5
      `;
    } else {
      vendasPorCategoria = await this.prisma.$queryRaw<any[]>`
    SELECT p.CATEGORIA as categoria,
           SUM(iv.quantidade)::text as quantidade_vendidas
    FROM "itens_vendas" iv
    INNER JOIN "Produto" p ON iv."produtoId" = p.id
    GROUP BY p.CATEGORIA
    LIMIT 5
    `;
    }
    return vendasPorCategoria;
  }

  async frequencia(dias?) {
    const dataLimite = new Date();
    dataLimite.setDate(dataLimite.getDate() - dias);

    return await this.prisma.vendas.groupBy({
      by: ['usuarioId'],
      where: {
        data: {
          gte: dataLimite,
        },
      },
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      take: 5,
    });
  }
}
