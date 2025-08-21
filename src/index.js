// monitorFolder.js
import chokidar from 'chokidar';
import fs from 'fs';
import path from 'path';
import { addProductIdToOrders, convertTextToJson } from './utils/utils.js';
import { createOrder, getProductSupplier } from './controllers/orders.js';

// --- Configurações ---
const INPUT_FOLDER = './input_files'; // Pasta a ser monitorada (crie esta pasta na raiz do seu projeto)
const ALLOWED_EXTENSIONS = ['.csv', '.txt']; // Extensões de arquivo permitidas

// async function convertFileToJson(filePath) {
//     return new Promise((resolve, reject) => {
//         const results = [];
//         const fileContent = fs.readFileSync(filePath, 'utf8'); // Lê o arquivo de forma síncrona para simplificar

//         // Cria uma stream legível a partir da string para o csv-parser
//         const s = new Readable();
//         s.push(fileContent);
//         s.push(null); // Indica o fim da stream

//         // Detecta o delimitador com base na extensão ou conteúdo (aqui, assumimos ';')
//         // Para um sistema mais robusto, você pode tentar detectar o delimitador
//         // ou ter uma configuração por tipo de arquivo.
//         // Com base no seu problema anterior, assumimos ';'
//         const options = { separator: ';' };

//         s.pipe(csv(options))
//             .on('data', (data) => results.push(data))
//             .on('end', () => {
//                 resolve(results);
//             })
//             .on('error', (err) => {
//                 reject(err);
//             });
//     });
// }

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

        console.log(`File path: ${filePath}`)

        try {
            // Converte o arquivo para JSON
            // const jsonData = await convertFileToJson(filePath);
            
            const fileContent = fs.readFileSync(fileName, 'utf-8')
            //console.log(fileContent)
           
            const productsJson = convertTextToJson(fileContent);
            const productsSupplier = await getProductSupplier();

            const orderFull = addProductIdToOrders(productsJson, productsSupplier)
            // console.log(productsSupplier)

            
            console.log(`Conteúdo de '${fileName}' convertido para JSON:`);
            // console.log(JSON.stringify(orderFull, null, 2)); // Exibe o JSON no console
            console.log(await createOrder(orderFull))


            // Apaga o arquivo original após a conversão bem-sucedida
            fs.unlinkSync(filePath);
            console.log(`Arquivo original '${fileName}' apagado com sucesso.`);

            // Aqui você pode fazer algo com o jsonData, como:
            // - Enviar para um banco de dados
            // - Enviar para outra API
            // - Armazenar em algum lugar
            // Por exemplo, retornar o jsonData para uma função chamadora,
            // ou emitir um evento se este script for parte de um sistema maior.
            return orderFull; // Retorna o JSON (se este for um módulo importado)

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

// // Exemplo de uso:
// const entrada = `NUMERO_PEDIDO;LOTE;EMPRESA;COD_CLIENTE;CLIENTE;COD_PRODUTO;DESCRICAO;EMBALAGEM;QTDPEDIDA;PESOTOTAL;PRC_VENDA_UNIT;TOTAL;STATUS;DTAINCLUSAO;VENCIMENTO;FORMABASTEC;CATEGORIA
// 4100806;200760;002-ITAITING;243;S NOVA OPCAO;9992;SAL SOSAL PARRILLA 500G DEFUMADO;CX 8;1;4;11,64;93,12;LIBERADO;12/05/2025;12/06/2025;SELEÇÃO INVERSA;MERC SALGADA 
// 4100806;200760;002-ITAITING;243;S NOVA OPCAO;9993;SAL SOSAL PARRILLA 500G ERVAS FINAS;CX 8;1;4;11,64;93,12;LIBERADO;12/05/2025;12/06/2025;SELEÇÃO INVERSA;MERC SALGADA 
// 4100807;200761;002-ITAITING;244;OUTRO CLIENTE;1000;PRODUTO A;UN 1;2;10;5,00;10,00;PENDENTE;13/05/2025;13/06/2025;SELEÇÃO NORMAL;BEBIDA
// 4100807;200761;002-ITAITING;244;OUTRO CLIENTE;1001;PRODUTO B;UN 1;3;15;7,50;22,50;PENDENTE;13/05/2025;13/06/2025;SELEÇÃO NORMAL;BEBIDA`;

// const saida = agruparProdutosPorPedido(entrada);
// console.log(JSON.stringify(saida, null, 2));