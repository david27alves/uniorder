// monitorFolder.js
import chokidar from 'chokidar';
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { Readable } from 'stream'; // Necessário para simular stream para csv-parser de string

// --- Configurações ---
const INPUT_FOLDER = './input_files'; // Pasta a ser monitorada (crie esta pasta na raiz do seu projeto)
const ALLOWED_EXTENSIONS = ['.csv', '.txt']; // Extensões de arquivo permitidas

/**
 * Função para converter o conteúdo de um arquivo CSV/TXT para JSON.
 * @param {string} filePath - O caminho completo do arquivo.
 * @returns {Promise<Array<Object>>} - Uma promessa que resolve com os dados JSON.
 */
async function convertFileToJson(filePath) {
    return new Promise((resolve, reject) => {
        const results = [];
        const fileContent = fs.readFileSync(filePath, 'utf8'); // Lê o arquivo de forma síncrona para simplificar

        // Cria uma stream legível a partir da string para o csv-parser
        const s = new Readable();
        s.push(fileContent);
        s.push(null); // Indica o fim da stream

        // Detecta o delimitador com base na extensão ou conteúdo (aqui, assumimos ';')
        // Para um sistema mais robusto, você pode tentar detectar o delimitador
        // ou ter uma configuração por tipo de arquivo.
        // Com base no seu problema anterior, assumimos ';'
        const options = { separator: ';' };

        s.pipe(csv(options))
            .on('data', (data) => results.push(data))
            .on('end', () => {
                resolve(results);
            })
            .on('error', (err) => {
                reject(err);
            });
    });
}

/**
 * Função principal para iniciar o monitoramento da pasta.
 */
async function startFileMonitor() {
    console.log(`Iniciando monitoramento da pasta: ${INPUT_FOLDER}`);

    // Cria a pasta de entrada se ela não existir
    if (!fs.existsSync(INPUT_FOLDER)) {
        fs.mkdirSync(INPUT_FOLDER, { recursive: true });
        console.log(`Pasta '${INPUT_FOLDER}' criada.`);
    }

    // Inicializa o watcher com chokidar
    const watcher = chokidar.watch(INPUT_FOLDER, {
        ignored: /(^|[\/\\])\../, // Ignora arquivos e pastas ocultas
        persistent: true,
        //ignoreInitial: true // Não dispara eventos para arquivos que já existem na pasta ao iniciar
    });

    // Evento 'add' é disparado quando um novo arquivo é adicionado
    watcher.on('add', async (filePath) => {
        const fileName = path.basename(filePath);
        const fileExtension = path.extname(fileName).toLowerCase();

        console.log(`Novo arquivo detectado: ${fileName}`);

        if (!ALLOWED_EXTENSIONS.includes(fileExtension)) {
            console.log(`Arquivo '${fileName}' ignorado: Extensão '${fileExtension}' não permitida.`);
            return;
        }

        console.log(`Processando arquivo: ${fileName}`);

        try {
            // Converte o arquivo para JSON
            const jsonData = await convertFileToJson(filePath);
            console.log(`Conteúdo de '${fileName}' convertido para JSON:`);
            console.log(JSON.stringify(jsonData, null, 2)); // Exibe o JSON no console

            // Apaga o arquivo original após a conversão bem-sucedida
            fs.unlinkSync(filePath);
            console.log(`Arquivo original '${fileName}' apagado com sucesso.`);

            // Aqui você pode fazer algo com o jsonData, como:
            // - Enviar para um banco de dados
            // - Enviar para outra API
            // - Armazenar em algum lugar
            // Por exemplo, retornar o jsonData para uma função chamadora,
            // ou emitir um evento se este script for parte de um sistema maior.
            return jsonData; // Retorna o JSON (se este for um módulo importado)

        } catch (error) {
            console.error(`Erro ao processar o arquivo '${fileName}':`, error);
            // Em caso de erro, o arquivo não é apagado para permitir depuração.
        }
    });

    watcher.on('error', (error) => console.error(`Erro no watcher: ${error}`));
    watcher.on('ready', () => console.log('Monitoramento de arquivos pronto e aguardando...'));
}

// Inicia o monitoramento
startFileMonitor();
