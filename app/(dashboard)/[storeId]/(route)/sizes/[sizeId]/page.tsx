import React from 'react'
import SizeForm from './components/size-form'

const SizePage = ({
    params
}: {params: {sizeId: string}
}) => {
  return (
    <div className='flex-col'>
        <div className='flex-1 space-y-4 p-8 pt-6'>
            <SizeForm initialData={null}/>
        </div>
        testing
    </div>
  )
}

export default SizePage