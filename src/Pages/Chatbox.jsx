import React, { useState, useRef, useEffect } from 'react';
import "./CSS/Chatbox.css";
import { jwtDecode } from "jwt-decode";

const Chatbox = ({ socket }) => {
  const [messages,setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [currentConv, setCurrentConv] = useState(0);
  const msgBoxRef = useRef(null);

  const user = jwtDecode(localStorage.getItem("token"));
  // console.log("user jaa",user);

  useEffect(() => {
    if(socket) {

      const handlePrivateMessage = ({from, message}) => {
        if(conversations[currentConv].participants.some(participant => participant._id===from)) {
          const newMessage = { sender:from, text:message }
          console.log("Pre rerender messages", messages);
          setMessages(prev => [...prev, newMessage]);
        }
      }
      socket.on("private message", handlePrivateMessage)
      
      return () => {
        socket.off("private message", handlePrivateMessage);
      };
    }
  }, [socket, conversations, currentConv])

  useEffect(() => {
    const getConversations = async() => {
      const response = await fetch("http://localhost:39189/conversation/user", {
        method: "GET",
        headers: {
          authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setConversations([...data]);
      // console.log("User conversations", data);
    }
    getConversations();
  },[])

  useEffect(() => {
    const getMessages = async() => {
      const response = await fetch(`http://localhost:39189/message/${conversations[currentConv]._id}`, {
        method: "GET",
        headers: {
          authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setMessages([...messages, ...data]);
      // console.log("messages are", data);
    }
    if(conversations.length) getMessages();
  },[conversations, currentConv])

  const handleSwitchChannel = (val) => {
    setCurrentConv(val);
  }

  const handleSend = async () => {
    // for debug
    // console.log("message sent", msgIn.current);
    // const response = await fetch("http://localhost:39189/message", {
    //     method: "POST",
    //     headers: {
    //       authorization: `Bearer ${localStorage.getItem('token')}`,
    //       "Content-Type": "application/json" 
    //     },
    //     body: JSON.stringify({
    //       conversationId: conversations[currentConv]._id,
    //       text: msgBoxRef.current.value
    //     })
    // });
    // const data = await response.json();
    // // console.log("Created new message",data);
    // const updatedData = { ...data, sender: { ...data.sender, email: localStorage.getItem('email') } };
    // // Update the state with the modified message
    // setMessages([...messages, updatedData]);
    const recipient = conversations[currentConv].participants.find(participant => participant._id !== user.id);
    console.log("recipient",recipient);
    socket.emit("private message", {
      conversationId: conversations[currentConv]._id,
      recipient: recipient._id,
      message: msgBoxRef.current.value
    });
    setMessages([...messages, { sender:user.id, text:msgBoxRef.current.value }])
    msgBoxRef.current.value = "";
  }
  return (
    <>
    {
      conversations.length &&
      <>
      <div className="chat-list w-full h-10 bg-amber-400 px-5">
        <select onChange={(e) => {handleSwitchChannel(e.target.value)}}>
        {conversations.map((conv, index) => 
          conv.participants.map((participant) => 
            participant._id !== user.id && (
              <option key={index} value={index}>
                User: {participant.firstname} {participant.lastname}
              </option>
            )
          )
        )}
        </select>
      </div>
      <div className="message-section w-full px-5 h-[65vh] overflow-scroll">
        <ul>
          {messages.map((msg,index) => (msg.sender==user.id ? <li key={index} className='bg-blue-200'>{msg.text}</li> : <li key={index}>{msg.text}</li>))}
        </ul>
      </div>
      <div className='w-full px-5'>
        <input ref={msgBoxRef} type='text' placeholder='type here'/>
        <button onClick={handleSend} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full'>Send</button>
      </div>
      </>
    }
    </>
  )
}

export default Chatbox
