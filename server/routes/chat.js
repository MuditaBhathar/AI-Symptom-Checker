const express = require('express');
const router = express.Router();
const axios = require('axios');
const Chat = require('../models/Chat');
const User = require('../models/User');

const auth = async (req,res,next)=>{
  const token = req.headers.authorization?.split(' ')[1];
  if(!token) return res.status(401).json({message:'No token'});
  try{
    const jwt = require('jsonwebtoken');
    const data = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = await User.findById(data.id).select('-passwordHash');
    next();
  }catch(e){ return res.status(401).json({message:'Invalid token'}) }
}

// router.post('/query', auth, async (req, res) => {
//   try {
//     const { symptom, messages } = req.body;
//     const prompt = `User presents symptoms: ${symptom}. Provide possible conditions, prioritized reasons, detailed home remedies & tips, and recommended next steps. Include a clear educational disclaimer.`;
//     const apiKey = process.env.GEMINI_API_KEY;
//     let aiResponse = { conditions: [], steps: [], remedies: [], raw: "mock response" };

//     if (apiKey) {
//       const resp = await axios.post(
//         'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
//         {
//           contents: [
//             {
//               parts: [
//                 {
//                   text: prompt
//                 }
//               ]
//             }
//           ]
//         },
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             'x-goog-api-key': apiKey
//           }
//         }
//       );

//       aiResponse.raw = resp.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from Gemini';
//     } else {
//       const lower = (symptom || '').toLowerCase();
//       if (lower.includes('fever')) {
//         aiResponse = {
//           conditions: ['Common cold', 'Influenza', 'Acute infection'],
//           remedies: ['Rest well', 'Hydration (oral fluids, ORS if needed)', 'Paracetamol for fever', 'Sponge bath for high fever'],
//           steps: ['Monitor temperature', 'Seek doctor if >3 days or breathing difficulty'],
//           raw: 'Mocked by server because GEMINI_API_KEY is not set.'
//         };
//       } else if (lower.includes('headache')) {
//         aiResponse = {
//           conditions: ['Tension headache', 'Migraine', 'Dehydration'],
//           remedies: ['Hydrate', 'Rest in dark room', 'Cold compress', 'OTC analgesics'],
//           steps: ['Avoid screen time, monitor severity', 'See doctor if sudden severe pain']
//         };
//       } else {
//         aiResponse = {
//           conditions: ['Viral infection', 'Allergic reaction', 'Other'],
//           remedies: ['Rest', 'Hydrate', 'Monitor symptoms'],
//           steps: ['If symptoms worsen, see a doctor']
//         };
//       }
//     }

//     const chat = new Chat({
//       userId: req.user._id,
//       symptom,
//       messages: messages || [],
//       aiSummary: aiResponse
//     });
//     await chat.save();

//     res.json({ chat, aiResponse });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
// });


router.post('/query', auth, async (req, res) => {
  try {
    const { symptom, messages } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;
    let aiResponse = {
      intro: '',
      conditions: [],
      remedies: [],
      steps: [],
      disclaimer: 'For educational purposes only.'
    };

    if (apiKey) {
      
      const prompt = `User presents symptoms: ${symptom}. Provide a very brief intro, list secondary causes in brief, detailed remedies, prioritized reasons in brief, and a one-line 10-15 words disclaimer.`;
      const resp = await axios.post(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
        {
          contents: [{ parts: [{ text: prompt }] }]
        },
        { headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey } }
      );

      aiResponse.raw = resp.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from Gemini';
    } else {
      const lower = (symptom || '').toLowerCase();
      aiResponse.intro = 'Brief summary based on your symptoms:';

      if (lower.includes('fever')) {
        aiResponse.conditions = ['Common cold', 'Influenza', 'Viral infection', 'Dehydration'];
        aiResponse.remedies = [
          'Rest well and sleep adequately.',
          'Hydrate with water, soups, and ORS.',
          'Paracetamol or other OTC meds as per dosage instructions.',
          'Cool compress or lukewarm sponge bath for high fever.',
          'Light, breathable clothing and comfortable environment.'
        ];
        aiResponse.steps = ['Viral infections are most common.', 'Some bacterial infections need urgent care.'];
      } else if (lower.includes('headache')) {
        aiResponse.conditions = ['Tension headache', 'Migraine', 'Dehydration'];
        aiResponse.remedies = [
          'Hydrate regularly.',
          'Rest in a quiet, dark room.',
          'Cold compress on forehead or neck.',
          'OTC pain relief as needed.',
          'Avoid screen exposure and stress.'
        ];
        aiResponse.steps = ['Stress and dehydration are common causes.', 'Severe or sudden headache may require medical attention.'];
      } else {
        aiResponse.conditions = ['Viral infection', 'Allergic reaction', 'Other minor causes'];
        aiResponse.remedies = ['Rest and hydration.', 'Monitor symptoms carefully.', 'Seek doctor if symptoms worsen.'];
        aiResponse.steps = ['Viral and allergic causes are common.', 'Seek professional help if symptoms persist.'];
      }

      aiResponse.raw = 'Mocked by server because GEMINI_API_KEY is not set.';
    }

    const chat = new Chat({ userId: req.user._id, symptom, messages: messages || [], aiSummary: aiResponse });
    await chat.save();

    res.json({ chat, aiResponse });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


router.get('/history', auth, async (req,res)=>{
  const chats = await Chat.find({userId:req.user._id}).sort({createdAt:-1}).limit(100);
  res.json(chats);
})

module.exports = router;
