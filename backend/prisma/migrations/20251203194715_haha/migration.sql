/*
  Warnings:

  - You are about to alter the column `quantidade` on the `itens_vendas` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to alter the column `valorUnitario` on the `itens_vendas` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to alter the column `valorTotal` on the `itens_vendas` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.

*/
-- AlterTable
ALTER TABLE "itens_vendas" ALTER COLUMN "quantidade" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "valorUnitario" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "valorTotal" SET DATA TYPE DECIMAL(10,2);
