import prismadb from "@/lib/prismadb";
import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import Stripe from "stripe";



const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
};

export async function POST(
    req: Request,
    {params}: {params: {storeId: string}}
){
    

    const {productIds, totalPrice, quantityCheckout} = await req.json();
    // const {totalPrice} = await req.json();
    console.log(`Ini function POST: ${quantityCheckout}`)

    if(!productIds || productIds.length === 0){
        return new NextResponse("Product ids are required.", {status:400});
    }

    const products = await prismadb.product.findMany({
        where:{
            id:{
                in: productIds
            }
        }
    });


    // const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
        {
            quantity: 1,
            price_data: {
              currency: 'USD',
              product_data: {
                name: 'Total Price', // You can set any name you prefer
              },
              unit_amount: totalPrice * 100,
            },
          },
    ];
    // const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = products.map((product, index) => ({

    //         quantity: quantityCheckout[index] || 1,
    //         price_data: {
    //           currency: 'USD',
    //           product_data: {
    //             name: 'Total Price', // You can set any name you prefer
    //           },
    //           unit_amount: totalPrice * 100,
    //         },
          
    // }))
       
    

    // products.forEach((product, order) => {
    //     line_items.push({
    //         quantity: 1,
    //         price_data: {
    //             currency: 'USD',
    //             product_data: {
    //                 name: product.name
    //             },
    //             unit_amount: product.price.toNumber() * 100
    //             // unit_amount: totalPrice * 100
                
    //         }
    //     });
    // });


    const order = await prismadb.order.create({
        data: {
            storeId: params.storeId,
            isPaid: false,
            total: totalPrice,
            orderItems: {
                create: productIds.map((productId: string) => ({
                    product: {
                        connect: {
                            id: productId
                        }
                    }
                }))
            }
        }
    });

    const session = await stripe.checkout.sessions.create({
        line_items,
        mode: "payment",
        billing_address_collection: "required",
        phone_number_collection: {
            enabled: true,
        },
        success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
        cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?canceled=1`,
        metadata: {
            orderId: order.id,
        }
    });

    await updateProductStock(productIds, quantityCheckout);

    return NextResponse.json({url: session.url}, {headers: corsHeaders});
}

async function updateProductStock(productIds: string[], quantityCheckout: number[]) {
    console.log(`ini id product: ${productIds}`);
    console.log(`ini quantityCheckout: ${quantityCheckout}`);

    for (let i = 0; i < productIds.length; i++) {
        const productId = productIds[i];
        const quantity = quantityCheckout[i];

        // Fetch the product from the Database;
        const product = await prismadb.product.findUnique({
            where: {
                id: productId,
            },
        });

        if (product) {
            const newStock = Math.floor(product.stock - quantity);

            // Update the product's stock and set isArchived to true if stock is zero or below
            await prismadb.product.updateMany({
                where: {
                    id: productId,
                },
                data: {
                    stock: newStock,
                    isArchived: newStock <= 0 ? true : false,
                },
            });

            // Fetch the updated product
            const updatedProduct = await prismadb.product.findUnique({
                where: {
                    id: productId,
                },
            });

            await prismadb.product.update({
                where: {
                    id: productId,
                },
                data: {
                    isArchived : true
                }
            });
            // TODO: isArchived bisa true kalo transaksi dibatalkan, kalo lanjut malah g jalan

            console.log(`Updated product: ${JSON.stringify(updatedProduct)}`);
        }
    }
}
