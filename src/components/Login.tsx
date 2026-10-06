import React, { useState , useContext } from 'react'
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router';


export default function Login() {
  const navigate = useNavigate();  
  const [username , setUsername] = useState('');
  const [password , setPassword] = useState('');
  const [error , setError] = useState("");
  const context = useContext(AppContext);
  if (context === null) {
    throw new Error("this is a problem")
  }
  const {state , dispatch} = context;
  const handleLogin = ()=>{
    if (!username.trim() || !password.trim()) {
      setError("password and username shouldnt be empty");
      setPassword("");
      setUsername("");
      return;
    }
    else{
    setError("");
          dispatch({
      type:"LOGIN",
      payload:username,
    });
    navigate("/");
    }

  }
  return (
    <div className='flex flex-col gap-3 mt-5 justify-center items-center'>
      <input onChange={(e)=>setUsername(e.target.value)} value={username} className='input' type="text" placeholder='write your username' />
      <input onChange={(e)=>setPassword(e.target.value)} value={password} className='input' type="text" placeholder='write your upassword' />
      <button onClick={handleLogin} className='btn btn-primary w-[10%]' type='submit'>submit</button>
      {
        (error && 
          <p className='text-red-400 font-medium'>{error}</p>
        )
      }
      <p >{state.currentUserId ?? "Guest"}</p>
      <button onClick={()=>dispatch({type:"LOGOUT"})}>LOGOUT</button>
    </div>
  )
}
