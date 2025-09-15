import React from 'react'
import Chat from './components/Chat'

export default function App(){
  return (
    <div className="app">
      <header><h1>AI Customer Support</h1></header>
      <main><Chat userId={'guest1'} /></main>
    </div>
  )
}
