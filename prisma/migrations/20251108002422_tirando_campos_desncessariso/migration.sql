/*
  Warnings:

  - You are about to drop the column `atualizadoEm` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the column `criadoEm` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the column `senha` on the `Usuario` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Vendas" DROP CONSTRAINT "Vendas_usuarioId_fkey";

-- AlterTable
ALTER TABLE "Usuario" DROP COLUMN "atualizadoEm",
DROP COLUMN "criadoEm",
DROP COLUMN "senha";
