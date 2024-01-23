# ToDO

## Domínio

- TODO Criar o entidade `Profile`
- TODO Inserir o campo `username` na entidade `User`

## Aplicação

- TODO Trocar os nomes do `HttpRequest.body` para `HttpRequest.data`
- TODO Trocar validação de corpo de requisição:

  ```typescript
    if (body.success == false) {
        const errors = body.error.issues.map((issue) => {
          return {
            path: issue.path[0],
            message: issue.message,
          };
        });

        return badRequest({
          error: "INVALID_REQUEST_BODY",
          expected: errors,
        });
      }
   ```

- TODO Criar rota `POST /api/v1/auth/` para receber apenas o access token
- TODO Inserir validação na rota `verify-email`

## Testes

- TODO Analisar e refatorar todos os resultados esperados

## Banco de dados

- TODO Mudar o campo `tags` na tabela `user` para a tabela `profile`.
