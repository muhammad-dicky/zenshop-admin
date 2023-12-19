"use client"

import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Billboard } from "@prisma/client";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation"
import { OrderColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { Separator } from "@/components/ui/separator";
import { ApiList } from "@/components/ui/api-list";


interface OrderClientProps {
    data: OrderColumn[]
}

export const OrderClient: React.FC<OrderClientProps> = ({
    data
}) => {
    const router = useRouter();
    const params = useParams();



    return (
       <>
       <div className="flex items-center justify-between">
        <Heading
        title={`Orders (${data.length})`}
        description="Manage orders for your store"
        />
        {/* <Button onClick={() => router.push(`/${params.storeId}/billboards/new`)}>
            <Plus className="mr-2 w-4 h-4"/>
            Add New
        </Button> */}
       </div>
       <Separator/>
       <DataTable searchKey={"products"} columns={columns} data={data} />
       </>
    )
}