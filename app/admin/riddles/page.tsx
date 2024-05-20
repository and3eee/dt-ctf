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
import RiddleResourceList from "@/components/RiddleResources/RiddleResourceList";
import CounterMetricWheel from "@/components/General/CounterMetricWheel";
import RiddleListMetrics from "@/components/Riddle/RiddleListMetrics";
import { Center, Container, Stack } from "@mantine/core";

export const dynamic = "force-dynamic";

export default async function RiddlePage() {
  const riddles = await GetRiddles(true);
  const resources = await GetRiddleResources();

  if (riddles)
    return (
      <ContributorCheck>
        <Center>
          <Stack maw="90%" miw="75%" justify="center">
            <RiddleListMetrics riddles={riddles} />
            <RiddleResourceList resources={resources} />

            <RiddleModal
              resources={resources}
              buttonText={"Create New Riddle"}
              createNew
            />
            <TableSort riddles={riddles} resources={resources} />
          </Stack>
        </Center>
      </ContributorCheck>
    );
}
