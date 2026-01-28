/*
  Warnings:

  - Added the required column `categoria` to the `Produto` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Produto" ADD COLUMN     "categoria" TEXT NOT NULL;
