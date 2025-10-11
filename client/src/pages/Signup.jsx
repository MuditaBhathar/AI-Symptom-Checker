import React, {useState} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function Signup({setUser}){
  const [name,setName]=useState('')
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [age,setAge]=useState('')
  const [gender,setGender]=useState('')
  const nav = useNavigate()

const API_URL = import.meta.env.VITE_API_URL; 

const handle = async () => {
  try {
    const res = await axios.post(`${API_URL}/api/auth/signup`, {
      name, email, password, age, gender
    });

    const data = res.data;
    localStorage.setItem(
      'hsc_current_user',
      JSON.stringify({ ...data.user, token: data.token })
    );
    setUser({ ...data.user, token: data.token });
    nav('/checker');
  } catch (err) {
    alert(err.response?.data?.message || 'Signup failed');
  }
};


  return (
    <div className='max-w-md mx-auto bg-glass p-6 rounded-xl shadow'>
      <h3 className='text-lg font-semibold mb-2'>Sign up</h3>
      <input value={name} onChange={e=>setName(e.target.value)} placeholder='Full name' className='w-full p-2 border rounded mb-2' />
      <input value={email} onChange={e=>setEmail(e.target.value)} placeholder='Email' className='w-full p-2 border rounded mb-2' />
      <input type='password' value={password} onChange={e=>setPassword(e.target.value)} placeholder='Password' className='w-full p-2 border rounded mb-2' />
      <input value={age} onChange={e=>setAge(e.target.value)} placeholder='Age' className='w-full p-2 border rounded mb-2' />
      <select value={gender} onChange={e=>setGender(e.target.value)} className='w-full p-2 border rounded mb-2'>
        <option value=''>Select gender</option><option>Female</option><option>Male</option><option>Other</option>
      </select>
      <div className='flex justify-end gap-2'>
        <button onClick={()=>nav('/login')} className='px-3 py-2 rounded'>Login</button>
        <button onClick={handle} className='px-4 py-2 bg-indigo-600 text-white rounded'>Sign up</button>
      </div>
    </div>
  )
}
