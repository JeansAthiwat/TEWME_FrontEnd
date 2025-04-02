import React, { useState, useRef } from 'react';
import "./CSS/Chatbox.css";

const Chatbox = ({ socket }) => {
  const [messages,setMessages] = useState(["Hello","Hi"])
  const msgIn = useRef("");

  const handleType = (val) => {
    msgIn.current = val;
  }
  const handleSend = () => {
    // for debug
    // console.log("message sent", msgIn.current);
    setMessages([...messages, msgIn.current])
  }
  return (
    <>
    <div className="message-section w-full px-5">
      <ul>
        {messages.map((msg,index) => <li key={index}>{msg}</li>)}
      </ul>
    </div>
    <div className='w-full px-5'>
      <input type='text' placeholder='type here' onChange={(e) => {handleType(e.target.value)}} />
      <button onClick={handleSend} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full'>Send</button>
    </div>
    </>
  )
}

export default Chatbox
