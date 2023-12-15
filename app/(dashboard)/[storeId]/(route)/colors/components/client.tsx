"use client"

import { Button } from '@/components/ui/button';
import Heading from '@/components/ui/heading';
import React from 'react';
import { ColorColumn, columns } from './column';
import { useParams, useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { Separator } from "@/components/ui/separator";
import { DataTable } from '@/components/ui/data-table';
import { ApiList } from '@/components/ui/api-list';

interface ColorClientProps {
    data: ColorColumn[]
}


export const ColorsClient: React.FC<ColorClientProps> = ({
    data
}) => {
    const router = useRouter();
    const params = useParams();


  return (
    <>
    <div className='flex items-center justify-between'>
        <Heading title={`Colors (${data.length})`} description={'Manage colors for your products'}/>
        <Button onClick={() => router.push(`/${params.storeId}/colors/new`)}>
            <Plus className='mr-2 w-4 h-4'/>
            Add New
        </Button>
    </div>
    <Separator/>
    <DataTable
    searchKey={"name"}
    columns={columns}
    data={data}
    />
    <Heading title={"API"} description={"API class for Colors"}/>
    <ApiList entityName={"colors"} entityIdName={"colorId"}/>
    </>
  )
}