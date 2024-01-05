import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";


export async function POST(
    req: Request,
    {params}: {params: { storeId: string }}
) {
    try {
        const {userId} = auth();
        const body = await req.json();

        const {name, value} = body;

        if(!userId){
            return new NextResponse("Unauthenticated", {status: 401});
        }
        if(!name){
            return new NextResponse("Name is required", {status: 400});
        }
        if(!value){
            return new NextResponse("Value is required", {status: 400});
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
            return new NextResponse("Unathorized", {status:403});
        }

        const subcat = await prismadb.subcat.create({
            data: {
                storeId: params.storeId,
                name,
                value,
            }
        });
        return NextResponse.json(subcat);

    } catch (error) {
        console.log('[SUBCAT_POST]', error);
        return new NextResponse("Internal error", {status: 500});
    }
}


export async function GET(
    req: Request,
    {params}: {params: {storeId: string}}
) {
    try {
    
        if(!params.storeId){
            return new NextResponse("StoreID is required", {status: 400})
        }

        const subcat = await prismadb.subcat.findMany({
           where: {
            storeId: params.storeId
           }
        });

        return NextResponse.json(subcat);


    } catch (error) {
        console.log('[SUBCAT_GET]', error);
        return new NextResponse("Internal error", {status: 500});
    }
}