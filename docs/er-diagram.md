# Diagrama de Entidade-Relacionamento

> Revisado contra as entidades atuais em `backend/src/modules/**/entities/*.entity.ts`
> (inclui `Usuario`, usada só para autenticação — sem relação com o domínio de negócio).

```mermaid
erDiagram
    PRODUTOR ||--o{ PROPRIEDADE : possui
    PROPRIEDADE ||--o{ CULTURA_PLANTADA : tem
    SAFRA ||--o{ CULTURA_PLANTADA : referencia
    CULTURA ||--o{ CULTURA_PLANTADA : referencia

    PRODUTOR {
        uuid id PK
        string cpfCnpj
        string nome
    }

    PROPRIEDADE {
        uuid id PK
        uuid produtorId FK
        string nome
        string cidade
        string estado
        numeric areaTotal
        numeric areaAgricultavel
        numeric areaVegetacao
    }

    SAFRA {
        uuid id PK
        string nome
    }

    CULTURA {
        uuid id PK
        string nome
    }

    CULTURA_PLANTADA {
        uuid id PK
        uuid propriedadeId FK
        uuid safraId FK
        uuid culturaId FK
    }

    USUARIO {
        uuid id PK
        string email
        string passwordHash
        string nome
    }
```

`USUARIO` é isolada de propósito — existe só para o login (JWT), sem chave estrangeira
para o restante do domínio (produtores/propriedades não pertencem a um usuário).
