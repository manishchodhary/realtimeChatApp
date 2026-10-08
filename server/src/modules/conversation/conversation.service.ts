
import { Prisma } from "@prisma/client";
import prisma from "../../lib/prisma.js";

export const getOrCreateDirectConversation  = async (
  currentUserId: string,
  otherUserId: string,
) => {
  if (currentUserId === otherUserId) {
    throw new Error("You cannot create a conversation with yourself");
  }

  const [fristUserId, secondUserId] = [currentUserId, otherUserId].sort();

  const directKey = `${fristUserId}:${secondUserId}`;

  const existingConversation = await prisma.conversation.findUnique({
    where: {
      directKey: directKey,
    },
    include: {
      conversationMembers: {
        select: {
          userId: true,
        },
      },
    },
  });
  if(existingConversation){
    return existingConversation;
  }
  try {
    const conversation = await prisma.conversation.create({
      data:{
        type:"DIRECT",
        directKey,
        conversationMembers:{
          create:[
            {userId:currentUserId},
            {userId:otherUserId}
          ]
        }
      },
     include:{
    conversationMembers:{
        select:{
          userId:true
        }
      }
     }
    })
    return conversation;
  } catch (error) {
    if(
error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ){
      const conversation = await prisma.conversation.findUnique({
        where:{
          directKey:directKey
        },
        include:{
          conversationMembers:{
            select:{
              userId:true
            }
          }
        }
      })
      if(conversation){
        return conversation;
      }
    }

    throw error;
  }
};
