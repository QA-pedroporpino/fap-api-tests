const axios = require('axios');
const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');
const newman = require('newman');

// Configurações
const API_URL = 'https://fap-clinic.stage.b2b.kompa.com.br';
const LOGIN_ENDPOINT = '/auth/login';
const GLOBALS_FILE = path.join(__dirname, 'api-tests/collections/workspace.postman_globals.json');
const COLLECTIONS_DIR = path.join(__dirname, 'api-tests/collections');

// Credenciais de login
const loginData = {
    email: "pedroporpino@id.uff.br",
    password: "fapclinica"
};

// Função para fazer login e obter o token
async function login() {
    try {
        console.log('Tentando fazer login com:', loginData);
        const response = await axios.post(`${API_URL}${LOGIN_ENDPOINT}`, loginData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log('Resposta do login:', response.data);
        return response.data.user.auth_token;
    } catch (error) {
        console.error('Erro ao fazer login:', error.message);
        if (error.response) {
            console.error('Detalhes do erro:', {
                status: error.response.status,
                data: error.response.data
            });
        }
        throw error;
    }
}

// Função para atualizar o arquivo de variáveis globais
function updateGlobalsFile(token) {
    try {
        const globals = {
            id: "e658d021-3996-4574-8261-2ccefc6c736c",
            values: [
                {
                    key: "bearer_token",
                    value: token,
                    type: "any",
                    enabled: true
                }
            ],
            name: "Globals",
            _postman_variable_scope: "globals",
            _postman_exported_at: new Date().toISOString(),
            _postman_exported_using: "Postman/11.46.4"
        };

        fs.writeFileSync(GLOBALS_FILE, JSON.stringify(globals, null, 4));
        console.log('Arquivo de variáveis globais atualizado com sucesso!');
    } catch (error) {
        console.error('Erro ao atualizar arquivo de variáveis globais:', error.message);
        throw error;
    }
}

// Função para executar uma coleção específica
function runCollection(collectionName) {
    return new Promise((resolve, reject) => {
        const collectionPath = path.join(COLLECTIONS_DIR, collectionName);
        console.log('Executando coleção:', collectionPath);

        newman.run({
            collection: require(collectionPath),
            globals: require(GLOBALS_FILE),
            reporters: ['cli']
        }, function (err) {
            if (err) {
                console.error('Erro ao executar coleção:', err);
                reject(err);
                return;
            }
            console.log('Coleção executada com sucesso!');
            resolve();
        });
    });
}

// Função para executar todas as coleções
async function runAllCollections() {
    try {
        const files = fs.readdirSync(COLLECTIONS_DIR);
        const collections = files.filter(file => file.endsWith('.postman_collection.json'));

        // Primeiro executa a coleção de login
        const loginCollection = collections.find(c => c.includes('auth-login'));
        if (loginCollection) {
            await runCollection(loginCollection);
        }

        // Depois executa as demais coleções
        for (const collection of collections) {
            if (!collection.includes('auth-login')) {
                await runCollection(collection);
            }
        }
    } catch (error) {
        console.error('Erro ao executar coleções:', error.message);
        throw error;
    }
}

// Função principal
async function main() {
    try {
        // Verifica se foi passado um argumento para coleção específica
        const specificCollection = process.argv[2];

        // Faz login e atualiza o token
        console.log('Fazendo login...');
        const token = await login();
        console.log('Login realizado com sucesso!');

        // Atualiza o arquivo de variáveis globais
        console.log('Atualizando variáveis globais...');
        updateGlobalsFile(token);

        // Executa as coleções
        if (specificCollection) {
            console.log(`Executando coleção específica: ${specificCollection}`);
            await runCollection(specificCollection);
        } else {
            console.log('Executando todas as coleções...');
            await runAllCollections();
        }

        console.log('Processo finalizado com sucesso!');
    } catch (error) {
        console.error('Erro no processo:', error.message);
        process.exit(1);
    }
}

// Executa o script
main(); 