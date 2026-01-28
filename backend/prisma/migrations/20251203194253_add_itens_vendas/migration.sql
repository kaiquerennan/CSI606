-- AddForeignKey
ALTER TABLE "itens_vendas" ADD CONSTRAINT "itens_vendas_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
