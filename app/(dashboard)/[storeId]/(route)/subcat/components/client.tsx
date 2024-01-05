"use client"

import { Button } from '@/components/ui/button';
import Heading from '@/components/ui/heading';
import React from 'react';
import {  SubcatColumn, columns } from './column';
import { useParams, useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { Separator } from "@/components/ui/separator";
import { DataTable } from '@/components/ui/data-table';
import { ApiList } from '@/components/ui/api-list';

interface SubcatClientProps {
    data: SubcatColumn[]
}


export const SubcatClient: React.FC<SubcatClientProps> = ({
    data
}) => {
    const router = useRouter();
    const params = useParams();


  return (
    <>
    <div className='flex items-center justify-between'>
        <Heading title={`Subcat (${data.length})`} description={'Manage subcat for your products'}/>
        <Button onClick={() => router.push(`/${params.storeId}/subcat/new`)}>
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
    <Heading title={"API"} description={"API class for Subcat"}/>
    <ApiList entityName={"subcat"} entityIdName={"subcatId"}/>
    </>
  )
}