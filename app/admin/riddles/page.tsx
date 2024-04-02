import AdminCheck from "@/components/Auth/AdminCheck";
import RiddleCard from "@/components/Riddle/RiddleCard";
import RiddleModal from "@/components/Riddle/RiddleModal";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { Button } from "@nextui-org/button";
import RiddleList from "@/components/Riddle/RiddleList";

export const dynamic = "force-dynamic";
export const revalidate = 5;

export default async function RiddlePage(request: NextRequest) {
  const riddles = await prisma.riddle.findMany();

  return (
    <AdminCheck>
      <div className="grid gap-5 justify-center align-center">
        <RiddleModal
          id={"NEW"}
          riddle={""}
          solution={""}
          implemented={false}
          buttonText={"Create New Riddle"}
          validated={false}
        />
        <RiddleList riddles={riddles} />
        <div className="container mx-auto p-8">
          <div className="grid grid-cols-2 gap-3">
            {riddles.map((riddle) => {
              return (
                <RiddleCard
                  key={riddle.id}
                  admin={true}
                  id={riddle.id}
                  riddle={riddle.riddle}
                  solution={riddle.solution}
                  implemented={riddle.implemented}
                  sourceDescription={riddle.sourceDescription ?? undefined}
                  sourceLocation={riddle.sourceLocation ?? undefined}
                  sourcePlaceHolder={riddle.sourcePlaceHolder ?? undefined}
                  sourceURL={riddle.sourceURL ?? undefined}
                  bucket={riddle.bucket ?? undefined}
                  difficulty={riddle.difficulty ?? undefined}
                  topic={riddle.topic ?? undefined}
                  author={riddle.author ?? undefined}
                  answered
                  validated={riddle.validated}
                />
              );
            })}
          </div>
        </div>
      </div>
    </AdminCheck>
  );
}
