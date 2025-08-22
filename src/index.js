import 'dotenv/config'
import chokidar from 'chokidar';
import fs from 'fs';
import path from 'path';
import { addProductIdToOrders, convertTextToJson } from './utils/utils.js';
import { createOrder, getProductSupplier } from './controllers/orders.js';

const INPUT_FOLDER = process.env.FOLDER; 
const ALLOWED_EXTENSIONS = ['.csv', '.txt'];

async function startFileMonitor() {
    console.log(`Iniciando monitoramento da pasta: ${INPUT_FOLDER}`);

    if (!fs.existsSync(INPUT_FOLDER)) {
        fs.mkdirSync(INPUT_FOLDER, { recursive: true });
        console.log(`Pasta '${INPUT_FOLDER}' criada.`);
    }

    const watcher = chokidar.watch(INPUT_FOLDER, {
        ignored: /(^|[\/\\])\../, 
        persistent: true,
        awaitWriteFinish: {
            stabilityThreshold: 2000, // Tempo em milissegundos para esperar
            pollInterval: 100 // Intervalo de tempo para checar se o arquivo foi finalizado
        }
    });

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
            
            const fileContent = fs.readFileSync(filePath, 'utf-8')
           
            const productsJson = convertTextToJson(fileContent);
            const productsSupplier = await getProductSupplier();

            const orderFull = addProductIdToOrders(productsJson, productsSupplier)
            
            console.log(`Conteúdo de '${fileName}' convertido para JSON:`);
            console.log(await createOrder(orderFull))

            fs.unlinkSync(filePath);
            console.log(`Arquivo original '${fileName}' apagado com sucesso.`);

            return orderFull; 

        } catch (error) {
            console.error(`Erro ao processar o arquivo '${fileName}':`, error);
            
        }
    });

    watcher.on('error', (error) => console.error(`Erro no watcher: ${error}`));
    watcher.on('ready', () => console.log('Monitoramento de arquivos pronto e aguardando...'));
}

startFileMonitor();
