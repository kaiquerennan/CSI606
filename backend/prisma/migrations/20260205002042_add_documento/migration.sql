/*
  Warnings:

  - Added the required column `documento` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "documento" TEXT NOT NULL;
