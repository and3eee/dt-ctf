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
import { Title } from "@mantine/core";

export default async function RiddlePage() {

    return (
      <ContributorCheck>
        <Title>CTF Docs</Title>
      </ContributorCheck>
    );
}
