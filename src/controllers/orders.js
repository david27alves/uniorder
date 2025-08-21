import sequelize from "../services/db.js"
import Pedido from "../models/modelPedido.js"
import PedidoItem from "../models/modelPedidoItem.js"
import ProdutoFornecedor from "../models/modelProdutoFornecedor.js"

export const getOrderById = async () => {

    try {
        const pedidos = await Pedido.findAll({
            where: {
                id: 11300
            }
        })
        
        //pedidos.map(pedido => console.log(pedido.dataValues))
        return pedidos
    } catch (e) {
        throw new errror
    }

}


export const createOrder = async (pedidos) => {

    
    pedidos.map(async (pedido) => {

        const transactionPedido = await sequelize.transaction()
        
        try {
            const pedidoCreate = await Pedido.create(
                {
                    idLoja: 1,
                    idFornecedor: 1382,
                    idTipoFretePedido: 0,
                    idTipopedido: 0,
                    dataCompra: pedido.DTAINCLUSAO.split('/').reverse().join('-'),
                    dataEntrega: pedido.VENCIMENTO.split('/').reverse().join('-'),
                    valorTotal: pedido.TOTAL_PEDIDO.replace(',', '.'),
                    idSituacaoPedido: 0,
                    observacao: `NUM_PEDIDO: ${pedido.NUMERO_PEDIDO} \nLOTE: ${pedido.LOTE}\nIMPORTAÇÃO VIA INTEGRAÇÃO`,
                    // observacao: 'TESTE DE IMPORTACAO',
                    desconto: '0.00',
                    valorDesconto: '0.00',
                    idTipoAtendidoPedido: 0
                },
                { 
                    transaction: transactionPedido
                }
            )

            pedido.PRODUTOS.map(async (produto) => {

              if (produto.id_produto == null){
                console.log(`${produto.COD_PRODUTO} - ${produto.DESCRICAO} Não está cadastrado em produto fornecedor`)
                return false
              }

                await PedidoItem.create(
                    {
                        id_loja: 1, 
                        id_pedido: pedidoCreate.id, 
                        id_produto: produto.id_produto, 
                        quantidade: produto.QTDPEDIDA, 
                        qtdembalagem:produto.EMBALAGEM.replace(/\D/g, ""), 
                        custocompra: produto.PRC_VENDA_UNIT.replace(',', '.'), 
                        dataentrega: pedidoCreate.dataEntrega, 
                        desconto: '0.00', 
                        valortotal: produto.TOTAL.replace(',', '.'), 
                        quantidadeatendida: 0, 
                        id_tipopedido: 0, 
                        custofinal: '0.00', 
                        id_tipoatendidopedido: 0
                    }
                )
                
            })
            
            transactionPedido.commit()
            console.log(`ID: ${pedidoCreate.id} | NUM_PEDIDO_C5: ${pedido.NUMERO_PEDIDO}`)
            // return pedido.
            

        } catch (e) {
            console.error(e)
            await transactionPedido.rollback()
        }
        
    })

    // sequelize.close()


}

export const getProductSupplier = async () => {

  try {
    const produtos = await ProdutoFornecedor.findAll({
      attributes: ['id', 'id_produto', 'codigoexterno'],
      where: {
        id_fornecedor: 1382
      }      
    })

    let arrProd = []
    produtos.map((produto) => {
      arrProd.push(produto.dataValues)
    })

    return arrProd
  
  } catch(e) {
    console.error(e)
  }


}