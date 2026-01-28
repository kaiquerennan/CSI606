-- CreateTable
CREATE TABLE "itens_vendas" (
    "id" SERIAL NOT NULL,
    "vendaId" INTEGER NOT NULL,
    "produtoId" INTEGER NOT NULL,
    "quantidade" DECIMAL(65,30) NOT NULL,
    "valorUnitario" DECIMAL(65,30) NOT NULL,
    "valorTotal" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "itens_vendas_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "itens_vendas" ADD CONSTRAINT "itens_vendas_vendaId_fkey" FOREIGN KEY ("vendaId") REFERENCES "Vendas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
