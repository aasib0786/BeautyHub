import React from 'react'
import './videosec.css'
import ReelSection from '@/app/Components/ReelSection/reelSection'
import Image from 'next/image'

const page = () => {
  return (
    <>
      <div className='container'>
        <div className='main'>
          <div className='videosec'>
            <h1 className='text-center'>Short Clips of us</h1>
            <ReelSection />
          </div>
        </div>
      </div>
    </>
  )
}

export default page
