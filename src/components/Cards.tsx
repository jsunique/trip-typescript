import React, { useEffect, useState, type JSX } from 'react'
import {NavLink} from 'react-router'
import countries from '../data/countries.json'

export default function Cards():JSX.Element {
  interface Data {
    code:string,
    name:string,
    landmark:string,
    image:string,
    imageAlt:string,
    photoSource:string,
  }
  const [page , setPage] = useState<number>(1);
  const [loading , setLoading] = useState<Record<string,boolean>>({});




  const start:number = (page - 1) * 6;
  const visibleCountry:Data[] = countries.slice(start , start + 6);
  const handlePlus = ():void=>{
    const totalPages:number = Math.ceil(countries.length / 6);
    setPage(prev => Math.min(prev + 1, totalPages));
  }
  const handleNagative = ()=>{
    if(page!=1){
      setPage(prev => Math.max(prev - 1, 1));
    }
    return
  }
  return (
    <>
    <div className='flex items-center justify-center gap-2 pt-2 bg-base-100'>
      <div className='h-px w-[10%] bg-accent '></div>
      <p className='text-center mt-10 font-pop font-medium text- pb-10 md:text-3xl '>Where you want to discovery</p>
      <div className='h-px w-[10%] bg-accent '></div>
    </div>
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 bg-base-100 gap-y-15 pb-5'>
      {
        visibleCountry.map((country)=>(
          <NavLink to={`country/${country.name}`} key={country.code }className='relative group flex  flex-col w-[90%] mx-auto h-50  max-w-90  bg-base-100'>
            {
              !loading[country.code] && (
                  <div className="absolute inset-0 flex items-center justify-center">
                      <span className="loading loading-spinner text-primary" />
                  </div>
              )
            }
            <img src={country.image} onLoad={()=>{
              setLoading(prev=>({
                ...prev,[country.code]:true,
              }));
            }} className='absolute w-full h-full rounded-2xl transition-transform duration-500 ease-out hover:scale-105 object-cover'  alt={country.name} />
            <p className='flex justify-center items-center absolute bottom-0 h-6 font-pop text-primary-content left-1/2 -translate-x-1/2 bg-primary/60 w-full  text-center overflow-hidden font-normal transition-all group-hover:opacity-100 opacity-0 duration-300 ease-out group-hover:translate-y-  '>{country.name}</p>
          </NavLink>
        ))
      }
    </div>
    <div className='w-full h-15  flex items-center justify-center gap-5 bg-base-100'>
      <button onClick={handleNagative} className='btn btn-primary font-bold flex h-8 min-h-0 w-8 items-center justify-center p-0 leading-none'>-</button>
      <p className='font-pop font-medium'>{page}</p>
      <button onClick={handlePlus} className='btn btn-primary font-bold flex h-8 min-h-0 w-8 items-center justify-center p-0 leading-none'>+</button>
    </div>
    </>
    )
}
