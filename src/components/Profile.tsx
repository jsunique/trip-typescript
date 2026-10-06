import React, { useState } from 'react'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import countries from '../data/countries.json'
import {useNavigate} from 'react-router' 

export default function Profile() {
  const navigate = useNavigate();
  const context = useContext(AppContext);
  if (context === null) {
    throw new Error("this is a problem")
  }
  const {state , dispatch } = context;
  if (state.currentUserId === null) {
    return <p>please log in first</p>
  }
  const currentUser = state.users[state.currentUserId];
  const [activeTab , setActiveTab] = useState("favorites");
  const favorites = currentUser?.likes ?? [];
  const trips = Object.keys(currentUser?.trips ?? {});
  
  return (
    <>
    <div className='w-[70%] h-10 bg-base-300 mx-auto mt-5 rounded-3xl flex max-w-60'>
      <button onClick={()=>setActiveTab('favorites')} className={`cursor-pointer hover:opacity-95 rounded-2xl bg-base-300  h-full w-1/2  font-pop${activeTab==="favorites" ? ' bg-primary text-primary-content'  : 'bg-base-100 text-base-content' }`}>Favorites</button>
      <button onClick={()=>setActiveTab('trip')} className={`cursor-pointer hover:opacity-95  rounded-2xl  h-full w-1/2  font-pop ${activeTab==="trip" ? 'text-primary-content bg-primary'  : 'bg-base-300 text-base-content' }`}>My trip</button>
    </div>
        {
          activeTab === 'favorites' ?
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto px-4 mt-6 bg-base-100'>
            {              
            favorites.length === 0 ? (
                <div className=' w-full md:translate-x-85  h-60 flex flex-col mx-auto justify-center items-center'>
                  <p className='font-header text-center '>you must add some favorites from  list<br />
                  there is nothing to show you :(</p>
                  <button onClick={()=>navigate('/')} className='text-primary-content p-3 font-pop cursor-pointer mt-5 rounded-4xl bg-primary '>Go Home</button>

                </div>
              )
              
              :favorites.map((countryName) =>{
                const countryData = countries.find(
                  (item) => item.name === countryName
                );
                if(!countryData){
                  return null
                }
                return(
            <div className='min-w-0 w-full bg-base-200 rounded-3xl p-3 flex flex-col'>
              <img src={countryData.image} className='w-full h-44 sm:h-48 object-cover  rounded-2xl' />
              <p className=' text-primary px-5 font-semibold text-xl'>{countryName}</p>
              <button onClick={()=> dispatch({type:"TOGGLE_TRIP_COUNTRY",payload:countryName})} className='hover:bg-accent cursor-pointer hover:text-base-100 border border-accent mt-2 h-8 mx-auto text-accent max-w-70 w-[50%] rounded-4xl '>Add To Trip</button>
              <button onClick={()=> dispatch({type:"TOGGLE_LIKE" , payload:countryName})} className='hover:bg-red-400 hover:text-amber-100 cursor-pointer border-accent mt-2 h-8 mx-auto text-red-400 font-semibold max-w-70 w-[50%] rounded-4xl '>Remove from list</button>
            </div>
                )
              })
            }

          </div>
            :
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto px-4 mt-6 bg-base-100'>
            {
              trips.length === 0 ? (
                <div className=' w-full md:translate-x-85  h-60 flex flex-col mx-auto justify-center items-center'>
                  <p className='font-header text-center '>you must add some trip from countries list<br />
                  there is nothing to show you :(</p>
                  <button onClick={()=>navigate('/')} className='text-primary-content p-3 font-pop cursor-pointer mt-5 rounded-4xl bg-primary '>Go Home</button>

                </div>
              )
              :(trips.map((countryName) =>{
                const countryData = countries.find(
                  (item) => item.name === countryName
                );
                if((!countryData) || trips.length===0){
                  return null;
                }
                return(
            <div className='min-w-0 w-full bg-base-200 rounded-3xl p-3 flex flex-col'>
              <img src={countryData.image} className='w-full h-44 sm:h-48 object-cover  rounded-2xl' />
              <p className=' text-primary px-5 font-semibold text-xl'>{countryName}</p>
              <button onClick={()=>navigate(`/trip/${countryName}`)} className='hover:bg-primary bg-primary/80 cursor-pointer   mt-2 h-10 mx-auto text-primary-content  max-w-70 w-[50%] rounded-4xl '>Manage Travel</button>
              <button onClick={()=>dispatch({type:"TOGGLE_TRIP_COUNTRY",payload:countryName})} className='hover:bg-red-400 hover:text-amber-100 cursor-pointer border-accent mt-2 h-8 mx-auto text-red-400 font-semibold max-w-70 w-[50%] rounded-4xl '>Remove from list</button>
            </div>
                )
              }))
            }

          </div>
        }
    </>
  )
}
