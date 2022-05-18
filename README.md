# Aplicação de Teste Backend:: Growth Hackers

### Pré-requisitos
Na raiz do projeto primeiramente deve-se executar:
> docker-compose up -d
> 
> yarn install

Com isso será criado o banco de dados, e a instalação das dependências do projeto.


### Para rodar o projeto em ambiente de `produção`:
> yarn run build
> 
> yarn run migrations:run-prod
> 
> yarn run start:prod

### Para rodar o projeto em ambiente de `desenvolvimento`:
> yarn run migrations:run-development
>
> yarn run start:dev

### Para rodar os testes:
> yarn run migrations:run-test
> 
> yarn run test:e2e


#### Observações:
Os arquivos de envs estão versionados apenas para demonstração.
