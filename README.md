# FAP API Tests

Este repositório contém testes automatizados para as APIs do sistema FAP, utilizando Postman e Newman para execução.

## Estrutura do Projeto

```
.
├── .github/
│   └── workflows/
│       └── api-tests.yml
├── api-tests/
│   ├── collections/
│   │   ├── -api-v1-clinics.postman_collection.json
│   │   ├── -api-v1-managers.postman_collection.json
│   │   ├── -api-v1-profiles.postman_collection.json
│   │   ├── -api-v1-speciality_prices.postman_collection.json
│   │   ├── -api-v1-specialties.postman_collection.json
│   │   └── -api-v1-table_prices.postman_collection.json
│   └── reports/
└── run-all-tests.ps1
```

## Pré-requisitos

- Node.js 18 ou superior
- npm (Node Package Manager)
- Newman CLI
- PowerShell (para execução local)

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/QA-pedroporpino/fap-api-tests.git
cd fap-api-tests
```

2. Instale as dependências:
```bash
npm install -g newman newman-reporter-htmlextra
```

## Executando os Testes

### Localmente

Para executar todos os testes localmente, use o script PowerShell:

```powershell
.\run-all-tests.ps1
```

Este script irá:
- Executar todas as coleções de testes
- Gerar relatórios HTML individuais para cada coleção
- Salvar os relatórios em `api-tests/reports/`

### No GitHub Actions

Os testes são executados automaticamente:
- Em cada push para a branch `main`
- Em cada pull request para a branch `main`
- Manualmente através do workflow dispatch

O workflow irá:
1. Configurar o ambiente Node.js
2. Instalar as dependências necessárias
3. Executar todas as coleções de testes
4. Gerar relatórios HTML para cada coleção
5. Fazer upload dos relatórios como artefatos do GitHub Actions

Os relatórios podem ser baixados na aba "Artifacts" de cada execução do workflow.

## Coleções de Testes

O projeto inclui as seguintes coleções de testes:

- Clinics API Tests
- Managers API Tests
- Profiles API Tests
- Speciality Prices API Tests
- Specialties API Tests
- Table Prices API Tests

## Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. 