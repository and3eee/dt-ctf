"use client";

import { prisma } from "@/lib/prisma";
import {
  Button,
  Collapse,
  Group,
  Loader,
  NavLink,
  ScrollArea,
  Stack,
} from "@mantine/core";
import { RiddleResource } from "@prisma/client";
import RiddleResourceCard from "./RiddleResourceCard";
import { GetRiddleResources } from "./RRController";
import { Suspense, useState } from "react";
import RiddleResourceModal from "./RiddleResourceModal";
import { useDisclosure } from "@mantine/hooks";
import {
  RiArrowDownSFill,
  RiArrowDropRightFill,
  RiArrowRightSFill,
  RiFile2Line,
} from "react-icons/ri";

export default function RiddleResourceList() {
  const load = async () => {
    const data = await GetRiddleResources();
    updateResources(data);
  };
  const [opened, { toggle }] = useDisclosure(false);

  const [resources, updateResources] = useState<RiddleResource[]>(() => {
    load();
    return [];
  });

  if (resources)
    return (
      <Stack gap="sm">
        <NavLink
          href="#resources"
          label="Riddle Resources"
          leftSection={<RiFile2Line size="1rem" />}
          rightSection={opened ? <RiArrowDownSFill /> : <RiArrowRightSFill />}
          onClick={toggle}
        />

        <Collapse in={opened}>
          <ScrollArea.Autosize mah="50rem" scrollbarSize={2} offsetScrollbars>
            <Stack gap="md">
              <Suspense fallback={<Loader />}>
                <RiddleResourceModal
                  createNew
                  resource={{
                    id: 0,
                    name: "New Resource",
                    description: null,
                    link: null,
                    AuthInfo: null,
                    owner: null,
                  }}
                />

                {resources &&
                  resources.map((resource: RiddleResource) => (
                    <RiddleResourceCard key={resource.id} resource={resource} />
                  ))}
              </Suspense>
            </Stack>
          </ScrollArea.Autosize>
        </Collapse>
      </Stack>
    );
}
