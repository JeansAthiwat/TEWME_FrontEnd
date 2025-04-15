import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { jwtDecode } from "jwt-decode";

const Chatbox = ({ socket }) => {
  const [messages,setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [currentConv, setCurrentConv] = useState(0);
  const msgBoxRef = useRef(null);
  const bottomRef = useRef(null); // 👈 this is our scroll target
  const messageWindowRef = useRef(null);
  const isLoadingOlderMessages = useRef(false);
  const prevScrollHeightRef = useRef(0);
  const prevScrollTopRef = useRef(0);


  const user = jwtDecode(localStorage.getItem("token"));
  // console.log("user is",user);

  const formatMsg = (msg) => {
    return msg.match(/.{1,55}/g).join('<br />');
  }
  const formatPreviewMsg = (msg) => {
    return msg.substring(0,50) + "..."
  }

  useLayoutEffect(() => {
    const messageWindow = messageWindowRef.current;
  
    if (isLoadingOlderMessages.current) {
      const newScrollHeight = messageWindow.scrollHeight;
      const scrollDelta = newScrollHeight - prevScrollHeightRef.current;
  
      // 👇 Restore scroll to stay anchored on same message
      messageWindow.scrollTop = prevScrollTopRef.current + scrollDelta;
  
      isLoadingOlderMessages.current = false;
    } else {
      // Scroll to bottom only for new messages, not older ones
      bottomRef.current?.scrollIntoView();
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
      console.dir(data)
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
    const messageWindow = messageWindowRef.current;
  
    // Capture before state
    prevScrollHeightRef.current = messageWindow.scrollHeight;
    prevScrollTopRef.current = messageWindow.scrollTop;
    isLoadingOlderMessages.current = true;
  
    const response = await fetch(
      `http://localhost:39189/message/${conversations[currentConv]._id}?createdBefore=${messages[0].createdAt}`,
      {
        method: "GET",
        headers: {
          authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
    const data = await response.json();
    setMessages(prev => [...data, ...prev]);
  };
  
  
  

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
      <div className="flex justify-center mt-30">
        <div className="w-[30%] h-10 px-5">
          <h1 className='font-bold text-4xl mb-5 pl-3'>Contacts</h1>
          <ul className="flex flex-col gap-2">
          {conversations.map((conv, index) => 
            conv.participants.map((participant) => 
              participant._id !== user.id && (
                <li key={index} onClick={() => setCurrentConv(index)} className={`flex flex-row items-center gap-3 rounded-xl py-2 px-4 hover:cursor-default hover:bg-gray-300 ${index==currentConv?"bg-gray-200":"bg-gray-100"}`}>
                  <img className="w-10 h-10 rounded-full" src={participant.profilePicture} alt="d" />
                  <div>
                  <div className="conversation-name font-bold">{participant.firstname} {participant.lastname}</div>
                  <div className="conversation-name text-gray-600 truncate ">Course: {conv.courseId.course_name} </div>
                  <div className="last-message text-gray-400">{conv.lastMessage && formatPreviewMsg(conv.lastMessage.text)}</div>
                  </div>
                </li>
              )
            )
          )}
          </ul>
        </div>
        <div className="border-1 border-gray-200 rounded-xl w-[60%] h-full">
          <div ref={messageWindowRef} className="message-section w-full px-5 h-[75vh] overflow-y-scroll flex flex-col mx-auto">
            <button onClick={getOlderMessages} className='w-fit mx-auto bg-gray-50 border-2 border-gray-300 hover:border-gray-400 text-gray-500 font-bold py-2 px-4 rounded-full mt-2'>See Older</button>
            <ul className="flex flex-col gap-2 pt-5">
              {messages.map((msg, index) => {
                const msgDate = new Date(msg.createdAt);
                const prevDate = index > 0 ? new Date(messages[index - 1].createdAt) : null;

                const showDateSeparator =
                  !prevDate ||
                  msgDate.toDateString() !== prevDate.toDateString();

                return (
                  <React.Fragment key={index}>
                    {showDateSeparator && (
                      <li className="mx-auto my-2 text-xs text-gray-500 relative w-fit">
                        <div className="px-3 py-1 bg-gray-200 rounded-full">
                          {msgDate.toLocaleDateString(undefined, {
                            day: 'numeric',
                            month: 'short',
                            year: '2-digit',
                          })}
                        </div>
                      </li>
                    )}
                    <li
                      className={`w-fit rounded-3xl px-4 py-2 ${
                        msg.sender === user.id ? 'ml-auto bg-blue-100' : 'mr-auto bg-gray-100'
                      }`}
                    >
                      <div dangerouslySetInnerHTML={{ __html: formatMsg(msg.text) }}></div>
                      <div className="text-xs text-gray-400 mt-1 text-right">
                        {msgDate.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </li>
                  </React.Fragment>
                );
              })}
            </ul>
            <div ref={bottomRef}/>
          </div>
          <div className='relative mt-[0.5rem]'>
            <input ref={msgBoxRef} type='text' placeholder='type here' className='h-[3rem]'
              onKeyDown={(e) => {
                if (e.code === "Enter") {
                  e.preventDefault(); // optional: prevent space from being typed
                  handleSend();
                }}}/>
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
