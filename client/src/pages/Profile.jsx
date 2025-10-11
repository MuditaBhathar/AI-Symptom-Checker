import React, {useEffect, useState} from 'react'
import axios from 'axios'

export default function Profile({user}){
  const [chats, setChats] = useState([])
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
  if (!user) return;

  const fetchChats = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/chat/history`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setChats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  fetchChats();
}, [user]);


  if(!user) return <div className='bg-glass p-6 rounded-xl'>Please login</div>
  return (
    <div className='bg-glass p-6 rounded-xl'>
      <h2 className='text-2xl font-semibold mb-2'>Profile</h2>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Symptom checks:</strong> {chats.length}</p>
    </div>
  )
}
