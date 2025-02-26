import React from 'react'
import Sidebar from './Sidebar'
import TestTable from './TestTable'
import './HeroSection.css'

function HeroSection() {
  return (

    <div className='hero'>
    
        <div className='Side'>
        <Sidebar/>

        </div>
        <div className='Test'>
        {/* <h1 >TEST LIST</h1> */}
        <TestTable/>
        </div>
    </div>
   
  )
}

export default HeroSection