const axios = require('axios');
const newman = require('newman');
const fs = require('fs').promises;
const path = require('path');

// Configurações
const config = {
    loginUrl: 'https://fap-clinic.stage.b2b.kompa.com.br/api/v1/auth/login',
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
        console.log('Realizando login...');
        const response = await axios.post(config.loginUrl, config.credentials);
        const token = response.data.user.auth_token;
        console.log('Login realizado com sucesso!');
        return token;
    } catch (error) {
        console.error('Erro ao fazer login:', error.response ? error.response.data : error.message);
        throw error;
    }
}

// Função para atualizar o arquivo de variáveis globais
async function updateGlobalVariables(token) {
    try {
        console.log('Atualizando variáveis globais...');
        const globalsContent = await fs.readFile(config.globalsPath, 'utf8');
        const globals = JSON.parse(globalsContent);
        
        // Atualiza o token
        const tokenVariable = globals.values.find(v => v.key === 'bearer_token');
        if (tokenVariable) {
            tokenVariable.value = token;
        } else {
            globals.values.push({
                key: 'bearer_token',
                value: token,
                type: 'any',
                enabled: true
            });
        }

        // Salva o arquivo atualizado
        await fs.writeFile(config.globalsPath, JSON.stringify(globals, null, 4));
        console.log('Variáveis globais atualizadas com sucesso!');
    } catch (error) {
        console.error('Erro ao atualizar variáveis globais:', error);
        throw error;
    }
}

// Função para executar as coleções
async function runCollections() {
    try {
        const collections = await fs.readdir(config.collectionsDir);
        const jsonCollections = collections.filter(file => file.endsWith('.json') && file !== 'workspace.postman_globals.json');

        for (const collection of jsonCollections) {
            console.log(`\nExecutando coleção: ${collection}`);
            const collectionPath = path.join(config.collectionsDir, collection);
            const reportPath = path.join(config.reportsDir, `${collection.replace('.json', '')}-report.html`);

            await new Promise((resolve, reject) => {
                newman.run({
                    collection: collectionPath,
                    globals: config.globalsPath,
                    reporters: ['cli', 'htmlextra'],
                    reporter: {
                        htmlextra: {
                            export: reportPath,
                            title: `Relatório - ${collection}`,
                            darkTheme: true
                        }
                    },
                    requestHeaders: {
                        'Authorization': 'Bearer {{bearer_token}}'
                    }
                }, (err) => {
                    if (err) {
                        console.error(`Erro ao executar coleção ${collection}:`, err);
                        reject(err);
                    } else {
                        console.log(`Coleção ${collection} executada com sucesso!`);
                        resolve();
                    }
                });
            });
        }
    } catch (error) {
        console.error('Erro ao executar coleções:', error);
        throw error;
    }
}

// Função principal
async function main() {
    try {
        // Garante que o diretório de relatórios existe
        await fs.mkdir(config.reportsDir, { recursive: true });

        // Faz login e obtém o token
        const token = await login();

        // Atualiza as variáveis globais com o novo token
        await updateGlobalVariables(token);

        // Executa as coleções
        await runCollections();

        console.log('\nProcesso concluído com sucesso!');
    } catch (error) {
        console.error('Erro no processo:', error);
        process.exit(1);
    }
}

// Executa o script
main(); 