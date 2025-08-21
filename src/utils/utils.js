
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
