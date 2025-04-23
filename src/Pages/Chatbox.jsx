import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { io } from "socket.io-client";
import { jwtDecode } from "jwt-decode";
import { CircleUser } from "lucide-react";
import LoadingScreen from "../Components/LoadingScreen/LoadingScreen";
import axios from "axios";

const Chatbox = () => {
  const baseURL = import.meta.env.VITE_BACKEND_BASE_URL;
  const [messageLoading, setMessageLoading] = useState(false);
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [currentConv, setCurrentConv] = useState(null);
  const msgBoxRef = useRef(null);
  const bottomRef = useRef(null); // 👈 this is our scroll target
  const messageWindowRef = useRef(null);
  const isLoadingOlderMessages = useRef(false);
  const prevScrollHeightRef = useRef(0);
  const prevScrollTopRef = useRef(0);

  const user = jwtDecode(localStorage.getItem("token"));
  // console.log("user is",user);

  const formatMsg = (msg) => {
    return msg.match(/.{1,55}/g).join("<br />");
  };
  const formatPreviewMsg = (msg) => {
    return msg.substring(0, 50) + (msg.length > 50 ? "..." : "");
  };

  useEffect(() => {
    // Connect to the Socket.IO server
    if (localStorage.getItem("token")) {
      const socketInstance = io(baseURL, {
        auth: {
          token: localStorage.getItem("token"),
        },
      });

      // Handle connection
      socketInstance.on("connect", () => {
        console.log(
          "✅ Connected to socket server with ID:",
          socketInstance.id
        );
      });

      socketInstance.on("connect_error", (err) => {
        console.error(
          "❌ Socket connection to",
          baseURL,
          "failed:",
          err.message
        );
      });

      // socketInstance.on("private message", ({ from, message }) => {
      //   console.log("TODO: Implement notification");
      // });

      socketInstance.on("message stored", (response) => {
        console.log(response);
      });

      setSocket(socketInstance);

      // Clean up when component unmounts
      return () => {
        socketInstance.disconnect();
      };
    }
  }, []);

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
    if (socket) {
      const handlePrivateMessage = ({ from, message, courseId, createdAt }) => {
        const newMessage = { sender: from, text: message, createdAt };
        // Check if message is for current conversation
        const isCurrent =
          conversations[currentConv]?.courseId._id === courseId._id &&
          conversations[currentConv].participants.some((p) => p._id === from);

        if (isCurrent) {
          setMessages((prev) => [...prev, newMessage]);
        }
        console.log(courseId);
        // Update conversations list
        setConversations((prevConvs) => {
          let updatedConvs = [...prevConvs];
          const convIndex = updatedConvs.findIndex(
            (conv) =>
              conv.courseId.id === courseId.id &&
              conv.courseId.participants === courseId.participants
          );

          if (convIndex !== -1) {
            const targetConv = { ...updatedConvs[convIndex] };

            // Update lastMessage
            targetConv.lastMessage.text = message;

            // If not currently open, increment unread count
            if (!isCurrent) {
              targetConv.unreadCount = (targetConv.unreadCount || 0) + 1;
            }

            // Remove from current position
            updatedConvs.splice(convIndex, 1);
            // Move to top
            updatedConvs.unshift(targetConv);
          }
          if (isCurrent) {
            setCurrentConv(0);
          } else if (convIndex > currentConv) {
            setCurrentConv(currentConv + 1);
          }
          console.log(updatedConvs);
          return updatedConvs;
        });
      };

      socket.on("private message", handlePrivateMessage);

      return () => {
        socket.off("private message", handlePrivateMessage);
      };
    }
  }, [socket, conversations, currentConv]);

  // useEffect(() => {
  //   if (currentConv === null) return;
  //   const resetUnreadCount = async () => {
  //     try{
  //       const response = await axios.patch(
  //         `http://localhost:39189/conversation/update/${conversations[currentConv]?._id}`,
  //         {}, // or your actual data
  //         {
  //           headers: {
  //             'Content-Type': 'application/json',
  //             'Authorization': `Bearer ${localStorage.getItem('token')}`
  //           }
  //         }
  //       );
  //       conversations[currentConv].unreadCount=0
  //     } catch(error){
  //       console.error(error.message, conversations[currentConv]._id);
  //     }
  //   }

  //   resetUnreadCount()

  // }, [currentConv, conversations[currentConv]?.lastMessage])

  useEffect(() => {
    const getConversations = async () => {
      setLoading(true);
      const response = await fetch("/api/conversation/user", {
        method: "GET",
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      console.dir(data);
      setConversations([...data]);
      setLoading(false);
      // console.log("User conversations", data);
    };
    getConversations();
  }, []);

  useEffect(() => {
    const getMessages = async () => {
      setMessageLoading(true);
      const response = await fetch(
        `/api/message/${conversations[currentConv]._id}`,
        {
          method: "GET",
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      setMessages([...data]);
      setMessageLoading(false);
      // console.log("messages are", data);
    };
    if (conversations.length) {
      getMessages();
    }
  }, [currentConv]);

  const handleChangeConvo = async (e) => {
    if (!conversations.length) return;

    setMessageLoading(true);
    setCurrentConv(e);
    const response = await fetch(
      `/api/message/${conversations[currentConv]._id}`,
      {
        method: "GET",
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    const data = await response.json();
    setMessages([...data]);
    setMessageLoading(false);
  };

  const getOlderMessages = async () => {
    const messageWindow = messageWindowRef.current;

    // Capture before state
    prevScrollHeightRef.current = messageWindow.scrollHeight;
    prevScrollTopRef.current = messageWindow.scrollTop;
    isLoadingOlderMessages.current = true;
    setMessageLoading(true);
    const response = await fetch(
      `/api/message/${conversations[currentConv]._id}?createdBefore=${messages[0].createdAt}`,
      {
        method: "GET",
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    const data = await response.json();
    setMessages((prev) => [...data, ...prev]);
    setMessageLoading(false);
  };

  const handleSend = async () => {
    const recipient = conversations[currentConv].participants.find(
      (participant) => participant._id !== user.id
    );
    console.log("recipient", recipient);
    socket.emit("private message", {
      conversationId: conversations[currentConv]._id,
      recipient: recipient._id,
      courseId: conversations[currentConv].courseId,
      message: msgBoxRef.current.value,
    });

    const newMessage = {
      sender: user.id,
      text: msgBoxRef.current.value,
      createdAt: new Date(Date.now()),
    };

    setMessages([...messages, newMessage]);
    setConversations((prevConvs) => {
      let updatedConvs = [...prevConvs];
      const convIndex = currentConv;
      const targetConv = { ...updatedConvs[convIndex] };

      // Update lastMessage
      targetConv.lastMessage = newMessage;

      // Remove from current position
      updatedConvs.splice(convIndex, 1);
      // Move to top
      updatedConvs.unshift(targetConv);

      return updatedConvs;
    });
    setCurrentConv(0);
    msgBoxRef.current.value = "";
  };
  return (
    <>
      {loading ? (
        <LoadingScreen />
      ) : (
        conversations.length > 0 && (
          <>
            <div className="flex justify-center mt-30 ">
              <div className="w-[30%] h-[85vh] min-w-50 max-w-100 pl-5 border-gray-200 border-1 flex flex-col">
                <div className="font-semibold text-4xl p-4 flex flex-row items-center">
                  <p>Contacts</p>
                </div>

                {/* Scrollable list */}
                <div className="flex-1 min-h-0 flex flex-col overflow-y-auto overflow-x-hidden gap-1 pr-2">
                  {conversations.map((conv, index) =>
                    conv.participants.map(
                      (participant) =>
                        participant._id !== user.id && (
                          <div
                            key={index}
                            onClick={() => setCurrentConv(index)}
                            className={`flex flex-row items-center gap-3 rounded-xl py-2 px-4 hover:cursor-default hover:bg-gray-200 ${
                              index === currentConv ? "bg-gray-100" : ""
                            }`}
                          >
                            <img
                              className="w-10 h-10 rounded-full object-cover"
                              src={participant.profilePicture}
                              alt="d"
                            />
                            <div>
                              <div className="conversation-name font-semibold truncate">
                                {participant.firstname} {participant.lastname}
                              </div>
                              <div className="conversation-name text-gray-600 truncate">
                                Course: {conv.courseId.course_name}
                              </div>
                              <div className="last-message text-gray-400 truncate flex flex-row gap-1 items-center">
                                <p>
                                  {conv.lastMessage &&
                                    formatPreviewMsg(conv.lastMessage.text)}
                                </p>
                              </div>
                            </div>
                          </div>
                        )
                    )
                  )}
                </div>
              </div>

              <div className="border-1 border-gray-200 border-l-0 w-[60%] h-[85vh]">
                {currentConv !== null && (
                  <>
                    <div className="border-b-1 border-gray-200 p-1">
                      {conversations[currentConv].participants.map(
                        (p, index) =>
                          p._id !== user.id && (
                            <div
                              key={index}
                              className={`overflow-hidden flex flex-row items-center gap-3 rounded-xl py-2 px-4 `}
                            >
                              <img
                                className="w-10 h-10 rounded-full object-cover"
                                src={p.profilePicture}
                                alt="d"
                              />
                              <div>
                                <div className="conversation-name font-semibold truncate">
                                  {p.firstname} {p.lastname}
                                </div>
                                <div className="conversation-name text-gray-600 truncate ">
                                  Course:{" "}
                                  {
                                    conversations[currentConv].courseId
                                      .course_name
                                  }{" "}
                                </div>
                              </div>
                            </div>
                          )
                      )}
                    </div>
                    <div
                      ref={messageWindowRef}
                      className="message-section w-full px-5 h-[70vh] overflow-y-scroll overflow-x-hidden flex flex-col mx-auto"
                    >
                      {messageLoading ? (
                        <LoadingScreen />
                      ) : (
                        <>
                          <button
                            onClick={getOlderMessages}
                            className="w-fit mx-auto bg-gray-50 border-2 border-gray-300 hover:border-gray-400 text-gray-500 font-bold py-2 px-4 rounded-full mt-2"
                          >
                            See Older
                          </button>
                          <ul className="flex flex-col gap-2 pt-5">
                            {messages.map((msg, index) => {
                              const msgDate = new Date(msg.createdAt);
                              const prevDate =
                                index > 0
                                  ? new Date(messages[index - 1].createdAt)
                                  : null;

                              const showDateSeparator =
                                !prevDate ||
                                msgDate.toDateString() !==
                                  prevDate.toDateString();

                              return (
                                <React.Fragment key={index}>
                                  {showDateSeparator && (
                                    <li className="mx-auto my-2 text-xs text-gray-500 relative w-fit">
                                      <div className="px-3 py-1 bg-gray-200 rounded-full">
                                        {msgDate.toLocaleDateString(undefined, {
                                          day: "numeric",
                                          month: "short",
                                          year: "2-digit",
                                        })}
                                      </div>
                                    </li>
                                  )}
                                  <li
                                    className={`w-fit rounded-3xl max-w-120 px-4 py-2 ${
                                      msg.sender === user.id
                                        ? "ml-auto bg-blue-100"
                                        : "mr-auto bg-gray-100"
                                    }`}
                                  >
                                    {/* <div dangerouslySetInnerHTML={{ __html: formatMsg(msg.text) }}></div> */}
                                    <div>{msg.text}</div>

                                    <div className="text-xs text-gray-400 mt-1 text-right">
                                      {msgDate.toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                    </div>
                                  </li>
                                </React.Fragment>
                              );
                            })}
                          </ul>
                          <div ref={bottomRef} />
                        </>
                      )}
                    </div>
                    <div className="relative  p-2 ">
                      <input
                        ref={msgBoxRef}
                        type="text"
                        placeholder="type here"
                        className="h-[3rem]"
                        onKeyDown={(e) => {
                          if (e.code === "Enter") {
                            e.preventDefault(); // optional: prevent space from being typed
                            handleSend();
                          }
                        }}
                      />
                      <button
                        onClick={handleSend}
                        className="absolute right-0 h-[3rem] bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r-lg mr-2"
                      >
                        Send
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </>
        )
      )}
    </>
  );
};

export default Chatbox;
