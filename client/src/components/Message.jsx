import React from 'react'
export default function Message({ m }){
  const cls = m.sender === 'user' ? 'msg user' : 'msg bot';
  return (
    <div className={cls}>
      <div className="bubble">{m.text}</div>
      <div className="time">{new Date(m.createdAt).toLocaleTimeString()}</div>
    </div>
  )
}
