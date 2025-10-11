// import React, {useEffect, useRef, useState} from 'react'
// import axios from 'axios'

// export default function ChatArea({initial,user,onSaved}){
//   const [messages, setMessages] = useState(initial?.messages || [])
//   const [input, setInput] = useState(initial?.symptom || '')
//   const [loading, setLoading] = useState(false)
//   const containerRef = useRef()

//   useEffect(()=>{
//     setMessages(initial?.messages || [])
//     setInput(initial?.symptom || '')
//   },[initial])

//   useEffect(()=>{ containerRef.current?.scrollTo({top: containerRef.current.scrollHeight, behavior:'smooth'}) },[messages])

//   const API_URL = import.meta.env.VITE_API_URL;
//   const submit = async () => {
//     if(!input.trim()) return;
//     const userMsg = { role:'user', text: input.trim(), time: Date.now() };
//     setMessages(prev => [...prev, userMsg]);
//     setInput('');
//     setLoading(true);
//     try {
//       const token = user?.token;
//       const res = await axios.post(`${API_URL}/api/chat/query`, 
//         { symptom: userMsg.text, messages: [...messages, userMsg] }, 
//         { headers: { Authorization: 'Bearer ' + token } }
//       );
//       const ai = res.data.aiResponse;
//       const assistant = { role:'assistant', text: formatAI(ai), ai, time: Date.now() };
//       setMessages(prev => [...prev, assistant]);
//       if(onSaved) onSaved();
//     } catch(err) {
//       console.error(err);
//       alert('Error contacting server');
//     } finally {
//       setLoading(false);
//     }
//   };


//   function formatAI(ai){
//     let s = '**Probable Conditions:**\n'
//     s += (ai.conditions||[]).map((c,i)=>`${i+1}. ${c}`).join('\n')
//     s += '\n\n**Remedies:**\n' + (ai.remedies||[]).map((r,i)=>`${i+1}. ${r}`).join('\n')
//     s += '\n\n**Next Steps:**\n' + (ai.steps||[]).map((r,i)=>`${i+1}. ${r}`).join('\n')
//     s += '\n\n_Disclaimer: For educational purposes only._'
//     return s
//   }

//   return (
//     <div className='bg-white dark:bg-gray-800 p-4 rounded-xl shadow h-[72vh] flex flex-col'>
//       <div ref={containerRef} className='flex-1 overflow-auto space-y-4 mb-3'>
//         {messages.length===0 && <div className='text-center text-gray-400 mt-12'>Enter symptoms to start</div>}
//         {messages.map((m,i)=>(
//           <div key={i} className={'max-w-3xl '+(m.role==='user'?'ml-auto text-right':'') }>
//             <div className={'inline-block p-3 rounded-lg '+(m.role==='user'?'bg-indigo-600 text-white':'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100')} dangerouslySetInnerHTML={{__html: formatText(m.text)}}></div>
//             <div className='text-xs text-gray-400 mt-1'>{new Date(m.time).toLocaleTimeString()}</div>
//           </div>
//         ))}
//       </div>
//       <div className='pt-3 border-t'>
//         <textarea value={input} onChange={e=>setInput(e.target.value)} className='w-full p-3 border rounded h-28 mb-2 bg-gray-50 dark:bg-gray-900' placeholder='Describe symptoms...'></textarea>
//         <div className='flex items-center justify-between'>
//           <div className='text-sm text-gray-500'>You can add more details if needed.</div>
//           <div>
//             <button onClick={()=>{ setInput(''); setMessages([]); }} className='px-3 py-2 rounded mr-2'>Clear</button>
//             <button onClick={submit} className='px-4 py-2 bg-indigo-600 text-white rounded'>{loading?'Thinking...':'Submit'}</button>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// function formatText(t){
//   return t.replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>').replace(/\n/g,'<br/>')
// }


import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

export default function ChatArea({ initial, user, onSaved }) {
  const [messages, setMessages] = useState(initial?.messages || []);
  const [input, setInput] = useState(initial?.symptom || '');
  const [loading, setLoading] = useState(false);
  const containerRef = useRef();

  useEffect(() => {
    setMessages(initial?.messages || []);
    setInput(initial?.symptom || '');
  }, [initial]);

  useEffect(() => {
    containerRef.current?.scrollTo({ top: containerRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const API_URL = import.meta.env.VITE_API_URL;

  const submit = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', text: input.trim(), time: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const token = user?.token;
      const res = await axios.post(
        `${API_URL}/api/chat/query`,
        { symptom: userMsg.text, messages: [...messages, userMsg] },
        { headers: { Authorization: 'Bearer ' + token } }
      );

      const ai = res.data.aiResponse;

      const assistant = {
        role: 'assistant',
        text: ai.raw || formatAI(ai), // use Gemini raw if available
        ai,
        time: Date.now()
      };

      setMessages(prev => [...prev, assistant]);
      if (onSaved) onSaved();
    } catch (err) {
      console.error(err);
      alert('Error contacting server');
    } finally {
      setLoading(false);
    }
  };

  // function formatAI(ai) {
  //   let s = '**Probable Conditions:**\n';
  //   s += (ai.conditions || []).map((c, i) => `${i + 1}. ${c}`).join('\n');
  //   s += '\n\n**Remedies:**\n' + (ai.remedies || []).map((r, i) => `${i + 1}. ${r}`).join('\n');
  //   s += '\n\n**Next Steps:**\n' + (ai.steps || []).map((r, i) => `${i + 1}. ${r}`).join('\n');
  //   s += '\n\n_Disclaimer: For educational purposes only._';
  //   return s;
  // }

  function formatAI(ai){
  let s = ''; 
  // 1. Short intro
  s += ai.raw?.split('\n')[0] || 'Here is an educational summary based on your symptoms.\n\n';
  
  // 2. Secondary Causes / Infections (brief)
  if(ai.conditions?.length){
    s += '**Possible Causes/Infections:**\n';
    s += ai.conditions.map(c => `- ${c}`).join('\n') + '\n\n';
  }

  // 3. Remedies (detailed)
  if(ai.remedies?.length){
    s += '**Remedies (Detailed):**\n';
    s += ai.remedies.map((r,i) => `${i+1}. ${r}`).join('\n') + '\n\n';
  }

  // 4. Prioritized Reasons (brief)
  if(ai.steps?.length){
    s += '**Prioritized Reasons:**\n';
    s += ai.steps.map(s => `- ${s}`).join('\n') + '\n\n';
  }

  // 5. Disclaimer (single line)
  s += '_Disclaimer: For educational purposes only._';
  return s;
}


  return (
    <div className='bg-white dark:bg-gray-800 p-4 rounded-xl shadow h-[72vh] flex flex-col'>
      <div ref={containerRef} className='flex-1 overflow-auto space-y-4 mb-3'>
        {messages.length === 0 && <div className='text-center text-gray-400 mt-12'>Enter symptoms to start</div>}
        {messages.map((m, i) => (
          <div key={i} className={'max-w-3xl ' + (m.role === 'user' ? 'ml-auto text-right' : '')}>
            <div
              className={
                'inline-block p-3 rounded-lg ' +
                (m.role === 'user'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100')
              }
              dangerouslySetInnerHTML={{ __html: formatText(m.text) }}
            ></div>
            <div className='text-xs text-gray-400 mt-1'>{new Date(m.time).toLocaleTimeString()}</div>
          </div>
        ))}
      </div>
      <div className='pt-3 border-t'>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          className='w-full p-3 border rounded h-28 mb-2 bg-gray-50 dark:bg-gray-900'
          placeholder='Describe symptoms...'
        ></textarea>
        <div className='flex items-center justify-between'>
          <div className='text-sm text-gray-500'>You can add more details if needed.</div>
          <div>
            <button
              onClick={() => {
                setInput('');
                setMessages([]);
              }}
              className='px-3 py-2 rounded mr-2'
            >
              Clear
            </button>
            <button onClick={submit} className='px-4 py-2 bg-indigo-600 text-white rounded'>
              {loading ? 'Thinking...' : 'Submit'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatText(t) {
  return t.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>');
}
