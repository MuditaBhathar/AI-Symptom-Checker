import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Header({user,setUser,theme,setTheme,onLogout}){
  const navigate = useNavigate()
  const toggle = ()=>{
    const nt = theme==='light'?'dark':'light'
    setTheme(nt); localStorage.setItem('hsc_theme', nt); document.documentElement.classList.toggle('dark', nt==='dark')
  }
  return (
    <header className='bg-white dark:bg-gray-800 shadow sticky top-0 z-20'>
      <div className='max-w-6xl mx-auto flex items-center justify-between p-4'>
        <div className='flex items-center gap-3'>
          <div className='w-11 h-11 rounded-lg bg-gradient-to-br from-indigo-500 to-emerald-400 flex items-center justify-center text-white font-bold'>H</div>
          <div>
            <Link to='/' className='text-lg font-semibold'>Healthcare Symptom Checker</Link>
            <div className='text-xs text-gray-500 dark:text-gray-300'>Educational & Informational</div>
          </div>
        </div>
        <nav className='flex items-center gap-3'>
          <Link to='/' className='px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700'>Home</Link>
          <Link to='/checker' className='px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700'>Checker</Link>
          <Link to='/about' className='px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700'>About</Link>
          {user ? <Link to='/profile' className='px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700'>{user.name}</Link> : <Link to='/login' className='px-3 py-2 rounded bg-indigo-600 text-white'>Login</Link>}
          <button onClick={toggle} className='ml-2 p-2 rounded border'>{theme==='light'?'🌙':'☀️'}</button>
          {user && <button onClick={()=>{ onLogout(); navigate('/'); }} className='ml-2 px-3 py-2 rounded bg-red-500 text-white'>Logout</button>}
        </nav>
      </div>
    </header>
  )
}
