
import React from 'react';
import LogoList from './LogoList';
import AiConnectHitam from "../../assets/AiConnectHitam.png";
import DTETI from "../../assets/DTETI.png";
import FINDIT from "../../assets/FINDIT.png";
import opentender from "../../assets/opentender.png";
import ugm from "../../assets/ugm.png";

const DynamicInjection = () => {
  return (
    <div className='py-16 w-full flex flex-col items-center'>
      <h1 className='text-xs text-gray-500 font-semibold'>DATA BERSUMBER & BERKOLABORASI DENGAN</h1>
      <div className='mt-12 flex justify-center gap-2 md:gap-16'>
        <LogoList />
        <div className='h-24 flex justify-center gap-12'>
          <div className='w-24 h-16 flex items-center justify-center'>
            <img src={opentender} alt='' className='max-h-full max-w-full object-contain' />
          </div>
          <div className='w-24 h-16 flex items-center justify-center'>
            <img src={AiConnectHitam} alt='' className='max-h-full max-w-full object-contain' />
          </div>
          <div className='w-24 h-16 flex items-center justify-center'>
            <img src={ugm} alt='' className='max-h-full max-w-full object-contain' />
          </div>
          <div className='w-24 h-16 flex items-center justify-center'>
            <img src={DTETI} alt='' className='max-h-full max-w-full object-contain' />
          </div>
          <div className='w-24 h-16 flex items-center justify-center'>
            <img src={FINDIT} alt='' className='max-h-full max-w-full object-contain' />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicInjection;