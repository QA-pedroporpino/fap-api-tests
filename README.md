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
│   │   ├── -auth-login-.postman_collection.json
│   │   ├── -api-v1-certificates.postman_collection.json
│   │   ├── -api-v1-clients.postman_collection.json
│   │   ├── -api-v1-clinics.postman_collection.json
│   │   ├── -api-v1-exams.postman_collection.json
│   │   ├── -api-v1-exams_prices.postman_collection.json
│   │   ├── -api-v1-health.postman_collection.json
│   │   ├── -api-v1-holidays.postman_collection.json
│   │   ├── -api-v1-managers.postman_collection.json
│   │   ├── -api-v1-profiles.postman_collection.json
│   │   ├── -api-v1-professionals.postman_collection.json
│   │   ├── -api-v1-schedules.postman_collection.json
│   │   ├── -api-v1-speciality_prices.postman_collection.json
│   │   ├── -api-v1-specialties.postman_collection.json
│   │   ├── -api-v1-table_prices.postman_collection.json
│   │   └── workspace.postman_globals.json
│   ├── environments/
│   ├── reports/
│   ├── run-tests.js
│   └── run-collections.js
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
npm install
```

## Executando os Testes

### Localmente

Para executar todos os testes localmente, use o script PowerShell:

```powershell
.\run-all-tests.ps1
```

Este script irá:
1. Executar o login usando `run-tests.js` para obter um token de autenticação
2. Atualizar o arquivo de variáveis globais com o novo token
3. Executar todas as coleções de testes usando o token atualizado
4. Gerar relatórios HTML individuais para cada coleção
5. Salvar os relatórios em `api-tests/reports/`

Para executar uma coleção específica:

```bash
node api-tests/run-tests.js "nome-da-colecao.postman_collection.json"
```

### Gerenciamento de Token

O sistema utiliza um token de autenticação que é:
1. Obtido automaticamente através do processo de login
2. Armazenado no arquivo `workspace.postman_globals.json`
3. Injetado automaticamente em todas as requisições através do script de pré-request

Cada coleção inclui um script de pré-request que:
- Verifica a existência do token nas variáveis globais
- Adiciona o header de autorização com o token
- Exibe um aviso se o token não estiver disponível

### No GitHub Actions

Os testes são executados automaticamente:
- Em cada push para a branch `main`
- Em cada pull request para a branch `main`
- Manualmente através do workflow dispatch

O workflow irá:
1. Configurar o ambiente Node.js
2. Instalar as dependências necessárias
3. Executar o processo de login para obter o token
4. Executar todas as coleções de testes
5. Gerar relatórios HTML para cada coleção
6. Fazer upload dos relatórios como artefatos do GitHub Actions

Os relatórios podem ser baixados na aba "Artifacts" de cada execução do workflow.

## Coleções de Testes

O projeto inclui as seguintes coleções de testes:

- Authentication Tests
- Certificates API Tests
- Clients API Tests
- Clinics API Tests
- Exams API Tests
- Exams Prices API Tests
- Health API Tests
- Holidays API Tests
- Managers API Tests
- Profiles API Tests
- Professionals API Tests
- Schedules API Tests
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