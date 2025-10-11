import React, {useEffect, useState} from 'react'
import {Routes, Route, useNavigate} from 'react-router-dom'
import Home from './pages/Home'
import Checker from './pages/Checker'
import About from './pages/About'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Header from './components/Header'

export default function App(){
  const [user, setUser] = useState(null)
  const [theme, setTheme] = useState('light')
  const navigate = useNavigate()

  useEffect(()=>{
    const t = localStorage.getItem('hsc_theme') || 'light'
    setTheme(t); document.documentElement.classList.toggle('dark', t==='dark')
    const raw = localStorage.getItem('hsc_current_user')
    if(raw) setUser(JSON.parse(raw))
  },[])

  const handleLogout = ()=>{
    localStorage.removeItem('hsc_current_user')
    setUser(null)
    navigate('/')
  }

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors'>
      <Header user={user} setUser={setUser} theme={theme} setTheme={setTheme} onLogout={handleLogout} />
      <main className='p-4 max-w-6xl mx-auto'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/checker' element={<Checker user={user} />} />
          <Route path='/about' element={<About />} />
          <Route path='/profile' element={<Profile user={user} />} />
          <Route path='/login' element={<Login setUser={setUser} />} />
          <Route path='/signup' element={<Signup setUser={setUser} />} />
        </Routes>
      </main>
    </div>
  )
}
