import { OrderData, ProductOrder } from "@/types/types";

export const addProductIdToOrders = (ordersArray: OrderData[], productsArray: ProductOrder[]): OrderData[] => {

  const productsIdMap = new Map<string, number>();
  productsArray.forEach(product => {
    productsIdMap.set(product.codigoexterno, product.id_produto);
  });

  ordersArray.forEach(order => {
    if (order.PRODUTOS && Array.isArray(order.PRODUTOS)) {
      order.PRODUTOS.forEach(product => {
        const productId = productsIdMap.get(product.COD_PRODUTO.toString());
        if (productId) {
          product.id_produto = productId;
        }
      });
    }
  });

  return ordersArray;
};