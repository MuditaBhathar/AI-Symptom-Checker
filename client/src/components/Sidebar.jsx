// import React, {useState} from 'react'
// export default function Sidebar({chats,onSelect}){
//   const [q,setQ] = useState('')
//   const filtered = (chats||[]).filter(c=>c.symptom?.toLowerCase().includes(q.toLowerCase()))
//   return (
//     <div className='bg-white dark:bg-gray-800 p-3 rounded-xl shadow h-[72vh] overflow-auto'>
//       <div className='flex items-center justify-between mb-3'>
//         <h4 className='font-semibold'>History</h4>
//         <button onClick={()=>onSelect(null)} className='text-indigo-600'>New</button>
//       </div>
//       <input value={q} onChange={e=>setQ(e.target.value)} placeholder='Search' className='w-full p-2 border rounded mb-3 bg-gray-50 dark:bg-gray-900' />
//       {filtered.length ===0 ? <div className='text-sm text-gray-500'>No chats</div> :
//         filtered.map((c,i)=>(
//           <div key={i} onClick={()=>onSelect(c)} className='p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer mb-2'>
//             <div className='font-medium truncate'>{c.symptom}</div>
//             <div className='text-xs text-gray-500 dark:text-gray-400'>{new Date(c.createdAt).toLocaleString()}</div>
//           </div>
//         ))
//       }
//     </div>
//   )
// }


import React, {useState} from 'react'

export default function Sidebar({chats, onSelect}){
  const [q, setQ] = useState('')
  
  const filtered = (chats||[]).filter(c => c.symptom?.toLowerCase().includes(q.toLowerCase()))
  
  return (
    <div className='bg-white dark:bg-gray-800 p-3 rounded-xl shadow h-[72vh] overflow-auto'>
      <div className='flex items-center justify-between mb-3'>
        <h4 className='font-semibold'>History</h4>
        <button onClick={()=>onSelect(null)} className='text-indigo-600'>New</button>
      </div>

      <input 
        value={q} 
        onChange={e => setQ(e.target.value)} 
        placeholder='Search' 
        className='w-full p-2 border rounded mb-3 bg-gray-50 dark:bg-gray-900' 
      />

      {filtered.length === 0 ? (
        <div className='text-sm text-gray-500'>No chats</div>
      ) : (
        filtered.map((c, i) => (
          <div 
            key={i} 
            onClick={() => onSelect(c)} 
            className='p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer mb-2'
          >
            <div className='font-medium truncate'>{c.symptom}</div>
            <div className='text-xs text-gray-500 dark:text-gray-400'>
              {c.messages?.length} messages • {new Date(c.createdAt).toLocaleString()}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
