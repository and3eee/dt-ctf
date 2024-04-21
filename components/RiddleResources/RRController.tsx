"use server";
import { prisma } from "@/lib/prisma";
import { RiddleResource } from "@prisma/client";

export async function CreateRiddleResource(resource: RiddleResource) {
  const out = await prisma.riddleResource.create({
    data: {
      name: resource.name,
      description: resource.description,
      link: resource.link,
      AuthInfo: resource.AuthInfo,
      owner: resource.owner,
    },
  });

  return out;
}

export async function EditRiddleResource(resource: RiddleResource) {
  const out = await prisma.riddleResource.update({
    where: { id: resource.id },
    data: {
      name: resource.name,
      description: resource.description,
      link: resource.link,
      AuthInfo: resource.AuthInfo,
      owner: resource.owner,
    },
  });

  return out;
}

export async function GetRiddleResources() {
  return await prisma.riddleResource.findMany();
}
