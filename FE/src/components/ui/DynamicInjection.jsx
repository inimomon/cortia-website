import React from 'react'

import LogoList from './LogoList'

const DynamicInjection = () => {
  return (
    <div className='py-16 w-full flex flex-col items-center'>
        <h1 className='text-xs text-gray-500 font-semibold'>DATA BERSUMBER & BERKOLABORASI DENGAN</h1>
        <div className='mt-12 flex justify-center gap-12'>
            <LogoList />
        </div>
    </div>
  )
}

export default DynamicInjection