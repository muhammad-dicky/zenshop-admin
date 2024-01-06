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
                create: productIds.map((productId: string, index: number) => ({
                    product: {
                        connect: {
                            id: productId,
                        },
                    },
                    quantity:quantityCheckout[index] ||1
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

        // Use Prisma transaction to ensure atomicity
        await prismadb.$transaction(async (prisma) => {
            // Fetch the product from the Database
            const product = await prisma.product.findUnique({
                where: {
                    id: productId,
                },
            });

            if (product) {
                const newStock = Math.floor(product.stock - quantity);

                // Update the product's stock
                await prisma.product.updateMany({
                    where: {
                        id: productId,
                    },
                    data: {
                        stock: newStock,
                        isArchived: newStock <= 0 ? true : false,
                    },
                });

                // Update isArchived separately
                if (newStock <= 0) {
                    await prisma.product.update({
                        where: {
                            id: productId,
                        },
                        data: {
                            isArchived: true,
                        },
                    });
                }
            }
        });
    }
}

