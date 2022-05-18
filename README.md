# Aplicação de Teste Backend:: Growth Hackers

## Pré-requisitos
Na raiz do projeto primeiramente deve-se executar:
> docker-compose up -d

Com isso será criado o banco de dados PostGres necessário para rodar a aplicação.

#### Para instalação das dependências
> yarn install

#### Para rodar o projeto em ambiente de `desenvolvimento`:
> yarn run migrations:run-development
> 
> yarn run start:dev

#### Para rodar o projeto em ambiente de `produção`:
> yarn run build
> 
> yarn run migrations:run-prod
> 
> yarn run start:prod

#### Para rodar os testes:
> yarn run migrations:run-test
> 
> yarn run test:e2e
