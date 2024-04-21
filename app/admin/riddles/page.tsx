import AdminCheck from "@/components/Auth/AdminCheck";
import RiddleCard from "@/components/Riddle/RiddleCard";
import RiddleModal from "@/components/Riddle/RiddleModal";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { TableSort } from "@/components/Riddle/TableSort";
import RiddleEdit from "@/components/Riddle/RiddleEdit";
import { Riddle } from "@prisma/client";
import ContributorCheck from "@/components/Auth/ContributorCheck";
import { GetRiddleResources } from "@/components/RiddleResources/RRController";
import { GetRiddles } from "@/components/Riddle/RiddleControl";

export const dynamic = "force-dynamic";
export const revalidate = 5;



export default async function RiddlePage() {
  const riddles = await GetRiddles(true);
  console.log(riddles);
  if (riddles)
    return (
      <ContributorCheck>
        <div className="grid gap-5 justify-center align-center">
          <RiddleModal buttonText={"Create New Riddle"} createNew />
          <TableSort riddles={riddles} />
        </div>
      </ContributorCheck>
    );
}
