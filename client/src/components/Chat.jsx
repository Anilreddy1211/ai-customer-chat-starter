import React, { useState, useEffect, useRef } from 'react'
import Message from './Message'
import { sendMessage, fetchHistory } from '../api'

export default function Chat({ userId = 'guest' }){
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(()=>{ (async ()=>{
    const h = await fetchHistory(userId);
    setMessages(h.messages || []);
    scrollToEnd();
  })() }, [])

  function scrollToEnd(){ endRef.current?.scrollIntoView({ behavior: 'smooth' }); }

  async function handleSend(){
    if (!input.trim()) return;
    const text = input.trim();
    const newMsgs = [...messages, { sender: 'user', text, createdAt: new Date().toISOString() }];
    setMessages(newMsgs); setInput(''); setLoading(true); scrollToEnd();
    try{
      const res = await sendMessage(userId, text);
      const botText = res.reply || 'Sorry, no reply';
      const after = [...newMsgs, { sender: 'bot', text: botText, createdAt: new Date().toISOString() }];
      setMessages(after);
      setLoading(false); scrollToEnd();
    }catch(e){
      setMessages(prev=>[...prev, { sender:'bot', text: 'Error from server', createdAt: new Date().toISOString() }]);
      setLoading(false);
    }
  }

  function onKey(e){ if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }

  return (
    <div className="chat-window">
      <div className="messages">
        {messages.map((m,i)=>(<Message key={i} m={m} />))}
        <div ref={endRef} />
      </div>
      <div className="composer">
        <textarea value={input} onChange={e=>setInput(e.target.value)} onKeyDown={onKey} placeholder="Type a message..." />
        <button onClick={handleSend} disabled={loading}>{loading ? 'Agent typing...' : 'Send'}</button>
      </div>
    </div>
  )
}
