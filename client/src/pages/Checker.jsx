// import React, {useEffect, useState} from 'react'
// import Sidebar from '../components/Sidebar'
// import ChatArea from '../components/ChatArea'
// import axios from 'axios'

// export default function Checker({user}){
//   const [selected, setSelected] = useState(null)
//   const [list, setList] = useState([])

//   useEffect(()=>{
//     const quick = localStorage.getItem('hsc_quick_symptom')
//     if(quick){
//       setSelected({symptom: quick, messages:[{role:'user', text:quick, time:Date.now()}]})
//       localStorage.removeItem('hsc_quick_symptom')
//     }
//     if(user) fetchHistory()
//   },[user])

//   const API_URL = import.meta.env.VITE_API_URL; 

//   const fetchHistory = async () => {
//   if(!user?.token) return; // ensure token exists
//   try {
//     const res = await axios.get(`${API_URL}/api/chat/history`, {
//       headers: { Authorization: `Bearer ${user.token}` }
//     });
//     setList(res.data);
//   } catch(err) {
//     console.error(err);
//   }
// };


//   return (
//     <div className='grid grid-cols-1 lg:grid-cols-4 gap-4'>
//       <div className='lg:col-span-1'>
//         <Sidebar chats={list} onSelect={(c)=>setSelected(c)} />
//       </div>
//       <div className='lg:col-span-3'>
//         <ChatArea initial={selected} user={user} onSaved={fetchHistory} />
//       </div>
//     </div>
//   )
// }


import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import ChatArea from '../components/ChatArea';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

export default function Checker({ user }) {
  const [selected, setSelected] = useState(null);
  const [list, setList] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const quick = localStorage.getItem('hsc_quick_symptom');
    if (quick) {
      setSelected({ symptom: quick, messages: [{ role: 'user', text: quick, time: Date.now() }] });
      localStorage.removeItem('hsc_quick_symptom');
    }
    if (user) fetchHistory();
  }, [user]);

  const fetchHistory = async () => {
    if (!user?.token) return; // ensure token exists
    try {
      const res = await axios.get(`${API_URL}/api/chat/history`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setList(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Optional: Render selected chat AI summary using ReactMarkdown
  const renderAISummary = () => {
    if (!selected?.aiSummary) return null;

    // Prefer Gemini raw text if available
    const textToRender = selected.aiSummary.raw || '';
    return (
      <div className="mt-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow max-h-[60vh] overflow-auto">
        <ReactMarkdown className="prose dark:prose-invert">{textToRender}</ReactMarkdown>
      </div>
    );
  };

  return (
    <div className='grid grid-cols-1 lg:grid-cols-4 gap-4'>
      {/* <div className='lg:col-span-1'>
        <Sidebar chats={list} onSelect={(c) => setSelected(c)} />
      </div> */}
      
<div className='lg:col-span-1'>
  <Sidebar 
    chats={list.map(chat => ({
      id: chat._id,
      title: chat.symptom,
      messages: chat.messages,
      aiSummary: chat.aiSummary
    }))} 
    onSelect={(c) => setSelected(c)}
  />
</div>

      <div className='lg:col-span-3 flex flex-col'>
        <ChatArea initial={selected} user={user} onSaved={fetchHistory} />
        {/* Render AI summary below chat area if selected */}
        {renderAISummary()}
      </div>
    </div>
  );
}
