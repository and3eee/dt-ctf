"use server";

import { prisma } from "@/lib/prisma";
import { RiddleProps } from "@/types";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function CreateRiddle(formData: FormData) {
  //Ignore ID as its only used in update

  const out = await prisma.riddle.create({
    data: {
      riddle: formData.get("riddle")?.toString() ?? "ERROR WHILE CREATING", //
      solution: formData.get("solution")?.toString() ?? "ERROR WHILE CREATING", //
      sourceLocation: formData.get("sourceLocation")?.toString() ?? undefined, //
      sourceDescription:
        formData.get("sourceDescription")?.toString() ?? undefined, //
      sourceURL: formData.get("sourceURL")?.toString() ?? undefined,
      sourcePlaceHolder:
        formData.get("sourcePlaceHolder")?.toString() ?? undefined,
      difficulty:
        formData.get("difficulty") !== "none"
          ? formData.get("difficulty")?.toString()
          : undefined, //
      bucket:
        formData.get("bucket")?.toString() !== "none"
          ? formData.get("bucket")?.toString()
          : undefined, //
      topic:
        formData.get("topic")?.toString() !== "none"
          ? formData.get("topic")?.toString()
          : undefined, //
      author: formData.get("author")?.toString(),
      implemented: formData.get("implemented") == "implemented", //
      validated: formData.get("validated") == "validated", //
    },
  });

  return out;
}

export async function EditRiddle(formData: FormData) {
  if (formData.get("id")?.toString() == "NEW") return CreateRiddle(formData);
  else {
    //Logic to update a riddle

    const out = await prisma.riddle.update({
      where: { id: formData.get("id")?.toString() },
      data: {
        riddle: formData.get("riddle")?.toString() ?? "ERROR WHILE CREATING", //
        solution:
          formData.get("solution")?.toString() ?? "ERROR WHILE CREATING", //
        sourceLocation: formData.get("sourceLocation")?.toString() ?? undefined, //
        sourceDescription:
          formData.get("sourceDescription")?.toString() ?? undefined, //
        sourceURL: formData.get("sourceURL")?.toString() ?? undefined,
        sourcePlaceHolder:
          formData.get("sourcePlaceHolder")?.toString() ?? undefined,
        difficulty:
          formData.get("difficulty") !== "none"
            ? formData.get("difficulty")?.toString()
            : undefined, //
        bucket:
          formData.get("bucket")?.toString() !== "none"
            ? formData.get("bucket")?.toString()
            : undefined, //
        topic:
          formData.get("topic")?.toString() !== "none"
            ? formData.get("topic")?.toString()
            : undefined, //
        author: formData.get("author")?.toString(),
        implemented: formData.get("implemented") == "implemented", //
        validated: formData.get("validated") == "validated", //
      },
    });

    return out;
  }
}

export async function GetRiddles() {
  const out = await prisma.riddle.findMany();
  return out;
}
