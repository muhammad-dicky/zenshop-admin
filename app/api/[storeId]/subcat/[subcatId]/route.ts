import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";





export async function GET(
    req: Request,
    {params}: {params: {subcatId:string}}
){
    try {
        if(!params.subcatId){
            return new NextResponse("Subcat Id is required", {status: 400});
        }
        
        const subcat = await prismadb.subcat.findUnique({
            where: {
                id: params.subcatId
            }
        })
        return NextResponse.json(subcat);



    } catch (error) {
        console.log('SUBCAT_GET', error);
        return new NextResponse("Internal server error", {status: 500})
    }
}



export async function PATCH (
    req: Request,
    {params}: {params: { storeId: string, subcatId: string}}
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

        if(!params.subcatId){
            return new NextResponse("BillboardID is required", {status:400});
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

        const subcat = await prismadb.subcat.updateMany({
            where: {
                id: params.subcatId,
                
            },
            data: {
                name,
                value
            }
        })

        return NextResponse.json(subcat);

    } catch (error) {
        console.log('[SUBCAT_PATCH]', error);
        return new NextResponse("Internal error", {status: 500});
    }
}



export async function DELETE(
    req: Request,
    {params}: {params: { storeId: string, subcatId:string}}
){
    try {
        const {userId} = auth();

        if(!userId){
            return new NextResponse("Unauthorized",{status: 401});
        }

        if(!params.subcatId){
            return new NextResponse("Subcat is required", {status: 400});
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        });

        if(!storeByUserId){
            return new NextResponse("Store is required", {status:400})
        }

        const subcat = await prismadb.subcat.deleteMany({
            where:{
                id: params.subcatId,
                
            }
        });

        return NextResponse.json(subcat);


    } catch (error) {
        console.log('[SUBCAT_DELETE]', error);
        return new NextResponse("Internal error", {status: 500});
    }
}