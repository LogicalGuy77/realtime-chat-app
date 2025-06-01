import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/common-backend/config";
const secret = JWT_SECRET;
import { Request, Response, NextFunction } from "express";
import { prisma } from "@repo/database/config";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
         
       const token = req.headers.authorization;
       if(token && secret){
              try {
                const user = jwt.verify(token, secret);
                if(!user || typeof user === 'string'){
                    res.status(401).json({error: "Invalid Token"});
                    return;
                }
                const userExists = await prisma.user.findFirst({
                  where : {
                    id: (user as jwt.JwtPayload).id
                  }
                })
                req.body.user = user;
                req.body.username = userExists?.name;
                next();
              } catch (error) {
                res.status(401).json({error: "Invalid Token"});
              }
       }
       else{
           res.status(401).json({error: "Invalid Token"});
       }

}