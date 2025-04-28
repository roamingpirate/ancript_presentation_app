import React from 'react'
import Image from 'next/image'

const Logo = () => {
  return (
    <div className='flex px-3 space-x-2'>
        <Image src="/logo.svg" alt="Logo" width={20} height={1}/>
        <p className='text-lg font-medium font-sans'>Ancript</p>
    </div>
  )
}

export default Logo