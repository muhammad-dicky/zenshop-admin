import React from 'react'
import { SubcatClient} from './components/client'
import prismadb from '@/lib/prismadb'
import {  SubcatColumn } from './components/column'
import { format } from 'date-fns'

const SubcatPage = async ({
    params
}: {
    params: {storeId: string}
}) => {
    const subcat = await prismadb.subcat.findMany({
        where: {
            storeId: params.storeId,
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    const formattedSubcat: SubcatColumn[] = subcat.map((item) => ({
        id: item.id,
        name: item.name,
        value: item.value,
        createdAt: format(item.createdAt, "MMMM do, yyyy")
    }));


  return (
    <div className='flex-col'>
        <div className='flex-1 space-y-4 p-8 pt-6'>
            <SubcatClient data={formattedSubcat} />
        </div>
    </div>
  )
}

export default SubcatPage