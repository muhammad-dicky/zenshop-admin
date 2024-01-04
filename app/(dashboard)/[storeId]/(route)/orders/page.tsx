import prismadb from "@/lib/prismadb";
import { OrderClient } from "./components/client";
import { OrderColumn } from "./components/columns";

import { format } from 'date-fns';
import { formatter } from "@/lib/utils";





const Orders = async ({
    params
}: {
    params: {storeId: string},
}) => {

    // const {quantityCheckout} = await req.json();
   
    const orders = await prismadb.order.findMany({
        where: {
            storeId: params.storeId,
        },
        include: {
            orderItems: {
                include: {
                    product: true
                }
            }
        },
        orderBy: {
            createdAt:'desc'
        }
    });



    const formattedOrders: OrderColumn[] = orders.map((item, quantity) => ({
        id: item.id,
        phone: item.phone,
        address: item.address,
        products: item.orderItems.map((orderItem) => {
            const productName = orderItem.product.name || 'Name Product Tidak tersedia'
            const productStock = orderItem.product.stock || 'Stock product tidak tersedia'
            return `${productName} (Stock: ${productStock})`
        }).join(', '),
        totalPrice: formatter.format(item.total),
        // totalPrice: formatter.format(item.orderItems.reduce((total, item) => {
        //     return total + Number(item.product.price)
        // }, 0)),
        isPaid: item.isPaid,
        createdAt: format(item.createdAt, "MMMM do, yyyy")
    }))
    
    return (

        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
            <OrderClient data={formattedOrders} />
            
            </div>
        </div>
     );
}
 
export default Orders;