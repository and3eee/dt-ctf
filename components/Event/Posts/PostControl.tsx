"use server";

import { prisma } from "@/lib/prisma";
import { PostFull } from "./PostCard";
import { Post } from "@prisma/client";

export async function UpdatePost(post: Post, linkedUsers: string[]) {
  return await prisma.post.update({
    where: { id: post.id },
    data: {
      title: post.title,
      content: post.content,
      eventId: post.eventId,
      linkedUsers: {
        connect: linkedUsers.map((email: string) => {
          return { email: email };
        }),
      },
    },
  });
}

export async function CreatePost(post: Post, linkedUsers: string[]) {
  return await prisma.post.create({
    data: {
      title: post.title,
      content: post.content,
      eventId: post.eventId,
      linkedUsers: {
        connect: linkedUsers.map((email: string) => {
          return { email: email };
        }),
      },
    },
  });
}
