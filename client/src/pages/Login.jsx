import React, {useState} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function Login({setUser}){
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const nav = useNavigate()

  const API_URL = import.meta.env.VITE_API_URL; 

  const handle = async () => {
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, { email, password });
      const data = res.data;

      localStorage.setItem(
        'hsc_current_user',
        JSON.stringify({ ...data.user, token: data.token })
      );

      setUser({ ...data.user, token: data.token });
      nav('/checker');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };


  return (
    <div className='max-w-md mx-auto bg-glass p-6 rounded-xl shadow'>
      <h3 className='text-lg font-semibold mb-2'>Login</h3>
      <input value={email} onChange={e=>setEmail(e.target.value)} placeholder='Email' className='w-full p-2 border rounded mb-2' />
      <input type='password' value={password} onChange={e=>setPassword(e.target.value)} placeholder='Password' className='w-full p-2 border rounded mb-2' />
      <div className='flex justify-end gap-2'>
        <button onClick={()=>nav('/signup')} className='px-3 py-2 rounded'>Sign up</button>
        <button onClick={handle} className='px-4 py-2 bg-indigo-600 text-white rounded'>Login</button>
      </div>
    </div>
  )
}
