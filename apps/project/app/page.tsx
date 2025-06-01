"use client";
import { motion } from "framer-motion";
import { MessageCircle, Users, Code, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@repo/ui/button";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();

  
  const handleSignIn = () => {
    console.log("Sign In clicked");
    router.push("/signin");
  }

  const handleSignUp = () => {
    console.log("Sign Up clicked");
    router.push("/signup");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-900 to-neutral-950 flex flex-col">
      
      <div className="flex-1 flex flex-col justify-center items-center text-white px-4 py-20 relative">
       
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-500/10 rounded-full filter blur-3xl"></div>
        </div>
        
       
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8 pointer-events-none"
        >
          <div className="relative">
            <div className="h-24 w-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl rotate-12 absolute left-1/2 transform -translate-x-1/2"></div>
            <div className="h-24 w-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl -rotate-12 absolute left-1/2 transform -translate-x-1/2"></div>
            <div className="h-24 w-24 bg-neutral-900 rounded-2xl flex items-center justify-center relative">
              <Sparkles className="h-12 w-12 text-white" />
            </div>
          </div>
        </motion.div>
        
        
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300 leading-tight max-w-4xl pointer-events-none"
        >
          Create, Join and Talk in Rooms!
        </motion.h1>
        
       
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-6 text-lg md:text-xl text-gray-400 text-center max-w-2xl pointer-events-none"
        >
          The easiest way to connect with friends, colleagues, and communities in real-time chat rooms.
        </motion.p>
        
       
        <div className="flex flex-col sm:flex-row gap-4 mt-10 w-full max-w-md relative z-30">
         
          <motion.div 
            className="w-full sm:w-1/2 relative"
            style={{ pointerEvents: 'auto' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              delay: 0.7, 
              duration: 0.6,
              ease: "easeOut"
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <div className="relative w-full">
              <Button 
                text="Sign In"
                onClick={handleSignIn}
                className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold w-full text-xl rounded-xl py-4 transition-all flex items-center justify-center group cursor-pointer"
              />
              <ArrowRight className="absolute right-4 top-1/2 transform -translate-y-1/2 ml-2 h-5 w-5 transition-transform group-hover:translate-x-1 pointer-events-none" />
            </div>
          </motion.div>
          
         
          <motion.div 
            className="w-full sm:w-1/2 relative"
            style={{ pointerEvents: 'auto' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              delay: 0.8, 
              duration: 0.6,
              ease: "easeOut"
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Button 
              text="Sign Up"
              onClick={handleSignUp}
              className="bg-transparent border-2 border-blue-500/30 hover:border-blue-500/70 text-blue-400 hover:text-blue-300 font-semibold w-full text-xl rounded-xl py-4 transition-all cursor-pointer"
            />
          </motion.div>
        </div>
        
        
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 w-full max-w-5xl px-4 pointer-events-auto"
        >
          <div className="bg-neutral-800/50 backdrop-blur-sm p-6 rounded-2xl border border-neutral-700">
            <div className="h-12 w-12 bg-blue-500/20 rounded-full flex items-center justify-center mb-5">
              <MessageCircle className="h-6 w-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">Real-time Chat</h3>
            <p className="text-gray-400">
              Connect instantly with others through our lightning-fast messaging system.
            </p>
          </div>
          
          <div className="bg-neutral-800/50 backdrop-blur-sm p-6 rounded-2xl border border-neutral-700">
            <div className="h-12 w-12 bg-purple-500/20 rounded-full flex items-center justify-center mb-5">
              <Users className="h-6 w-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">Room Sharing</h3>
            <p className="text-gray-400">
              Create custom rooms and share access with a simple 5-digit code.
            </p>
          </div>
          
          <div className="bg-neutral-800/50 backdrop-blur-sm p-6 rounded-2xl border border-neutral-700">
            <div className="h-12 w-12 bg-emerald-500/20 rounded-full flex items-center justify-center mb-5">
              <Code className="h-6 w-6 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">Room Drawing</h3>
            <p className="text-gray-400">
              Collaborate with others through shared canvas drawing in real-time.
            </p>
          </div>
        </motion.div>
      </div>
      
      
      <div className="py-6 border-t border-neutral-800 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} Collab Space. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Page;