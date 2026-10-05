import React, { useState , useRef, useEffect} from 'react'
import Globe from './Globe'
import {ListFilter, Search} from 'lucide-react'
import countries from '../data/countries.json'
import { NavLink } from 'react-router'

export default function Section() {
  const searchRef = useRef(null);
  const [input , setInput] = useState("");
  const [openModal , setOpenModal] = useState(false);
  const filteredList = countries.filter((country)=>{
    const countryName = country.name.toLowerCase();
    return countryName.includes(input.toLowerCase())
  })
  useEffect(()=>{
    function handleClick(event){
      const clickedInside = searchRef.current.contains(event.target);
      if (!clickedInside) {
        setOpenModal(false);
      }
    }
    document.addEventListener('pointerdown' , handleClick);
          return()=>{
        document.removeEventListener("pointerdown" , handleClick);
      }
  },[])

  return (
    <>
      <div className='flex flex-col  md:flex-row md:gap-25 md:mt-10 bg-base-100'>
        <div className='flex-col justify-center md:items-center md:flex-1'>
          <div className=' flex items-center justify-center gap-1'>
              <div ref={searchRef} className='relative bg-base-200 w-[80%] h-10 rounded-[20px] flex justify-center items-center font-pop mb-10 mt-10 border border-primary max-w-60'>
                <input onFocus={()=>setOpenModal(true)} value={input} onChange={(e)=>setInput(e.target.value)} type="text" placeholder='where?' className='outline-none w-full h-full  overflow-hidden px-5' />
                <Search size={30} className='mr-5' />
                          {
            openModal &&(
              <div className='flex flex-col w-full p-2  overflow-y-auto rounded-2xl border border-primary justify-center items-center  mx-auto absolute top-10 bg-base-100 shadow-xl z-50
              max-h-64'>
                {input.trim() === "" || filteredList.length === 0 ? (
                  <p className='flex justify-center items-center p-2'>write a country name</p>
                ):
                filteredList.map((country)=>(
                  <NavLink to={`country/${country.name}`} className='flex justify-between h-8 items-center w-full hover:bg-primary/20 px-2 cursor-pointer'>
                  <p className='font-pop ' key={country.code}>{country.name}</p>
                  <img src={`https://flagcdn.com/${country.code}.svg`} className='w-5 h-5' />
                  </NavLink>
                ))
                }
              </div>
            )
          }
              </div>
          </div>
          <h1 className='bg-base-100 font-header text-[27px] text-center'>See the world from near</h1>
          <p className='text-center mt-3 font-pop font-normal md:font-medium px-3'>choose country in the map and see<br /> the unique palce of each country to travel</p>
          <p className='pt-14 text-center font-pop font-normal md:font-medium px-3 text-accent bg-base-100'>
            if you want to see a country detail<br /> choose a box or choos from a cards below
          </p>
        </div>
        <Globe />
      </div>
    </>
  )
}
