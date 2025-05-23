const axios = require('axios');
const newman = require('newman');
const fs = require('fs').promises;
const path = require('path');

// Configurações
const config = {
    loginUrl: 'https://fap-clinic.stage.b2b.kompa.com.br/auth/login',
    credentials: {
        email: 'pedroporpino@id.uff.br',
        password: 'fapclinica'
    },
    globalsPath: path.join(__dirname, 'collections', 'workspace.postman_globals.json'),
    collectionsDir: path.join(__dirname, 'collections'),
    reportsDir: path.join(__dirname, 'reports')
};

// Função para fazer login e obter o token
async function login() {
    try {
        console.log('Fazendo login...');
        console.log('Tentando fazer login com:', config.credentials);
        
        const loginData = {
            email: config.credentials.email,
            password: config.credentials.password
        };
        
        console.log('Dados de login formatados:', JSON.stringify(loginData, null, 2));
        
        const response = await axios.post(config.loginUrl, loginData, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'User-Agent': 'PostmanRuntime/7.32.3',
                'Connection': 'keep-alive',
                'Origin': 'https://fap-clinic.stage.b2b.kompa.com.br',
                'Referer': 'https://fap-clinic.stage.b2b.kompa.com.br/',
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'
            },
            validateStatus: function (status) {
                return status < 500; // Aceita qualquer status menor que 500 para debug
            }
        });
        
        console.log('Status da resposta:', response.status);
        console.log('Headers da resposta:', JSON.stringify(response.headers, null, 2));
        console.log('Resposta do login:', JSON.stringify(response.data, null, 2));
        
        if (response.status !== 200) {
            throw new Error(`Login falhou com status ${response.status}: ${JSON.stringify(response.data)}`);
        }
        
        const token = response.data.user.auth_token;
        if (!token) {
            throw new Error('Token não encontrado na resposta');
        }
        
        console.log('Token obtido:', token);
        console.log('Login realizado com sucesso!');
        return token;
    } catch (error) {
        console.error('Erro ao fazer login:', error.response ? error.response.data : error.message);
        if (error.response) {
            console.error('Status do erro:', error.response.status);
            console.error('Headers do erro:', JSON.stringify(error.response.headers, null, 2));
        }
        throw error;
    }
}

// Função para atualizar o arquivo de variáveis globais
async function updateGlobalVariables(token) {
    try {
        console.log('Atualizando variáveis globais...');
        const globalsPath = path.join(__dirname, 'collections', 'workspace.postman_globals.json');
        console.log('Caminho do arquivo de globals:', globalsPath);
        
        const globalsContent = await fs.readFile(globalsPath, 'utf8');
        console.log('Conteúdo atual do arquivo de globals:', globalsContent);
        
        const globals = JSON.parse(globalsContent);
        
        // Atualiza o token
        const tokenVariable = globals.values.find(v => v.key === 'bearer_token');
        if (tokenVariable) {
            console.log('Token anterior:', tokenVariable.value);
            tokenVariable.value = token;
            console.log('Token atualizado:', tokenVariable.value);
        } else {
            console.log('Variável bearer_token não encontrada, criando nova...');
            globals.values.push({
                key: 'bearer_token',
                value: token,
                type: 'any',
                enabled: true
            });
        }

        // Salva o arquivo atualizado
        const updatedContent = JSON.stringify(globals, null, 4);
        console.log('Novo conteúdo do arquivo de globals:', updatedContent);
        await fs.writeFile(globalsPath, updatedContent);
        console.log('Arquivo de variáveis globais atualizado com sucesso!');
    } catch (error) {
        console.error('Erro ao atualizar variáveis globais:', error);
        throw error;
    }
}

// Função para injetar o prerequest script global na coleção
async function injectGlobalPrerequestScript(collectionPath) {
    try {
        console.log('Injetando prerequest script global na coleção...');
        const collectionContent = await fs.readFile(collectionPath, 'utf8');
        const collection = JSON.parse(collectionContent);

        // Cria o prerequest script global
        const prerequestScript = {
            exec: [
                "// Script global para adicionar o token de autorização",
                "const token = pm.globals.get('bearer_token');",
                "if (!token) {",
                "    console.error('Token não encontrado nas variáveis globais');",
                "    return;",
                "}",
                "pm.request.headers.add({",
                "    key: 'Authorization',",
                "    value: `Bearer ${token}`",
                "});",
                "console.log('Token adicionado ao header:', token);"
            ],
            type: "text/javascript"
        };

        // Adiciona o prerequest script global à coleção
        if (!collection.event) {
            collection.event = [];
        }

        // Verifica se já existe um prerequest script global
        const existingPrerequest = collection.event.find(e => e.listen === 'prerequest');
        if (existingPrerequest) {
            existingPrerequest.script = prerequestScript;
        } else {
            collection.event.push({
                listen: 'prerequest',
                script: prerequestScript
            });
        }

        // Salva a coleção atualizada
        await fs.writeFile(collectionPath, JSON.stringify(collection, null, 2));
        console.log('Prerequest script global injetado com sucesso!');
    } catch (error) {
        console.error('Erro ao injetar prerequest script:', error);
        throw error;
    }
}

// Função para executar uma coleção específica
async function runCollection(collectionName) {
    try {
        console.log(`Executando coleção específica: ${collectionName}`);
        const collectionPath = path.join(__dirname, 'collections', collectionName);
        console.log(`Caminho da coleção: ${collectionPath}`);
        
        // Verifica se a coleção existe
        try {
            await fs.access(collectionPath);
        } catch (error) {
            throw new Error(`Coleção não encontrada: ${collectionPath}`);
        }

        // Injeta o prerequest script global
        await injectGlobalPrerequestScript(collectionPath);
        
        const reportPath = path.join(__dirname, 'reports', `${collectionName.replace('.json', '')}-report.html`);
        console.log(`Caminho do relatório: ${reportPath}`);

        // Lê o token atual do arquivo de globals
        const globalsPath = path.join(__dirname, 'collections', 'workspace.postman_globals.json');
        const globalsContent = await fs.readFile(globalsPath, 'utf8');
        const globals = JSON.parse(globalsContent);
        const token = globals.values.find(v => v.key === 'bearer_token').value;
        console.log('Token que será usado nas requisições:', token);

        await new Promise((resolve, reject) => {
            newman.run({
                collection: collectionPath,
                globals: globalsPath,
                reporters: ['cli', 'htmlextra'],
                reporter: {
                    htmlextra: {
                        export: reportPath,
                        title: `Relatório - ${collectionName}`,
                        darkTheme: true
                    }
                },
                // Habilita logs detalhados
                verbose: true,
                // Configura o timeout
                timeout: 60000,
                // Configura o retry
                retryOnFailure: true,
                retryCount: 3,
                retryDelay: 1000
            }, (err) => {
                if (err) {
                    console.error(`Erro ao executar coleção ${collectionName}:`, err);
                    reject(err);
                } else {
                    console.log(`Coleção ${collectionName} executada com sucesso!`);
                    resolve();
                }
            });
        });
    } catch (error) {
        console.error('Erro ao executar coleção:', error);
        throw error;
    }
}

// Função principal
async function main() {
    try {
        // Pega o nome da coleção dos argumentos da linha de comando
        const collectionName = process.argv[2];
        if (!collectionName) {
            throw new Error('Por favor, forneça o nome da coleção como argumento');
        }

        // Garante que o diretório de relatórios existe
        await fs.mkdir(config.reportsDir, { recursive: true });

        // Faz login e obtém o token
        const token = await login();

        // Atualiza as variáveis globais com o novo token
        await updateGlobalVariables(token);

        // Executa a coleção específica
        await runCollection(collectionName);

        console.log('Processo finalizado com sucesso!');
    } catch (error) {
        console.error('Erro no processo:', error);
        process.exit(1);
    }
}

// Executa o script
main(); 