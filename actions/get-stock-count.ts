import prismadb from "@/lib/prismadb"



export const getStockCount  = async (storeId: string) => {
    const paidOrders = await prismadb.product.count({
        where:{
            storeId: storeId
        }
    });

    return paidOrders;
}