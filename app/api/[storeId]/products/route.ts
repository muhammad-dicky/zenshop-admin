import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";



export async function POST(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        const {userId} = auth();
        const body = await req.json();

        const {name, images, categoryId, price, colorId, sizeId, isFeatured, isArchived, } = body;

        if(!userId){
            return new NextResponse("Unauthenticated", {status:401});
        }

        if(!name){
            return new NextResponse("Label is requred.", {status:400});
        }

        if(!images || !images.length){
            return new NextResponse("Image is required", {status: 400});
        }

        if(!categoryId){
            return new NextResponse("Category is requred.", {status:400});
        }

        if(!price){
            return new NextResponse("Price is requred.", {status:400});
        }

        if(!sizeId){
            return new NextResponse("Size is requred.", {status:400});
        }
        if(!colorId){
            return new NextResponse("Size is requred.", {status:400});
        }


        if(!params.storeId){
            return new NextResponse("StoreID is required", {status: 400})
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        });

        if(!storeByUserId){
            return new NextResponse("Unauthorized", {status: 403}); 
        }

        const product = await prismadb.product.create({
           data: {
            storeId: params.storeId,
           name,
           images: {
            createMany: {
                data: [
                    ...images.map((image: {url: string}) => image)
                ]
            }
           },
           sizeId,
           price,
           colorId,
           categoryId,
           isFeatured,
           isArchived
           }
        });

        return NextResponse.json(product);


    } catch (error) {
        console.log('[PRODUCT_POST]', error);
        return new NextResponse("Internal error", {status: 500});
    }
}



export async function GET(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        const {searchParams} = new URL(req.url);
        const categoryId = searchParams.get("categoryId") || undefined;
        const colorId = searchParams.get("colorId") || undefined;
        const sizeId = searchParams.get("sizeId") || undefined;
        const isFeatured = searchParams.get("isFeatured");

        if(!params.storeId){
            return new NextResponse("Store ID is required", {status: 400})
        }

        const products = await prismadb.product.findMany({
           where: {
            storeId: params.storeId,
            categoryId,
            colorId,
            sizeId,
            isFeatured: isFeatured ? true : undefined,
            isArchived: false
           },
           include: {
            images: true,
            category: true,
            color: true,
            size: true
           },
           orderBy: {
            createdAt: "desc"
           }
        });

        return NextResponse.json(products);


    } catch (error) {
        console.log('[PRODUCT_GET]', error);
        return new NextResponse("Internal error", {status: 500});
    }
}