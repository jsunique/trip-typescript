import { useState } from "react"
import Navbar from "./components/Navbar"
import Section from "./components/Section"
import Cards from "./components/Cards"
import Home from "./components/Home"
import CountryDetail from "./components/CountryDetail"
import { Routes , Route } from "react-router"
import Profile from "./components/Profile"
import Login from "./components/Login"
import TripDetail from "./components/TripDetail"


function App() {
  const [them , setThem] = useState('light')
  function changeTheme(){
    setThem(current => current === "dark" ? 'light' : 'dark')
  }
  return (
    <div data-theme={them} className="bg-base-100 min-h-screen">
      <Navbar them={them} changeTheme={changeTheme} />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/country/:countryName" element={<CountryDetail />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/login" element={<Login />} />
      <Route path="/trip/:countryName" element={<TripDetail />} />
    </Routes>
    </div>
  )
}

export default App
