export interface OrderData {
  //id_loja: number,
  NUMERO_PEDIDO: string,
  LOTE: string,
  COD_CLIENTE: LojaKeys,
  CLIENTE: string,
  PRODUTOS: [ProductOrder]
  TOTAL_PEDIDO: string,
  DTAINCLUSAO: string,
  VENCIMENTO: string,
}

export interface ProductOrder {
  id_produto: number,
  COD_PRODUTO: number,
  DESCRICAO: string
  QTDPEDIDA: number,
  EMBALAGEM: string,
  PRC_VENDA_UNIT: string,
  TOTAL: string
  codigoexterno: string; // Adicione esta linha
}

export const Lojas = {
  '222': 5
} as const

type LojaKeys = keyof typeof Lojas; 