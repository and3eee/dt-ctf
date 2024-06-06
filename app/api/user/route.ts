import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 600;


export async function POST(request: Request) {
  const data = await request.json();

  const userEmail = await prisma.user.findFirst({
    where: { email: data.email },
  });
  if (userEmail) {
    return NextResponse.json({created:false, error:"Email already registered"}, { status: 500 });
  }

  const dataIn = await prisma.user.create({ data: data });

  return NextResponse.json({created: true},{status:200});
}
