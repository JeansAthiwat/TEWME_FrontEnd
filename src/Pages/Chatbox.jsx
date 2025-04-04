import React, { useState, useRef, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";

const Chatbox = ({ socket }) => {
  const [messages,setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [currentConv, setCurrentConv] = useState(0);
  const msgBoxRef = useRef(null);
  const bottomRef = useRef(null); // 👈 this is our scroll target
  const messageWindowRef = useRef(null);
  const isLoadingOlderMessages = useRef(false);

  const user = jwtDecode(localStorage.getItem("token"));
  // console.log("user is",user);

  const formatMsg = (msg) => {
    return msg.match(/.{1,55}/g).join('<br />');
  }
  const formatPreviewMsg = (msg) => {
    return msg.substring(0,50) + "..."
  }
  
  // Scroll to bottom on messages change
  useEffect(() => {
    if(!isLoadingOlderMessages.current) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" }); // or "smooth"
    } else {
      isLoadingOlderMessages.current = false;
      // Scroll to ending of the old message
    }
  }, [messages]);

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
      setMessages([...data]);
      // console.log("messages are", data);
    }
    if(conversations.length) getMessages();
  },[conversations, currentConv])

  const getOlderMessages = async () => {
    isLoadingOlderMessages.current = true;
    const response = await fetch(`http://localhost:39189/message/${conversations[currentConv]._id}?createdBefore=${messages[0].createdAt}`, {
      method: "GET",
      headers: {
        authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    const data = await response.json();
    setMessages([...data, ...messages]);
  }

  const handleSend = async () => {
    const recipient = conversations[currentConv].participants.find(participant => participant._id !== user.id);
    console.log("recipient",recipient);
    socket.emit("private message", {
      conversationId: conversations[currentConv]._id,
      recipient: recipient._id,
      message: msgBoxRef.current.value
    });
    setMessages([...messages, { sender:user.id, text:msgBoxRef.current.value, createdAt: new Date(Date.now()) }])
    msgBoxRef.current.value = "";
  }
  return (
    <>
    {
      conversations.length &&
      <>
      <div className="flex mt-5 mx-auto">
        <div className="chat-list w-[30%] h-10 px-5">
          <h1 className='font-bold text-2xl ml-2'>Contacts</h1>
          <ul className="flex flex-col gap-2">
          {conversations.map((conv, index) => 
            conv.participants.map((participant) => 
              participant._id !== user.id && (
                <li key={index} onClick={() => setCurrentConv(index)} className={`rounded-xl py-2 px-4 hover:cursor-default hover:bg-gray-200 ${index==currentConv?"bg-gray-200":"bg-gray-50"}`}>
                  <div className="conversation-name font-bold">{participant.firstname} {participant.lastname}</div>
                  <div className="last-message text-gray-400">{formatPreviewMsg(conv.lastMessage.text)}</div>
                </li>
              )
            )
          )}
          </ul>
        </div>
        <div className="border-1 border-gray-200 rounded-xl w-[60%]">
          <div ref={messageWindowRef} className="message-section w-full px-5 h-[65vh] overflow-y-scroll flex flex-col mx-auto">
            <button onClick={getOlderMessages} className='w-fit mx-auto bg-gray-50 border-2 border-gray-300 hover:border-gray-400 text-gray-500 font-bold py-2 px-4 rounded-full mt-2'>See Older</button>
            <ul className="flex flex-col gap-2 pt-5">
              {messages.map((msg,index) => <li key={index} className={`w-fit rounded-3xl px-4 py-2 ${msg.sender==user.id?"ml-auto bg-blue-100":"mr-auto bg-gray-100"}`} dangerouslySetInnerHTML={{ __html: formatMsg(msg.text) }}></li>)}
            </ul>
            <div ref={bottomRef}/>
          </div>
          <div className='relative mt-[0.5rem]'>
            <input ref={msgBoxRef} type='text' placeholder='type here' className='h-[3rem]'/>
            <button onClick={handleSend} className='absolute right-0 h-[3rem] bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r-lg'>Send</button>
          </div>
        </div>
      </div>
      </>
    }
    </>
  )
}

export default Chatbox
