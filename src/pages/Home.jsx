import React from 'react'
import Sidebar from '../components/Sidebar'
import ChatBox from '../components/ChatBox'

export default function Home() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <ChatBox />
    </div>
  );
}
