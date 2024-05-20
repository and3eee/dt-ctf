"use server";

import { prisma } from "@/lib/prisma";
import { RiddleProps } from "@/types";
import { Riddle } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function CreateRiddle(formData: any, resources?: string[]) {
  //Ignore ID as its only used in update

  const out = await prisma.riddle.create({
    data: {
      riddle: formData.riddle?.toString() ?? "ERROR WHILE CREATING", //
      solution: formData.solution?.toString() ?? "ERROR WHILE CREATING", //
      sourceLocation: formData.sourceLocation?.toString() ?? undefined, //
      sourceDescription: formData.sourceDescription?.toString() ?? undefined, //
      sourceURL: formData.sourceURL?.toString() ?? undefined,
      sourcePlaceHolder: formData.sourcePlaceHolder?.toString() ?? undefined,
      difficulty:
        formData.difficulty !== "none"
          ? formData.difficulty?.toString()
          : undefined, //
      bucket:
        formData.bucket?.toString() !== "none"
          ? formData.bucket?.toString()
          : undefined, //
      topic:
        formData.topic?.toString() !== "none"
          ? formData.topic?.toString()
          : undefined, //
      author: formData.author?.toString(),
      implemented: formData.implemented, //
      validated: formData.validated, //
      showRiddleResource: formData.showRiddleResource
    },
  });
  if (resources) await UpdateResourceLinks(out, resources);

  return out;
}

export async function UpdateResourceLinks(riddle: any, resources: string[]) {
  const connectIds = await prisma.riddleResource.findMany({
    where: { name: { in: resources } },
  });

  const ids = connectIds.map((resource) => {
    return { id: resource.id };
  });
  const reset = await prisma.riddle.update({
    where: { id: riddle.id },
    data: { RiddleResource: { set: [] } },
  });
  const updateMessage = await prisma.riddle.update({
    where: { id: riddle.id },
    data: { RiddleResource: { connect: ids } }, include:{ RiddleResource:true}
  });

  return updateMessage;
}

export async function GenerateNewSolution() {
  var data = await prisma.riddle.findMany();
  data = data.filter((riddle: Riddle) => {
    riddle.solution.includes("_");
  });
  const existingIds = data.map(
    (riddle: Riddle) => riddle.solution.split("_")[0]
  );
  var gen: string;
  do {
    gen = Math.random().toString().split(".")[1].substring(0, 8);
  } while (existingIds.includes(gen));
  return "ctf_" + gen;
}

export async function EditRiddle(formData: any) {
  if (formData.id?.toString() == "NEW") return CreateRiddle(formData);
  else {
    //Logic to update a riddle

    const out = await prisma.riddle.update({
      where: { id: formData.id },
      data: {
        riddle: formData.riddle?.toString() ?? "ERROR WHILE CREATING", //
        solution: formData.solution?.toString() ?? "ERROR WHILE CREATING", //
        sourceLocation: formData.sourceLocation?.toString() ?? undefined, //
        sourceDescription: formData.sourceDescription?.toString() ?? undefined, //
        sourceURL: formData.sourceURL?.toString() ?? undefined,
        sourcePlaceHolder: formData.sourcePlaceHolder?.toString() ?? undefined,
        difficulty:
          formData.difficulty !== "none"
            ? formData.difficulty?.toString()
            : undefined, //
        bucket:
          formData.bucket?.toString() !== "none"
            ? formData.bucket?.toString()
            : undefined, //
        topic:
          formData.topic?.toString() !== "none"
            ? formData.topic?.toString()
            : undefined, //
        author: formData.author?.toString(),
        implemented: formData.implemented, //
        validated: formData.validated, //
        showRiddleResource: formData.showRiddleResource
      },
    });

    return out;
  }
}

export async function GetRiddles(includeResources?: boolean) {
  const out = await prisma.riddle.findMany({
    include: { RiddleResource: includeResources },
  });
  return out;
}


export async function DeleteRiddle(riddle:Riddle){
  return await prisma.riddle.delete({where:{id:riddle.id}})
}