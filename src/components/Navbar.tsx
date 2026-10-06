import React, { useContext } from 'react'
import {Plane , SunMedium , Moon ,UserRoundArrowLeft , UserRound} from 'lucide-react'
import { NavLink } from 'react-router'
import { AppContext } from '../context/AppContext'
  type NavbarPrps = {
    them:string,
    changeTheme:()=>void,
  }
export default function Navbar({them , changeTheme}:NavbarPrps) {
  const context = useContext(AppContext);
  if (context === null) {
    throw new Error("this is a problem")
  }
  const {state} = context;
  const isLoggedIn = state.currentUserId !== null;
  return (
    <>
      <div className='flex justify-between md:justify-center md:gap-15 md:text-xl items-center px-3 pt-3'>
        <NavLink to="/" className='flex flex-row gap-1 items-center'>
          <Plane className='text-primary' />
          <p className='text-primary font-header'>Travel</p>
        </NavLink>
        <button onClick={()=>changeTheme()} className='flex btn rounded-2xl text-primary'>
        {
          them === 'dark' ? 
          <>
          <p>Light Mode</p><SunMedium />
          </>
          :
          <>
          <p>Night Mode</p><Moon />
          </>
        } 
        </button>
        {
          isLoggedIn ? 
        <NavLink to="/profile"  className='flex btn rounded-2xl text-primary'>
          <UserRound />
        </NavLink>
          :
        <NavLink to="/login"  className='flex btn rounded-2xl text-primary'>
          <UserRoundArrowLeft />
        </NavLink>
        }

      </div>
      <div className='w-[80%] md:w-[50%] h-px bg-primary mx-auto mt-3'></div>
    </>
  )
}