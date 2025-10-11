import React, {useState} from 'react'
import axios from 'axios'

export default function About(){
  const [name,setName]=useState(''); const [email,setEmail]=useState(''); const [msg,setMsg]=useState('')
  const API_URL = import.meta.env.VITE_API_URL;

  const handle = async () => {
  try {
    await axios.post(`${API_URL}/api/feedback`, { name, email, message: msg });
    alert('Thanks for your feedback!');
    setName(''); setEmail(''); setMsg('');
  } catch (err) {
    console.error(err);
    alert('Failed to send feedback');
  }
};

  return (
    <div className='grid md:grid-cols-2 gap-4'>
      <div className='bg-glass p-6 rounded-xl shadow'>
        <h2 className='text-2xl font-semibold mb-2'>About Us</h2>
        <p className='text-sm text-gray-600 dark:text-gray-300'>We provide educational suggestions based on symptoms using an AI model. Not a replacement for medical diagnosis.</p>
        <div className='mt-4'>
          <h4 className='font-semibold'>Contact</h4>
          <p className='text-sm'>Email: support@healthcheck.ai</p>
          <p className='text-sm'>Website: www.healthcheck.ai</p>
        </div>
      </div>
      <div className='bg-glass p-6 rounded-xl shadow'>
        <h3 className='text-lg font-semibold mb-2'>Feedback</h3>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder='Name' className='w-full p-2 border rounded mb-2' />
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder='Email' className='w-full p-2 border rounded mb-2' />
        <textarea value={msg} onChange={e=>setMsg(e.target.value)} placeholder='Message' className='w-full p-2 border rounded mb-2'></textarea>
        <div className='flex justify-end'><button onClick={handle} className='px-4 py-2 bg-indigo-600 text-white rounded'>Send Feedback</button></div>
      </div>
    </div>
  )
}
