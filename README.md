# API Tests

Este repositório contém testes automatizados para as APIs do FAP Clinic.

## Estrutura do Projeto

```
.
├── api-tests/
│   ├── collections/     # Coleções do Postman
│   └── reports/         # Relatórios de teste
├── .github/
│   └── workflows/       # Configurações do GitHub Actions
└── README.md
```

## Coleções de Teste

- **Managers API**: Testes para o endpoint `/api/v1/managers`
- **Profiles API**: Testes para o endpoint `/api/v1/profiles`

## Executando os Testes Localmente

1. Instale o Newman globalmente:
```bash
npm install -g newman newman-reporter-htmlextra
```

2. Execute os testes:
```bash
# Executar todos os testes
.\run-tests.ps1

# Ou executar coleções individualmente
newman run api-tests/collections/-api-v1-managers.postman_collection.json
newman run api-tests/collections/-api-v1-profiles.postman_collection.json
```

## GitHub Actions

Os testes são executados automaticamente:
- Em cada push para a branch `main`
- Em cada Pull Request para a branch `main`
- Manualmente através do botão "Run workflow" no GitHub

Os relatórios de teste são gerados como artifacts e podem ser baixados da página de Actions do GitHub.

## Relatórios

Os relatórios HTML são gerados após cada execução dos testes e incluem:
- Status de cada requisição
- Tempo de resposta
- Resultados dos testes
- Dados enviados e recebidos
- Gráficos e estatísticas 