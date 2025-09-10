import { Pedido } from "@/models/Pedido";
import PedidoItem from "@/models/PedidoItem";
import ProdutoFornecedor from "@/models/ProdutoFornecedor";
import sequelize from "@/services/db";
import logger from "@/services/logger";
import { Lojas, OrderData, ProductOrder } from "@/types/types"

export const createOrder = async (orders: OrderData[]) => {
    
    const newOrders = []
    
    for (const order of orders) {
      
      const transactionOrder = await sequelize.transaction()
      const orderFormat = {
          idLoja: Lojas[order.COD_CLIENTE],
          idFornecedor: parseInt(process.env.ID_SUP || '1743'),
          idTipoFretePedido: 0,
          dataCompra: order.DTAINCLUSAO.split('/').reverse().join('-'),
          dataEntrega: order.VENCIMENTO.split('/').reverse().join('-'),
          valorTotal: order.TOTAL_PEDIDO.replace(',', '.'),
          idSituacaoPedido: 0,
          observacao: `NUM_PEDIDO: ${order.NUMERO_PEDIDO} \nLOTE: ${order.LOTE}\nIMPORTAÇÃO VIA INTEGRAÇÃO`,
          desconto: '0.00',
          valorDesconto: '0.00',
          idTipoAtendidoPedido: 0
      }
      
      for (const product of order.PRODUTOS) { 
        if (product.id_produto == null){
            console.log(`${product.COD_PRODUTO} - ${product.DESCRICAO} Não está cadastrado em produto fornecedor`)
            logger.info("Teste")
        
        }
      }
        
        try {
            const newOrder = await Pedido.create(orderFormat, { transaction: transactionOrder})

            for (const product of order.PRODUTOS) {

              const productFormat = {
                    id_loja: newOrder.dataValues.idLoja, 
                    id_pedido: newOrder.dataValues.id, 
                    id_produto: product.id_produto, 
                    quantidade: product.QTDPEDIDA, 
                    qtdembalagem:product.EMBALAGEM.replace(/\D/g, ""), 
                    custocompra: product.PRC_VENDA_UNIT.replace(',', '.'), 
                    dataentrega: newOrder.dataValues.dataEntrega, 
                    desconto: '0.00', 
                    valortotal: product.TOTAL.replace(',', '.'), 
                    quantidadeatendida: 0, 
                    id_tipopedido: 0, 
                    custofinal: '0.00', 
                    id_tipoatendidopedido: 0
                }

                const newProducts = await PedidoItem.create(productFormat, { transaction: transactionOrder })
                logger.info(`Pedido criado - ID: ${newOrder.dataValues.id} | NUM_PEDIDO_C5: ${order.NUMERO_PEDIDO} | Produtos: ${JSON.stringify(newProducts)}`)
            }
            
            await transactionOrder.commit()
            newOrders.push(newOrder)
            
            
        } catch (e) {
            console.error(e)
            await transactionOrder.rollback()
            logger.error(e)
            //return {"Erro": "Falha ao inserir os dados!"}
            throw e
        }
    }
    
    return newOrders

}

export const getProductSupplier = async () => {
    try {
    const produtos = await ProdutoFornecedor.findAll({
      attributes: ['id', 'id_produto', 'codigoexterno'],
      where: {
        id_fornecedor: process.env.ID_SUP
      }      
    })

    const arrProd: ProductOrder[] = []
    produtos.map((produto) => {
      arrProd.push(produto.dataValues)
    })

    return arrProd
  
  } catch(e) {
    console.error(e)
  }
}

export const checkProductSupplier = (orders: OrderData[]) => {

  const productSupplierOut:ProductOrder[] = []

  orders.map((order) => {
    order.PRODUTOS.map((product) => {
      if (product.id_produto == null)
        productSupplierOut.push(product)
      })
    })

  return productSupplierOut

}