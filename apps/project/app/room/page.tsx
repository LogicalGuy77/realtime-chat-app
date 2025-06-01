"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  User,
  LogOut,
  X,
  Users,
  MessageCircle,
  ArrowLeft,
  Menu,
  Info,
  Copy,
  Check,
  Pencil,
} from "lucide-react";


interface Message {
  id: string;
  message: string;
  from: string;
  senderId: string;
  time: string;
  isSystem?: boolean;
}

interface ChatUser {
  id: string;
  name: string;
  isOnline?: boolean;
}

// Create a separate component that uses useSearchParams
function RoomContent() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [roomName, setRoomName] = useState("Chat Room");
  const [roomId, setRoomId] = useState("12345");
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [isConnected, setIsConnected] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState("user1");
  const [userName, setUserName] = useState("Demo User");
  const [isCodeCopied, setIsCodeCopied] = useState(false);
  const [isMessageSending, setIsMessageSending] = useState(false);
  const [showDrawBoard, setShowDrawBoard] = useState(false);

  const ws = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const searchParams = useSearchParams();

  // Load user and room details from localStorage and URL params
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const storedUserName = localStorage.getItem("user");
    const roomIdParam = searchParams.get("roomId");
    const roomNameParam = searchParams.get("roomName");

    if (storedUserId) setUserId(storedUserId);
    if (storedUserName) setUserName(storedUserName);
    if (roomIdParam) setRoomId(roomIdParam);
    if (roomNameParam) setRoomName(roomNameParam);

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/signin");
    }
  }, [searchParams, router]);

  // Initialize WebSocket connection and message handlers
  useEffect(() => {
    if (!userId || !roomId) return;

    const wsUrl = "ws://localhost:8080";
    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      setIsConnected(true);
      if (ws.current?.readyState === WebSocket.OPEN) {
        ws.current.send(
          JSON.stringify({
            command: "connect",
            userId,
            userName,
            token: localStorage.getItem("token"),
          })
        );

        setTimeout(() => {
          if (ws.current?.readyState === WebSocket.OPEN) {
            ws.current.send(
              JSON.stringify({
                command: "joinRoom",
                userId,
                roomId,
                token: localStorage.getItem("token"),
              })
            );
          }
        }, 500);
      }
    };

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.error) {
          setError(data.error);
          return;
        }
        if (data.message) {
          const newMessage: Message = {
            id: Math.random().toString(36).substring(2, 9),
            message: data.message,
            from: data.from || "Unknown",
            senderId: data.senderId || "",
            time: data.time || new Date().toLocaleTimeString(),
            isSystem: data.isSystem || data.from === "System" || !data.from,
          };
          setMessages((prev) => [...prev, newMessage]);
          if (data.from === userName && isMessageSending) {
            setIsMessageSending(false);
          }
        }
        if (data.roomName) setRoomName(data.roomName);
        if (data.users) setUsers(data.users);
      } catch (err) {
        console.error("Error parsing message:", err);
      }
    };

    ws.current.onclose = () => {
      setIsConnected(false);
    };

    ws.current.onerror = () => {
      setError("Failed to connect to chat server. Please try refreshing the page.");
    };

    return () => {
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.close();
      }
    };
  }, [userId, userName, roomId, roomName]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!messageInput.trim() || !isConnected || !roomId) return;
    if (ws.current?.readyState === WebSocket.OPEN) {
      setIsMessageSending(true);
      const tempMessage: Message = {
        id: `temp-${Date.now()}`,
        message: messageInput,
        from: userName,
        senderId: userId,
        time: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, tempMessage]);
      ws.current.send(
        JSON.stringify({
          command: "message",
          userId,
          roomId,
          msg: messageInput,
          token: localStorage.getItem("token"),
        })
      );
      setMessageInput("");
    } else {
      setError("Connection to chat server lost. Please refresh the page.");
    }
  };

  const leaveRoom = () => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(
        JSON.stringify({
          command: "leaveRoom",
          userId,
          roomId,
          token: localStorage.getItem("token"),
        })
      );
    }
    router.push("/dashboard");
  };

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomId);
    setIsCodeCopied(true);
    setTimeout(() => setIsCodeCopied(false), 3000);
  };

  const signOut = () => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.close();
    }
    router.push("/signin");
  };

  return (
    <div className="flex h-screen bg-neutral-900 text-white">
      <div className="flex flex-col w-full h-full overflow-hidden">
        <header className="bg-neutral-800 shadow-md py-3 px-4 flex justify-between items-center">
          <div className="flex items-center">
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="p-1.5 rounded-lg hover:bg-neutral-700 mr-3 md:hidden"
            >
              <Menu size={20} />
            </button>
            <div>
              <h1 className="font-bold text-lg flex items-center">
                <MessageCircle className="text-green-400 mr-2" size={20} />
                {roomName}
              </h1>
              <div className="text-xs text-gray-400 flex items-center">
                <span>Room Code: {roomId}</span>
                <button
                  onClick={copyRoomCode}
                  className="ml-2 text-gray-400 hover:text-white"
                  title="Copy room code"
                >
                  {isCodeCopied ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            
            <button
              onClick={leaveRoom}
              className="text-sm bg-neutral-700 hover:bg-neutral-600 py-1.5 px-3 rounded-lg flex items-center gap-1"
              title="Leave room"
            >
              <ArrowLeft size={16} />
              <span className="hidden sm:inline">Leave</span>
            </button>
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center">
                <User size={16} />
              </div>
            </div>
          </div>
        </header>

        {showDrawBoard ? (
          <div className="flex-1 relative">
           
            <button
              onClick={() => setShowDrawBoard(false)}
              className="absolute top-4 right-4 bg-neutral-800 hover:bg-neutral-700 p-2 rounded-full shadow-lg z-10"
              title="Return to chat"
            >
              <MessageCircle size={20} />
            </button>
          </div>
        ) : (
          <>
            <div
              className="flex-1 overflow-y-auto py-4 px-4 space-y-4"
              style={{ scrollBehavior: "smooth" }}
            >
              {messages.length === 0 ? (
                <div className="flex h-full items-center justify-center text-gray-400">
                  <div className="text-center">
                    <MessageCircle className="mx-auto text-gray-600 mb-3" size={32} />
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.senderId === userId ? "justify-end" : "justify-start"
                    }`}
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`
                        max-w-[80%] sm:max-w-[70%] px-4 py-2.5 rounded-2xl shadow-sm
                        ${
                          msg.isSystem
                            ? "bg-neutral-700/50 text-gray-300"
                            : msg.senderId === userId
                            ? "bg-blue-600"
                            : "bg-neutral-700"
                        }
                      `}
                    >
                      {!msg.isSystem && msg.senderId !== userId && (
                        <div className="font-medium text-xs text-gray-300">
                          {msg.from}
                        </div>
                      )}
                      <div className="break-words">{msg.message}</div>
                      <div className="text-xs text-right mt-1 opacity-70">
                        {msg.time}
                      </div>
                    </motion.div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
              {!isConnected && (
                <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-red-900/80 text-white rounded-lg px-4 py-2 flex items-center">
                  <span className="animate-pulse mr-2">●</span>
                  <span>Reconnecting to server...</span>
                </div>
              )}
            </div>
            <div className="bg-neutral-800 px-4 py-3">
              <div className="flex items-center">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Type your message..."
                    disabled={!isConnected}
                    className="w-full bg-neutral-700 rounded-full py-2.5 pl-4 pr-10 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  {isMessageSending && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin h-5 w-5 border-2 border-blue-500 rounded-full border-t-transparent"></div>
                    </div>
                  )}
                </div>
                <button
                  onClick={sendMessage}
                  disabled={!messageInput.trim() || !isConnected}
                  className={`ml-2 p-2.5 rounded-full ${
                    !messageInput.trim() || !isConnected
                      ? "bg-neutral-700 text-gray-500 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <AnimatePresence>
        {showSidebar && (
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed inset-y-0 right-0 w-72 md:relative md:w-80 bg-neutral-800 border-l border-neutral-700 shadow-lg md:shadow-none z-10 flex flex-col"
          >
            <div className="p-4 border-b border-neutral-700 flex justify-between items-center">
              <h2 className="font-bold">Room Members</h2>
              <button
                onClick={() => setShowSidebar(false)}
                className="p-1.5 rounded-lg hover:bg-neutral-700 md:hidden"
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-1">
                {users.length === 0 ? (
                  <div className="text-gray-400 text-center py-6">
                    <Users className="mx-auto text-gray-600 mb-2" size={24} />
                    <p>No other users in this room</p>
                  </div>
                ) : (
                  users.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center p-2 rounded-lg hover:bg-neutral-700"
                    >
                      <div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center mr-3">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium flex items-center">
                          {user.name}
                          {user.id === userId && (
                            <span className="ml-2 text-xs bg-neutral-600 px-1.5 py-0.5 rounded">
                              You
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-400 flex items-center">
                          <span
                            className={`h-2 w-2 rounded-full ${
                              user.isOnline ? "bg-green-500" : "bg-gray-500"
                            } mr-1.5`}
                          ></span>
                          {user.isOnline ? "Online" : "Offline"}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="mt-8">
                <h3 className="font-semibold text-sm text-gray-400 mb-3">
                  Room Information
                </h3>
                <div className="bg-neutral-700 rounded-lg p-3 text-sm">
                  <div className="mb-2">
                    <div className="text-gray-400">Room ID</div>
                    <div>{roomId}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Created</div>
                    <div>Today at {new Date().toLocaleTimeString()}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-neutral-700">
              <button
                onClick={signOut}
                className="w-full py-2 px-3 bg-neutral-700 hover:bg-neutral-600 rounded-lg flex items-center justify-center gap-2"
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isMobile && (
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="fixed bottom-6 right-6 p-3 bg-neutral-800 hover:bg-neutral-700 rounded-full shadow-lg z-10 hidden md:block"
          title={showSidebar ? "Hide users" : "Show users"}
        >
          {showSidebar ? <ArrowLeft size={20} /> : <Users size={20} />}
        </button>
      )}

      {error && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-900/90 border border-red-700 text-white rounded-lg px-4 py-3 flex items-center shadow-lg z-50">
          <Info className="mr-2 flex-shrink-0" size={18} />
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-4 p-1 hover:bg-red-800 rounded-full"
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}


export default function RoomPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen bg-neutral-900 text-white items-center justify-center">
          <div className="text-center">
            <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent mx-auto mb-4"></div>
            <p className="text-xl">Loading room...</p>
          </div>
        </div>
      }
    >
      <RoomContent />
    </Suspense>
  );
}