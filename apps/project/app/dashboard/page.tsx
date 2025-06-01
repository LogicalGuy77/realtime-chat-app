"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from "@repo/ui/button";
import {
  PlusCircle, Users, LogOut, Copy, ArrowRight,
  AlertCircle, Check, User, RefreshCcw
} from 'lucide-react';

export default function Dashboard() {
  const [userName, setUserName] = useState<string>('');
  const [roomCode, setRoomCode] = useState<string>('');
  const [roomName, setRoomName] = useState<string>(''); // New state for room name
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [joinError, setJoinError] = useState<string>('');
  const [createError, setCreateError] = useState<string>('');
  const [isGeneratingCode, setIsGeneratingCode] = useState<boolean>(false);
  const [isJoining, setIsJoining] = useState<boolean>(false);
  const [isCodeCopied, setIsCodeCopied] = useState<boolean>(false);
  const [activeRooms, setActiveRooms] = useState<any[]>([]);
  const router = useRouter();
  const burl = process.env.NEXT_PUBLIC_HTTP_BACKEND

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUserName = localStorage.getItem('userName');

    if (!token) {
      router.push('/signin');
      return;
    }

    if (storedUserName) {
      setUserName(storedUserName);
    }

    fetchActiveRooms();
  }, [router]);

  const fetchActiveRooms = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${burl}/api/room/all`, {
        headers: {
          'Authorization': `${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setActiveRooms(data.rooms || []);
      }
    } catch (error) {
      console.error("Failed to fetch active rooms:", error);
    }
  };

  const generateRoomCode = () => {
    setIsGeneratingCode(true);
    setCreateError('');

    try {
      const code = Math.floor(10000 + Math.random() * 90000).toString();
      setGeneratedCode(code);
      setIsCodeCopied(false);
      // Set default room name based on generated code
      setRoomName(`Room-${code}`);
    } catch (error) {
      setCreateError('Failed to generate a room code. Please try again.');
    } finally {
      setIsGeneratingCode(false);
    }
  };

  const copyCodeToClipboard = () => {
    if (generatedCode) {
      navigator.clipboard.writeText(generatedCode);
      setIsCodeCopied(true);
      setTimeout(() => setIsCodeCopied(false), 3000);
    }
  };

  const createRoom = async () => {
    if (!generatedCode) {
      setCreateError('Please generate a room code first');
      return;
    }

    if (!roomName.trim()) {
      setCreateError('Please enter a room name');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      const response = await fetch(`${burl}/api/room/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`
        },
        body: JSON.stringify({
          roomId: generatedCode,
          name: roomName.trim(),
          
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create room');
      }

      router.push(`/room/?roomId=${generatedCode}&roomName=${roomName}`);

    } catch (error) {
      console.error('Room creation error:', error);
      setCreateError(error instanceof Error ? error.message : 'Failed to create room');
    }
  };

  const joinRoom = async () => {
    setJoinError('');

    if (!roomCode || roomCode.length !== 5 || !/^\d+$/.test(roomCode)) {
      setJoinError('Please enter a valid 5-digit room code');
      return;
    }

    setIsJoining(true);

    try {
      const token = localStorage.getItem('token');
      
      
      const verifyResponse = await fetch(`${burl}/api/room/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', 
          'Authorization': `${token}`
        },
        body: JSON.stringify({
          roomId: roomCode
        })
      });

      if (!verifyResponse.ok) {
        const errorData = await verifyResponse.json().catch(() => ({}));
        console.error('Server error details:', errorData);
        throw new Error(errorData.error || 'Room not found or no longer active');
      }

      
      
      
      router.push(`/room/?roomId=${roomCode}&roomName=${roomName}`);
    } catch (error) {
      console.error('Room joining error:', error);
      setJoinError(error instanceof Error ? error.message : 'Failed to join room');
    } finally {
      setIsJoining(false);
    }
  };

  const signOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    router.push('/signin');
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white">



      <main className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-8">Welcome to your Dashboard</h2>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">

          <motion.div
            className="bg-neutral-800 rounded-xl overflow-hidden shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-600"></div>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <PlusCircle className="text-blue-400" size={24} />
                <h3 className="text-xl font-bold">Create a Room</h3>
              </div>

              <p className="text-gray-400 mb-6">
                Generate a unique 5-digit code, customize your room name, and share it with others to join.
              </p>

              {createError && (
                <div className="mb-4 flex items-center gap-2 text-red-400 bg-red-900/20 p-3 rounded-lg text-sm">
                  <AlertCircle size={16} />
                  <span>{createError}</span>
                </div>
              )}

              <div className="mb-4">
                <Button
                  text={isGeneratingCode ? "Generating..." : "Generate Code"}
                  onClick={generateRoomCode}

                  className={`w-full mb-4 py-3 rounded-lg font-medium ${isGeneratingCode
                      ? "bg-blue-600/50 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 transition-colors"
                    }`}
                />

                {generatedCode && (
                  <motion.div
                    className="bg-neutral-700 p-4 rounded-lg mb-4 flex justify-between items-center"
                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                  >
                    <div>
                      <div className="text-xs text-gray-400 mb-1">Your room code</div>
                      <div className="text-2xl font-mono font-bold tracking-wider">{generatedCode}</div>
                    </div>
                    <button
                      onClick={copyCodeToClipboard}
                      className="p-2 bg-neutral-600 hover:bg-neutral-500 rounded-lg transition-colors"
                      title="Copy code"
                    >
                      {isCodeCopied ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
                    </button>
                  </motion.div>
                )}

                
                {generatedCode && (
                  <motion.div
                    className="mb-4"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Room Name
                    </label>
                    <input
                      type="text"
                      value={roomName}
                      onChange={(e) => setRoomName(e.target.value)}
                      className="bg-neutral-700 w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      placeholder="Enter room name"
                      maxLength={30}
                    />
                    <div className="text-xs text-gray-400 mt-1 flex justify-between">
                      <span>Customize how your room appears to others</span>
                      <span>{roomName.length}/30</span>
                    </div>
                  </motion.div>
                )}

                <Button
                  text="Create & Enter Room"
                  onClick={createRoom}

                  className={`w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 ${!generatedCode
                      ? "bg-neutral-700 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-colors"
                    }`}
                />
              </div>
            </div>
          </motion.div>


          <motion.div
            className="bg-neutral-800 rounded-xl overflow-hidden shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <div className="h-2 bg-gradient-to-r from-green-500 to-teal-500"></div>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Users className="text-green-400" size={24} />
                <h3 className="text-xl font-bold">Join a Room</h3>
              </div>

              <p className="text-gray-400 mb-6">
                Enter a 5-digit room code to join an existing room instantly.
              </p>

              {joinError && (
                <div className="mb-4 flex items-center gap-2 text-red-400 bg-red-900/20 p-3 rounded-lg text-sm">
                  <AlertCircle size={16} />
                  <span>{joinError}</span>
                </div>
              )}

              <div className="mb-4">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Room Code
                </label>
                <input
                  type="text"
                  value={roomCode}
                  onChange={(e) => {

                    const value = e.target.value.replace(/[^0-9]/g, '').substring(0, 5);
                    setRoomCode(value);
                    setJoinError('');
                  }}
                  className="bg-neutral-700 w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-xl font-mono tracking-wider text-center"
                  placeholder="Enter 5-digit code"
                  maxLength={5}
                />

                <div className="mt-6">
                  <Button
                    text={isJoining ? "Joining..." : "Join Room"}
                    onClick={joinRoom}

                    className={`w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 ${isJoining || roomCode.length !== 5
                        ? "bg-neutral-700 cursor-not-allowed"
                        : "bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 transition-colors"
                      }`}
                  >
                    {!isJoining && <ArrowRight size={18} />}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Your Active Rooms</h3>
            <button
              onClick={fetchActiveRooms}
              className="flex items-center gap-2 text-sm text-gray-300 hover:text-white"
            >
              <RefreshCcw size={14} />
              <span>Refresh</span>
            </button>
          </div>

          {activeRooms.length === 0 ? (
            <div className="bg-neutral-800 rounded-lg p-8 text-center text-gray-400">
              <p>No active rooms found. Create or join a room to get started!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {activeRooms.map((room) => (
                <div
                  key={room.id}
                  className="bg-neutral-800 rounded-lg p-4 hover:bg-neutral-750 transition-colors"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-bold">{room.slug}</h4>
                    <div className="text-xs px-2 py-1 bg-neutral-700 rounded-full">
                      {room.userCount} users
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm mb-3 truncate">{room.description || `Room ID: ${room.id}`}</p>
                  <button
                    onClick={() => router.push(`/room/?roomId=${room.id}&roomName=${room.slug}`)}
                    className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
                  >
                    <span>Enter Room</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}