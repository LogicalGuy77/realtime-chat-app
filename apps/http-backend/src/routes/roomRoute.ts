import express, { Router, Request, Response } from 'express';
import { CreateRoomSchema } from '@repo/common/config';
import {prisma} from "@repo/database/config"
import { authMiddleware } from '../middleware/authMiddleware';

export const roomRouter: Router = express.Router();

roomRouter.post('/create', authMiddleware, async (req : Request ,res : Response) => {
  try {
    const { name, roomId } = req.body;
    const admin = req.body.username;
    const id = req.body.user.id
    
    if (!name || !roomId || !admin) {
       res.status(400).json({ error: "Missing required fields: name, roomId, and username are required." });
       return;
    }

    
    const roomExists = await prisma.rooms.findFirst({
      where: { id: roomId }
    });
    if (roomExists) {
       res.status(400).json({ error: "Room already exists" });
       return;
    }

    
    const slugExists = await prisma.rooms.findFirst({
      where: { slug: name }
    });
    if (slugExists) {
      res.status(400).json({ error: "Room name already exists" });
      return;
    }

    
    const status = CreateRoomSchema.safeParse({ name });
    if (!status.success) {
       res.status(400).json({
        error: "Invalid room name",
        details: status.error.errors
      });
      return;
    }

    
    const room = await prisma.rooms.create({
      data: {
        id: roomId,
        slug: name,
        admin: admin
      }
    });

    if (!room) {
       res.status(500).json({ error: "Room creation failed" });
       return
    }

    await prisma.user.update({
      where: { id: id },
      data: {
        rooms: {
          connect: {
            id: roomId
          }
        }
      }
    });

     res.status(200).json({
      message: "Room created successfully",
      room: room
    });

  } catch (error) {
     res.status(500).json({ error: error instanceof Error ? error.message : error });
     return;
  }
});

roomRouter.post('/join', authMiddleware, async (req: Request, res: Response) => {
    try {
        const { roomId } = req.body;
        
        
        if (!roomId) {
            res.status(400).json({ error: "Room ID is required" });
            return;
        }
        
        
        const roomExist = await prisma.rooms.findFirst({
            where: { id: roomId }
        });
        
        if (!roomExist) {
            res.status(400).json({ error: "Room not found" });
            return;
        }
        
        
        const userId = req.body.user?.id;
        if (!userId) {
            res.status(400).json({ error: "User ID is missing from request" });
            return;
        }
        
        // Get room messages
        const messages = await prisma.messages.findMany({
            where: { roomId },
            orderBy: { createdAt: 'desc' },
            take: 50
        });
        
        // Connect user to room
        await prisma.user.update({
            where: { id: userId },
            data: {
                rooms: {
                    connect: [{ id: roomId }]  // Use array format for many-to-many relations
                }
            }
        });
        
        res.status(200).json({ 
            room: true,
            roomDetails: roomExist,
            messages: messages 
        });
    }
    catch (error) {
        console.error("Room join error:", error);
        res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
    }
});

roomRouter.get('/all', authMiddleware, async (req: Request, res: Response) => {
  
 try {
   const userId = req.body.user.id;
   if(!userId){
      res.status(400).json({ error: "UserId not found" });
      return;
   }
   const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { rooms: true }
   })
    if (!user) {
        res.status(400).json({ error: "User not found" });
        return;
    }
    const rooms = user.rooms || [];
    res.status(200).json({ rooms });
 } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : error });
    return;
 }
  
});