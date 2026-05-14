import React from 'react'

import AiConnectHitam from "../../assets/AiConnectHitam.png";
import DTETI from "../../assets/DTETI.png";
import FINDIT from "../../assets/FINDIT.png";
import opentender from "../../assets/opentender.png";
import ugm from "../../assets/ugm.png";

const LogoList = () => {
  return (
    <>
    <div className='w-24 h-16 flex items-center justify-center'>
        <img
            src={opentender}
            alt=""
            className='max-h-full max-w-full object-contain'
        />
    </div>
    <div className='w-24 h-16 flex items-center justify-center'>
        <img
            src={AiConnectHitam}
            alt=""
            className='max-h-full max-w-full object-contain'
        />
    </div>
    <div className='w-24 h-16 flex items-center justify-center'>
        <img
            src={ugm}
            alt=""
            className='max-h-full max-w-full object-contain'
        />
    </div>
    <div className='w-24 h-16 flex items-center justify-center'>
        <img
            src={DTETI}
            alt=""
            className='max-h-full max-w-full object-contain'
        />
    </div>
    <div className='w-24 h-16 flex items-center justify-center'>
        <img
            src={FINDIT}
            alt=""
            className='max-h-full max-w-full object-contain'
        />
    </div>
    </>
  )
}

export default LogoList