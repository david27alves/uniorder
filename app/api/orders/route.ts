import { addProductIdToOrders } from "@/utils/utils";
import { checkProductSupplier, createOrder, getProductSupplier } from "@/controllers/orders";
import { OrderData } from "@/types/types";

export async function GET() {

  const version = [{ version: "1.0.0" }]

  return new Response(JSON.stringify(version), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST(request: Request) {

  const orders: OrderData[] = await request.json() 

  try {

    const productSupper = await getProductSupplier() 
    
    if (!productSupper) {
      return new Response(JSON.stringify({ message: "Nenhum produto encontrado na base de dados.", severity: 'error' }), { status: 404 });

    }

    const ordersProductIdAdded = addProductIdToOrders(orders, productSupper)
    const productsWithoutId = checkProductSupplier(ordersProductIdAdded)
    
    if (productsWithoutId.length > 0) {
      return new Response(JSON.stringify({"Produtos não cadastrados:": productsWithoutId}), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const ordersCreated = await createOrder(ordersProductIdAdded)

    return new Response(JSON.stringify(ordersCreated), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    })


  } catch (error) {
    return new Response(JSON.stringify({ error}), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
  }
    
  
}