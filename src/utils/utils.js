// import fs from 'fs';
// import csv from 'csv-parser';
// import { Readable } from 'stream'; // Necessário para simular stream para csv-parser de string

export const addProductIdToOrders = (ordersArray, productsArray) => {
 
  const productsIdMap = productsArray.reduce((map, product) => {
    map[product.codigoexterno] = product.id_produto;
    return map;
  }, {});

  ordersArray.forEach(order => {
    if (order.PRODUTOS && Array.isArray(order.PRODUTOS)) {
      order.PRODUTOS.forEach(product => {
        const productId = productsIdMap[product.COD_PRODUTO];
        if (productId) {
          product.id_produto = productId;
        }
      });
    }
  });

  // console.log(productsArray)
//   console.log(JSON.stringify(ordersArray, null, 2))

  return ordersArray;
}



// export const convertFileToJson = async (filePath) => {
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


export const convertTextToJson = (arquivoProdutos) => {
  const linhas = arquivoProdutos.trim().split('\n');
  if (linhas.length === 0) {
    return [];
  }

  const cabecalho = linhas[0].split(';');
  const produtosAgrupados = {};

  for (let i = 1; i < linhas.length; i++) {
    const valores = linhas[i].split(';');
    const produto = {};
    cabecalho.forEach((campo, index) => {
      produto[campo.trim()] = valores[index] ? valores[index].trim() : '';
    });

    const numeroPedido = produto.NUMERO_PEDIDO;

    if (!produtosAgrupados[numeroPedido]) {
      // Inicializa o objeto do pedido se ainda não existir
      produtosAgrupados[numeroPedido] = {
        NUMERO_PEDIDO: produto.NUMERO_PEDIDO,
        LOTE: produto.LOTE,
        EMPRESA: produto.EMPRESA,
        COD_CLIENTE: produto.COD_CLIENTE,
        CLIENTE: produto.CLIENTE,
        PRODUTOS: [],
        TOTAL_PEDIDO: 0,
        STATUS: produto.STATUS,
        DTAINCLUSAO: produto.DTAINCLUSAO,
        VENCIMENTO: produto.VENCIMENTO,
        FORMABASTEC: produto.FORMABASTEC,
        CATEGORIA: produto.CATEGORIA,
      };
    }

    // Adiciona o produto à lista de produtos do pedido
    produtosAgrupados[numeroPedido].PRODUTOS.push({
      COD_PRODUTO: produto.COD_PRODUTO,
      DESCRICAO: produto.DESCRICAO,
      EMBALAGEM: produto.EMBALAGEM,
      QTDPEDIDA: produto.QTDPEDIDA,
      PESOTOTAL: produto.PESOTOTAL,
      PRC_VENDA_UNIT: produto.PRC_VENDA_UNIT,
      TOTAL: produto.TOTAL,
    });

    // Soma o TOTAL do produto ao TOTAL_PEDIDO
    // Substitui vírgula por ponto para conversão para número e garante que seja um float
    const totalProduto = parseFloat(produto.TOTAL.replace(',', '.'));
    if (!isNaN(totalProduto)) {
      produtosAgrupados[numeroPedido].TOTAL_PEDIDO += totalProduto;
    }
  }

  // Converte o TOTAL_PEDIDO de volta para string com vírgula e duas casas decimais
  const resultadoFinal = Object.values(produtosAgrupados).map(pedido => {
    pedido.TOTAL_PEDIDO = pedido.TOTAL_PEDIDO.toFixed(2).replace('.', ',');
    return pedido;
  });

  return resultadoFinal;
}

// // Exemplo de uso:
// const entrada = `NUMERO_PEDIDO;LOTE;EMPRESA;COD_CLIENTE;CLIENTE;COD_PRODUTO;DESCRICAO;EMBALAGEM;QTDPEDIDA;PESOTOTAL;PRC_VENDA_UNIT;TOTAL;STATUS;DTAINCLUSAO;VENCIMENTO;FORMABASTEC;CATEGORIA
// 4100806;200760;002-ITAITING;243;S NOVA OPCAO;9992;SAL SOSAL PARRILLA 500G DEFUMADO;CX 8;1;4;11,64;93,12;LIBERADO;12/05/2025;12/06/2025;SELEÇÃO INVERSA;MERC SALGADA 
// 4100806;200760;002-ITAITING;243;S NOVA OPCAO;9993;SAL SOSAL PARRILLA 500G ERVAS FINAS;CX 8;1;4;11,64;93,12;LIBERADO;12/05/2025;12/06/2025;SELEÇÃO INVERSA;MERC SALGADA 
// 4100807;200761;002-ITAITING;244;OUTRO CLIENTE;1000;PRODUTO A;UN 1;2;10;5,00;10,00;PENDENTE;13/05/2025;13/06/2025;SELEÇÃO NORMAL;BEBIDA
// 4100807;200761;002-ITAITING;244;OUTRO CLIENTE;1001;PRODUTO B;UN 1;3;15;7,50;22,50;PENDENTE;13/05/2025;13/06/2025;SELEÇÃO NORMAL;BEBIDA`;

// const saida = agruparProdutosPorPedido(entrada);
// console.log(JSON.stringify(saida, null, 2));