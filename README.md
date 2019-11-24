# b3-companies

Resgata dados das empresas listadas da [B3](http://www.b3.com.br/pt_br/produtos-e-servicos/negociacao/renda-variavel/empresas-listadas.htm) e adiciona alguns dados do site [Fundamentus](https://www.fundamentus.com.br) para análise das ações.

## Desenvolvimento

```bash
yarn install
yarn start
```

Após iniciar o express, acessar:

http://localhost:4000/companies

## Produção

```bash
yarn run build
```

## TODO

- [x] Adicionar MySQL para salvar dados
- [x] Criar histórico de preços dos ativos
