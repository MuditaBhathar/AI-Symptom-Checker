import React from 'react'
import { useNavigate } from 'react-router-dom'
const cards = [
  {symptom:'Fever and sore throat', summary:'Likely viral infection. Rest & hydrate.', remedies:[ 'Hydration (water, ORS)','Paracetamol as needed','Cool compress for high fever'], tips:['Monitor temp', 'Avoid crowding']},
  {symptom:'Sneezing and runny nose', summary:'Allergic rhinitis or common cold.', remedies:['Steam inhalation','Saline nasal drops','Antihistamines if allergic'], tips:['Avoid allergens','Use air purifier']},
  {symptom:'Headache and nausea', summary:'Possible migraine or dehydration.', remedies:['Hydrate','Rest in dark room','Cold compress on forehead'], tips:['Limit screens','Sleep well']},
  {symptom:'Stomach pain and indigestion', summary:'Likely indigestion.', remedies:['Small bland meals','Peppermint/mint tea','Avoid fatty food'], tips:['Eat slowly','Keep a food diary']},
  {symptom:'Shortness of breath', summary:'Serious — seek immediate care if severe.', remedies:['Sit upright','Avoid exertion','Use inhaler if prescribed'], tips:['If severe, call emergency']}
]
export default function Home(){
  const nav = useNavigate()
  return (
    <div className='grid lg:grid-cols-3 gap-4'>
      <div className='lg:col-span-2'>
        <div className='bg-glass p-6 rounded-xl shadow'>
          <h2 className='text-2xl font-semibold mb-2'>Quick Symptom Checks</h2>
          <p className='text-sm text-gray-600 dark:text-gray-300 mb-4'>Tap a card to start a guided symptom check with detailed remedies and tips.</p>
          <div className='grid sm:grid-cols-2 gap-4'>
            {cards.map((c,idx)=>(
              <div key={idx} className='p-4 rounded-xl border hover:shadow-lg transition cursor-pointer bg-white dark:bg-gray-800' onClick={()=>{ localStorage.setItem('hsc_quick_symptom', c.symptom); nav('/checker'); }}>
                <div className='font-semibold'>{c.symptom}</div>
                <div className='text-sm text-gray-600 dark:text-gray-300 mt-2'>{c.summary}</div>
                <div className='mt-3 text-sm'>
                  <strong>Remedies:</strong>
                  <ul className='list-disc list-inside text-gray-600 dark:text-gray-300'>
                    {c.remedies.map((r,i)=>(<li key={i}>{r}</li>))}
                  </ul>
                </div>
                <div className='mt-2 text-xs text-gray-500 dark:text-gray-400'>Tip: {c.tips[0]}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div>
        <div className='bg-glass p-6 rounded-xl shadow'>
          <h3 className='text-lg font-semibold'>How it works</h3>
          <p className='text-sm text-gray-600 dark:text-gray-300'>This is an educational tool. AI suggestions are for informational purposes only and not a diagnosis.</p>
          <div className='mt-4'>
            <button onClick={()=>nav('/signup')} className='px-4 py-2 bg-indigo-600 text-white rounded'>Create account</button>
          </div>
        </div>
        <div className='bg-glass p-4 rounded-xl shadow mt-4'>
          <h4 className='font-semibold'>Contact</h4>
          <p className='text-sm text-gray-600 dark:text-gray-300'>support@healthcheck.ai</p>
        </div>
      </div>
    </div>
  )
}
