import React from 'react'
import prismadb from '@/lib/prismadb'
import SubcatForm from './components/subcat-form';

const SubcatPage = async ({
    params
}: {
  params: {subcatId: string}
}) => {
  const subcat = await prismadb.subcat.findUnique({
    where: {
      id: params.subcatId
    }
  });


  return (
    <div className='flex-col'>
        <div className='flex-1 space-y-4 p-8 pt-6'>
            <SubcatForm initialData={subcat}/>
        </div>
        
    </div>
  )
}

export default SubcatPage