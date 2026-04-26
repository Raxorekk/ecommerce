import React from 'react'
import { Product } from '@/types/api'
import { useState } from 'react'

const ProductDetailSpecs = ({specs}: {specs: Product['specification_values']}) => {
  const [specCount, setSpecCount] = useState(1);
  return (
    <div className='border border-muted-background w-full flex flex-col rounded-lg'>
      {specs.map((spec, index) => {
        const isEven = (index + 1) % 2 === 0;
        console.log(isEven)
        return <div className={`flex flex-row px-6 py-3.5 justify-between text-sm ${isEven ? "bg-muted-background" : "bg-card"}`} key={spec.value}>
          <p className='text-muted-foreground'>{spec.name}</p>
          <p className='text-foreground'>{spec.value}</p>
        </div>
      })}

    </div>
  )
}

export default ProductDetailSpecs